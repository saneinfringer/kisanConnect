//updated according to phone only login
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { login } from '../services/auth';
import '../styles/auth.css';

const Login = () => {
  const history = useHistory();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || !password) {
      setError('Please enter your phone and password.');
      return;
    }

    if (!navigator.onLine) {
      setError('You are offline. Connect to the internet to sign in.');
      return;
    }

    try {
      setLoading(true);
      const data = await login({ phone: phone.trim(), password });
      if (data?.token) {
        history.push('/crops');
      } else {
        setError(data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error', err);
      const msg = err?.response?.data?.message || err.message || 'Login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kc-auth-page">
      <div className="kc-auth-card">
        <h2>Sign in to KisanConnect</h2>
        <form className="kc-auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="kc-form-error" role="alert">{error}</div>}

          <label htmlFor="login-phone">
            Phone
            <input id="login-phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 9876543210" required />
          </label>

          <label htmlFor="login-password">
            Password
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
          </label>

          <button type="submit" className="kc-btn kc-btn-primary" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="kc-auth-footer">
          <p>Don't have an account? <Link to="/signup">Create one</Link></p>
          <p><Link to="/crops">Continue as guest</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
