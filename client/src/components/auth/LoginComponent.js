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
  const [errors, setErrors] = useState({email:'', password:''})

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const loginValidate = () => {
    const errors = {};
    if(email && !/\S+@\S+\.\S+/.test(email)){
      errors.email = 'Invalid email format';
    }
    if(password && password.length < 5){
      errors.password = "Password must be at lest 5 characters";
    }
    return errors;
  };

  const handleSaveChanges = async () => {
    try {
      // validate
      const loginErrors = loginValidate();
      if(Object.keys(loginErrors).length > 0){
        setErrors(loginErrors);
        return;
      } else {
        setErrors({email:'', password:''})
      }
      const result = await login(dispatch, { email, password });
    if (result && result.status === 'success') {
      handleClose();
    } else {
      setFlash({
        showMessage:true,
         message: result.message && typeof result.message === 'string' ? result.message : 'Some Error', type:'danger'});
    }
    } catch (_) {
      setFlash({showMessage:true, message:'Server Error', type:'danger'});
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
              className={errors.email && 'is-invalid'}
            />
              {errors.email && <label className='invalid-feedback'>{errors.email}</label>}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={errors.password && 'is-invalid'}
            />
             {errors.password && <label className='invalid-feedback'>{errors.password}</label>}
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
