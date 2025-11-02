import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <h1>KisanConnect</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add-crop">Add Crop</Link></li>
                    <li><Link to="/crops">View Crops</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;