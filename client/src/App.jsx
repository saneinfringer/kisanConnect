import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddCrop from './pages/AddCrop';
import CropDetails from './pages/CropDetails';
import CropsList from './pages/CropsList';

import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import Signup from './pages/Signup';

import './styles/main.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/add-crop" component={AddCrop} />
        {/* v5 style: use component prop */}
        <Route path="/crops" exact component={CropsList} />
        {/* Details route - make sure it matches links (use /crops/:id) */}
        <Route path="/crops/:id" component={CropDetails} />

        <Route path="/getstarted" exact component={GetStarted} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
      </Switch>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
