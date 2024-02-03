import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginComponent from '../auth/LoginComponent';
import RegisterComponent from '../auth/RegisterComponent';
import { useSelector, useDispatch } from 'react-redux';
import { userState } from '../../store/slices/userSlice';
import {logout} from '../../store/actions/userAction';

const Navbar = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const {user} = useSelector(userState);
    const dispatch = useDispatch();
    const handleLoginClose = () => setShowLoginModal(false);
    const handleRegisterClose = () => setShowRegisterModal(false);


    const handleLogout = async () => {
        await logout(dispatch);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img
                        src="https://scontent.fixc8-1.fna.fbcdn.net/v/t39.30808-6/305576952_507614428031546_475993403050268313_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=7OdHo2QfvbYAX88PZUn&_nc_ht=scontent.fixc8-1.fna&oh=00_AfDHUpskFmfKxwWOnpGwuSUnO6-AdqeO6ZuipaXZj_DCXw&oe=65C1E7B4"
                        alt="Dummy Logo"
                        height="30"
                        className="d-inline-block align-top"
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        {!user.authenticated && (
                            <>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setShowLoginModal(true)}>
                                        Login
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setShowRegisterModal(true)}>
                                        Register
                                    </button>
                                </li>
                            </>
                        )}
                        {user.authenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/personal-info">
                                        Personal Info
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <LoginComponent show={showLoginModal} handleClose={handleLoginClose}/>
            <RegisterComponent show={showRegisterModal} handleClose={handleRegisterClose}/>
        </nav>
    );
};

export default Navbar;


