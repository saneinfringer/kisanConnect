import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} KisanConnect. All rights reserved.</p>
                <p>Connect with us on social media!</p>
            </div>
        </footer>
    );
};

export default Footer;