// src/pages/GetStarted.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const GetStarted = () => {
  return (
    <div className="kc-auth-page">
      <div className="kc-auth-card">
        <h1>Welcome to KisanConnect</h1>
        <p className="kc-lead">
          Connect with farmers and buyers quickly. Sign in to manage listings or create an account if you are new.
        </p>

        <div className="kc-auth-actions">
          <Link className="kc-btn kc-btn-primary" to="/login">Sign In</Link>
          <Link className="kc-btn kc-btn-outline" to="/signup">Create Account</Link>
        </div>

        <div className="kc-auth-info">
          <p>Or continue as a guest and browse available crops.</p>
          <Link className="kc-link" to="/crops">Browse Crops</Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
