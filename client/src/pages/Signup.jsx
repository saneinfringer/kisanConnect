//updated to phone only signup
// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { signup } from '../services/auth';
import '../styles/auth.css';

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validatePhone = (p) => {
    const digits = p.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) return setError('Please provide your name.');
    if (!validatePhone(phone)) return setError('Please enter a valid phone number.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!navigator.onLine) return setError('You are offline. Connect to the internet to sign up.');

    try {
      setLoading(true);
      const res = await signup({ name: name.trim(), phone: phone.trim(), password, role });
      if (res?.token) {
        history.push('/crops');
      } else {
        setSuccessMsg(res?.message || 'Account created. Please sign in.');
        setTimeout(() => history.push('/login'), 1400);
      }
    } catch (err) {
      console.error('Signup error', err);
      const msg = err?.response?.data?.message || err.message || 'Signup failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kc-auth-page">
      <div className="kc-auth-card">
        <h2>Create an account</h2>

        <form className="kc-auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="kc-form-error" role="alert">{error}</div>}
          {successMsg && <div className="kc-form-success" role="status">{successMsg}</div>}

          <label htmlFor="signup-name">
            Full name
            <input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </label>

          <label htmlFor="signup-phone">
            Phone number
            <input id="signup-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit phone" required inputMode="tel" />
          </label>

          <label htmlFor="signup-password">
            Password
            <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" required />
          </label>

          <label htmlFor="signup-confirm">
            Confirm password
            <input id="signup-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required />
          </label>

          <label htmlFor="signup-role">
            I am a
            <select id="signup-role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </label>

          <button type="submit" className="kc-btn kc-btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="kc-auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
          <p><Link to="/crops">Skip for now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
