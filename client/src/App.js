import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import PrivateRoute from './components/PrivateRoute';
import PersonalDetailsComponent from './components/profileDetails/MainForm';
import HomeComponent from './components/Home';
import Navbar from './components/common/Navbar';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<HomeComponent/>} />

          {/* Private routes */}
          <Route path="/personal-info" element={<PrivateRoute> <PersonalDetailsComponent /> </PrivateRoute>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
