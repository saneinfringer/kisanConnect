import React from 'react';
import { Link } from 'react-router-dom';
import './styles/main.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to KisanConnect</h1>
            <p>Your one-stop platform to connect farmers and buyers.</p>
            <div className="button-container">
                <Link to="/add-crop" className="button">Add Your Crop</Link>
                <Link to="/crops" className="button">View Available Crops</Link>
            </div>
        </div>
    );
};

export default Home;