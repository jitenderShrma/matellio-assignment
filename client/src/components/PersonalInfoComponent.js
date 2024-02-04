import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { getPersonalInfo, submitPersonalInfo } from '../store/actions/userAction';
import FlashMessage from '../components/common/FlashMessage';

const PersonInfoForm = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const [addressValidationErrors, setAddressValidationErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [flash, setFlash] = useState({ showMessage: false, message: '', type: '' });

    const [personInfo, setPersonInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        gender: ''
    });

    const [addresses, setAddresses] = useState([
        {
            city: '',
            state: '',
            postalCode: '',
            country: '',
            street: '',
        },
    ]);
    const formattedDate = (dob) => {
        return new Date(dob).toISOString().split('T')[0];
    }


    const handleInputChange = (field, value) => {
        setPersonInfo((prevPersonInfo) => ({
            ...prevPersonInfo,
            [field]: value,
        }));
    };

    const handleAddressChange = (index, field, value) => {
        setAddresses((prevAddresses) => {
            const newAddresses = [...prevAddresses];
            newAddresses[index][field] = value;
            return newAddresses;
        });
    };

    const handleAddAddress = () => {
        setAddresses((prevAddresses) => [
            ...prevAddresses,
            {
                city: '',
                state: '',
                postalCode: '',
                country: '',
                street: '',
            },
        ]);
    };
    const addressValidation = () => {
        return addresses.map((address, index) => {
            const addressError = {};
            if (!address.city) {
                addressError.city = `City required`;
            }
            if (!address.state) {
                addressError.state = `State required`;
            }
            if (!address.postalCode) {
                addressError.postalCode = `Postal Code required`;
            }
            if (!address.country) {
                addressError.country = `Country required`;
            }
            if (!address.street) {
                addressError.street = `Street required`;
            }
            return addressError;
        });

    }
    const personInfoValidator = () => {
        const errors = {};
        if (!personInfo.firstName) {
            errors.firstName = 'FirstName required';
        }
        if (!personInfo.lastName) {
            errors.lastName = 'LastName required';
        }
        if (!personInfo.email) {
            errors.email = 'Email required';
        }
        if (!personInfo.phoneNumber) {
            errors.phoneNumber = 'phoneNumber required';
        }
        if (!personInfo.dateOfBirth) {
            errors.dateOfBirth = 'dateOfBirth required';
        }
        if (!personInfo.gender) {
            errors.gender = 'Gender required';
        }
        if (personInfo.dateOfBirth) {
            const dob = new Date(personInfo.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18) {
                errors.dateOfBirth = 'Must be 18 years or older';
            } else {
                delete errors.dateOfBirth;
            }
        }
        if (personInfo.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(personInfo.email)) {
                errors.email = 'Invalid Email';
            } else {
                delete errors.email;
            }
        }
        if (personInfo.phoneNumber) {
            const mobileRegex = /^\d{10}$/;
            if (!mobileRegex.test(personInfo.phoneNumber)) {
                errors.phoneNumber = 'Mobile number must be 10 digits only'
            } else {
                delete errors.phoneNumber;
            }
        }
        return errors;
    }
    const handleSubmit = async () => {
        // validation
        const personalInfoErrors = personInfoValidator();
        let addressErrors = addressValidation();
        if (Object.keys(personalInfoErrors).length > 0) {
            setValidationErrors(personalInfoErrors);
        } else {
            setValidationErrors({});
        }

        addressErrors = addressErrors.filter(each => {
            return Object.keys(each).length > 0
        });
        setAddressValidationErrors(addressErrors);
        if (Object.keys(addressErrors).length > 0) {
            setAddressValidationErrors(addressErrors);
        } else {
            setAddressValidationErrors({})
        }

        if (Object.keys(addressErrors).length > 0 || Object.keys(personalInfoErrors).length > 0) {
            return;
        }

        const formData = {
            firstName: personInfo.firstName,
            lastName: personInfo.lastName,
            email: personInfo.email,
            dateOfBirth: personInfo.dateOfBirth,
            phoneNumber: personInfo.phoneNumber,
            gender: personInfo.gender,
            addresses: addresses.map((address) => ({
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
            })),
        };
        const result = await submitPersonalInfo(formData);
        if (result.status === 'success') {
        setFlash({ showMessage: true, message: 'Successfully submitted', type: 'success' });
        //   handleClose();
        setSubmitted(true);
        } else {
          setFlash({ showMessage: true, message: result.message, type: 'danger' });
        }


    };
    const handleDeleteAddress = (index) => {
        setAddresses((prevAddresses) => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses.splice(index, 1);
            return updatedAddresses;
        });
        const associatedErrors = addressValidationErrors[index];
        if (Object.keys(associatedErrors).length > 0) {
            setAddressValidationErrors(addressValidationErrors.filter((each, errorIndex) => errorIndex != index));
        }

    };
    useEffect(() => {
        getPersonalInfo().then(result => {
            if (result.status === 'success') {
                const user = result.user;
                if (user.Addresses.length > 0) {
                    setSubmitted(true);
                    setAddresses(user.Addresses);
                    setPersonInfo({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        dateOfBirth: user.dateOfBirth,
                        phoneNumber: user.phoneNumber,
                        gender: user.gender
                    })
                }
            }
        })
    }, []);


    return (
        <Container>
            <Form>
                <h2>Person Information</h2>
                <Row>
                    <Col>
                        <Form.Group controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={submitted}
                                placeholder="Enter first name"
                                value={personInfo.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={validationErrors.firstName && 'is-invalid'}
                            />
                            {validationErrors.firstName && <label className='invalid-feedback'>{validationErrors.firstName}</label>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={submitted}
                                placeholder="Enter last name"
                                value={personInfo.lastName}
                                className={validationErrors.lastName && 'is-invalid'}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                            {validationErrors.lastName && <label className='invalid-feedback'>{validationErrors.lastName}</label>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                disabled={submitted}
                                placeholder="Enter email"
                                value={personInfo.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={validationErrors.email && 'is-invalid'}
                            />
                            {validationErrors.email && <label className='invalid-feedback'>{validationErrors.email}</label>}

                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="dob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                disabled={submitted}
                                placeholder="Enter date of birth"
                                value={submitted ? formattedDate(personInfo.dateOfBirth) : personInfo.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className={validationErrors.dateOfBirth && 'is-invalid'}
                            />
                            {validationErrors.dateOfBirth && <label className='invalid-feedback'>{validationErrors.dateOfBirth}</label>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={submitted}
                                placeholder="Enter mobile number"
                                value={personInfo.phoneNumber}
                                onChange={(e) => {
                                    if (!/^\d*$/.test(e.target.value)) {
                                        return;
                                    }
                                    handleInputChange('phoneNumber', e.target.value)
                                }}
                                className={validationErrors.phoneNumber && 'is-invalid'}
                            />
                            {validationErrors.phoneNumber && <label className='invalid-feedback'>{validationErrors.phoneNumber}</label>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                                disabled={submitted}
                                className={validationErrors.gender && 'is-invalid'}
                                as="select"
                                value={personInfo.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                            {validationErrors.gender && <label className='invalid-feedback'>{validationErrors.gender}</label>}
                        </Form.Group>
                    </Col>
                </Row>
                <div className='mt-3'>
                    <h2>Address</h2>
                </div>
                {addresses.map((address, index) => (
                    <Row key={index}>
                        <Col>
                            <Form.Group controlId={`city-${index}`}>
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled={submitted}
                                    placeholder="Enter city"
                                    value={address.city}
                                    className={addressValidationErrors[index] && addressValidationErrors[index].city && 'is-invalid'}
                                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                />
                                {addressValidationErrors[index] && addressValidationErrors[index].city && <label className='invalid-feedback'>{addressValidationErrors[index].city}</label>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId={`state-${index}`}>
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled={submitted}
                                    placeholder="Enter state"
                                    value={address.state}
                                    className={addressValidationErrors[index] && addressValidationErrors[index].state && 'is-invalid'}
                                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                                />
                                {addressValidationErrors[index] && addressValidationErrors[index].state && <label className='invalid-feedback'>{addressValidationErrors[index].state}</label>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId={`postalCode-${index}`}>
                                <Form.Label>ZIP</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled={submitted}
                                    placeholder="Enter ZIP code"
                                    value={address.postalCode}
                                    onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                                    className={addressValidationErrors[index] && addressValidationErrors[index].postalCode && 'is-invalid'}
                                />
                                {addressValidationErrors[index] && addressValidationErrors[index].postalCode && <label className='invalid-feedback'>{addressValidationErrors[index].postalCode}</label>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId={`country-${index}`}>
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled={submitted}
                                    placeholder="Enter country"
                                    value={address.country}
                                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                    className={addressValidationErrors[index] && addressValidationErrors[index].country && 'is-invalid'}

                                />
                                {addressValidationErrors[index] && addressValidationErrors[index].country && <label className='invalid-feedback'>{addressValidationErrors[index].country}</label>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId={`street-${index}`}>
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled={submitted}
                                    placeholder="Enter street"
                                    value={address.street}
                                    className={addressValidationErrors[index] && addressValidationErrors[index].street && 'is-invalid'}
                                    onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                                />
                                {addressValidationErrors[index] && addressValidationErrors[index].street && <label className='invalid-feedback'>{addressValidationErrors[index].street}</label>}
                            </Form.Group>
                        </Col>
                        <Col className="d-flex align-items-end">
                            <Button disabled={submitted} variant="danger" onClick={() => handleDeleteAddress(index)}>
                                Delete
                            </Button>
                        </Col>
                    </Row>
                ))}
                {<div className='mt-3'>
                    <Button disabled={submitted} variant="primary" onClick={handleAddAddress} style={{ marginRight: '10px' }}>
                        Add Address
                    </Button>
                    <Button disabled={submitted || addresses.length === 0} variant="success" onClick={handleSubmit} >
                        Submit
                    </Button>
                </div>}
            </Form>
            {flash.showMessage && (
                <FlashMessage
                    message={flash.message}
                    variant={flash.type}
                    onClose={() => {
                        setFlash({ showMessage: false, type: '', message: '' })
                    }}
                />
            )}
        </Container>
    );
};

export default PersonInfoForm;
