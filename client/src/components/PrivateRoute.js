import React, {useState} from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginComponent from './auth/LoginComponent';


const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => {
    return state.user.authenticated;
  });
  const [showLoginModal, setShowLoginModal] = useState(true);
    const handleLoginClose = () => setShowLoginModal(false);

  return isAuthenticated ? <>{children}</> : <LoginComponent show={showLoginModal} handleClose={handleLoginClose}/>
  // <Navigate to="/login" />;
};

export default PrivateRoute;
