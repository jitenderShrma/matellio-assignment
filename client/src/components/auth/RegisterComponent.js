import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { register } from '../../store/actions/userAction';
import FlashMessage from '../common/FlashMessage';

const Register = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flash, setFlash] = useState({ showMessage: false, message: '', type: '' });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSaveChanges = async () => {
    try {
      const result = await register(dispatch, { email, password });
      if (result && result.status === 'success') {
        setFlash({ showMessage: true, message: 'Successfully registered', type: 'success' });
        handleClose();
      } else {
        setFlash({ showMessage: true, message: result.message && typeof result.message === 'string' ? result.message : 'Some Error', type: 'danger' });
      }
    } catch (error) {
      setFlash({ showMessage: true, message: 'Server Error', type: 'danger' });
    }

  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {flash.showMessage && (
            <FlashMessage
              message={flash.message}
              variant={flash.type}
              onClose={() => {
                setFlash({ showMessage: false, type: '', message: '' })
              }}
            />
          )}
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { handleClose() }}>
            Close
          </Button>
          <Button variant="primary" disabled={!email || !password} onClick={handleSaveChanges}>
            Submit
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
};

export default Register;
