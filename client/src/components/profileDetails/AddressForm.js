
import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';


const AddressForm = ({addresses, setAddresses, submitted, addressValidationErrors, setAddressValidationErrors}) => {
    const handleAddressChange = (index, field, value) => {
        setAddresses((prevAddresses) => {
            const newAddresses = [...prevAddresses];
            newAddresses[index][field] = value;
            return newAddresses;
        });
    };


    const handleDeleteAddress = (index) => {
        setAddresses((prevAddresses) => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses.splice(index, 1);
            return updatedAddresses;
        });

        const associatedErrors = addressValidationErrors[index];
        if (Object.keys(associatedErrors).length > 0) {
            setAddressValidationErrors(addressValidationErrors.filter((each, errorIndex) => errorIndex !== index));
        }
    };

    return (
        <>
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
                                onChange={(e) => {
                                    if (!/^\d*$/.test(e.target.value)) {
                                        return;
                                      }
                                    handleAddressChange(index, 'postalCode', e.target.value)}
                                }
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
        </>
    );
};

export default AddressForm;
