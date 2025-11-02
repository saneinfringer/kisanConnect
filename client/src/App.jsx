import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddCrop from './pages/AddCrop';
import CropDetails from './pages/CropDetails';
import './styles/main.css';

const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/add-crop" component={AddCrop} />
                <Route path="/crop/:id" component={CropDetails} />
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;