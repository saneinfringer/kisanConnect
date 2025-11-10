import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddCrop from './pages/AddCrop';
import CropDetails from './pages/CropDetails';
import CropsList from './pages/CropsList';
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
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
