
import React, { useState, useEffect } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import AddressForm from './AddressForm';
import { getPersonalInfo, submitPersonalInfo } from '../../store/actions/userAction';
import FlashMessage from '../common/FlashMessage';
import { Form, Button, Container } from 'react-bootstrap';


const MainForm = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [addressValidationErrors, setAddressValidationErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [flash, setFlash] = useState({ showMessage: false, message: '', type: '' });
  const [addresses, setAddresses] = useState([
    {
      city: '',
      state: '',
      postalCode: '',
      country: '',
      street: '',
    },
  ]);
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
  const [personInfo, setPersonInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: ''
  });



  useEffect(() => {
    getPersonalInfo().then(result => {
      if (result && result.status === 'success') {
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
          });
        }
      }
    });
  }, []);

  return (
    <Container>
      <Form>
        <PersonalInfoForm
          submitted={submitted}
          personInfo={personInfo}
          setPersonInfo={setPersonInfo}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          handleSubmit={handleSubmit}
        />
        <div className='mt-3'>
          <h2>Address</h2>
        </div>
        <AddressForm
          submitted={submitted}
          addresses={addresses}
          setAddresses={setAddresses}
          addressValidationErrors={addressValidationErrors}
          setAddressValidationErrors={setAddressValidationErrors}
          handleSubmit={handleSubmit}
          handleAddAddress={handleAddAddress}
          setSubmitted={setSubmitted}
        />
        <div className='mt-3'>
          <Button disabled={submitted} variant="primary" onClick={handleAddAddress} style={{ marginRight: '10px' }}>
            Add Address
          </Button>
          <Button disabled={submitted || addresses.length === 0} variant="success" onClick={handleSubmit} >
            Submit
          </Button>
        </div>
        {flash.showMessage && (
          <FlashMessage
            message={flash.message}
            variant={flash.type}
            onClose={() => {
              setFlash({ showMessage: false, type: '', message: '' });
            }}
          />
        )}
      </Form>
    </Container>

  );
};

export default MainForm;
