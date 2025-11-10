import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="kc-header">
      <div className="kc-container">
        <Link to="/" className="kc-brand" aria-label="KisanConnect home">
          <svg className="kc-logo" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="7" width="20" height="12" rx="3" />
            <path d="M6 7c1.5-3 6-4 12 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <div className="kc-brand-text">
            <span className="kc-name">KisanConnect</span>
            <span className="kc-strap">fields → markets</span>
          </div>
        </Link>

        <div className={`kc-navwrap ${open ? 'open' : ''}`}>
          <nav className="kc-nav" role="navigation" aria-label="Main navigation">
            <ul>
              <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
              <li><Link to="/add-crop" onClick={() => setOpen(false)}>Add Crop</Link></li>
              <li><Link to="/crops" onClick={() => setOpen(false)}>View Crops</Link></li>
            </ul>
          </nav>

          <div className="kc-actions">
            <label className="kc-search">
              <input
                type="search"
                placeholder="Search crops or city..."
                aria-label="Search crops or city"
              />
              <button aria-hidden="true">🔍</button>
            </label>

            <Link to="/signup" className="kc-cta" onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>

        <button
          className={`kc-hamburger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Header;
