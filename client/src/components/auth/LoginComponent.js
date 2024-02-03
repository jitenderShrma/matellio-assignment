import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { login } from '../../store/actions/userAction';
import FlashMessage from '../common/FlashMessage';


const Login = ({ show, handleClose }) => {
  const [flash, setFlash] = useState({showMessage:false, message:'', type:''});
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSaveChanges = async () => {
    const result = await login(dispatch, { email, password });
    if (result.status === 'success') {
      handleClose();
    } else {
      setFlash({showMessage:true, message:result.message, type:'danger'});
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {flash.showMessage && (
        <FlashMessage
          message={flash.message}
          variant={flash.type}
          onClose={() => {
            setFlash({showMessage:false, type:'', message:''})
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
  );
};

export default Login;
