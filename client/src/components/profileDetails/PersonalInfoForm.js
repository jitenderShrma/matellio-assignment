
import React from 'react';
import { Form,  Row, Col } from 'react-bootstrap';


const PersonalInfoForm = ({ submitted, personInfo, validationErrors, setPersonInfo }) => {

  const formattedDate = (dob) => {
    return new Date(dob).toISOString().split('T')[0];
  };

  const handleInputChange = (field, value) => {
    setPersonInfo((prevPersonInfo) => ({
        ...prevPersonInfo,
        [field]: value,
    }));
};
  return (
    <>
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
    </>
  );
};

export default PersonalInfoForm;
