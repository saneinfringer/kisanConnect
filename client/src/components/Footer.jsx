import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="kc-footer">
      <div className="kc-footer-container">
        <div className="kc-footer-left">
          <h3 className="kc-footer-brand">KisanConnect</h3>
          <p className="kc-footer-text">
            Empowering farmers and connecting communities since 2025.
          </p>
        </div>

        <div className="kc-footer-right">
          <p className="kc-social-text">Follow us</p>
          <div className="kc-social-icons">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="kc-footer-bottom">
        <p>&copy; {new Date().getFullYear()} KisanConnect — All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
