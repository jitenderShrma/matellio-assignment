import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import PrivateRoute from './components/PrivateRoute';
import PersonalInfoForm from './components/PersonalInfoComponent';
import HomeComponent from './components/Home';
import Navbar from './components/common/Navbar';
import NotFound from './components/NotFound';
// import LoginComponent from './components/auth/LoginComponent';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<HomeComponent/>} />

          {/* Private routes */}
          <Route path="/personal-info" element={<PrivateRoute> <PersonalInfoForm /> </PrivateRoute>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
