import React from 'react';
import { userState } from '../store/slices/userSlice';
import { useSelector } from 'react-redux';


const Home = () => {
  const {user} = useSelector(userState);
  return (
    <div>
      <div className="container mt-5">
        <h1>Welcome {user.authenticated && user.user.email} to Home Page</h1>
        <p>functionality to show how user can add personal info and addresses</p>
      </div>
    </div>
  );
};

export default Home;
