//updated code for header with auth state management
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';
import { logout, getStoredUser } from '../services/auth';
import { getConversations } from '../services/api';

import './Header.css';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const history = useHistory();


  const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  const fetchUnread = async () => {
    try {
      const convs = await getConversations();
      const total = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      setUnreadCount(total);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  if (user) {
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }
}, [user]);




  // single rehydrate + listeners effect (runs on mount)
  useEffect(() => {
    const refreshUserFromStorage = () => {
      try {
        // prefer centralized helper, but fall back to legacy key
        const u = getStoredUser() || JSON.parse(localStorage.getItem('kc_user') || 'null');
        setUser(u);
      } catch (err) {
        setUser(null);
      }
    };

    // initial read
    refreshUserFromStorage();

    // events to keep header in sync across app and tabs
    const onAuthChange = () => refreshUserFromStorage();
    const onStorage = (e) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'kc_user') refreshUserFromStorage();
    };

    window.addEventListener('kc-auth-change', onAuthChange);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('kc-auth-change', onAuthChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []); // run only once

  const handleLogout = () => {
    logout();
    setUser(null);
    window.dispatchEvent(new Event('kc-auth-change'));
    history.push('/login');
  };

  const handleAddCropClick = (e) => {
    // always prevent default navigation; handle logic here
    e.preventDefault();

    // refresh user from storage to ensure latest data
    const currentUser = getStoredUser() || JSON.parse(localStorage.getItem('kc_user') || 'null');

    if (currentUser?.role === 'buyer') {
      toast.warn('⚠️ Buyers are not allowed to add crops. Please log in as a farmer.');
      // redirect buyer to login so they can switch account
      history.push('/login');
      setOpen(false);
      return;
    }

    if (!currentUser?.role) {
      toast.info('🔒 Please sign in as a farmer to add crops.');
      history.push('/login');
      setOpen(false);
      return;
    }

    // user is a farmer — proceed
    setOpen(false);
    history.push('/add-crop');
  };

  return (
    <header className="kc-header">
      <div className="kc-container">
        <Link to="/" className="kc-brand" aria-label="KisanConnect home">
          <svg className="kc-logo" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="7" width="20" height="12" rx="3" />
            <path
              d="M6 7c1.5-3 6-4 12 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
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

              {/* Always show Add Crop, but block buyers */}
              <li>
                {/* Use an anchor-like element to keep semantics while handling click in JS */}
                <a
                  href="/add-crop"
                  onClick={handleAddCropClick}
                  title={user?.role === 'buyer' ? 'Buyers cannot add crops' : 'Add your crop listing'}
                >
                  Add Crop
                </a>
              </li>

              <li><Link to="/crops" onClick={() => setOpen(false)}>View Crops</Link></li>

              {user && (
              <li>
                <Link to="/messages" onClick={() => setOpen(false)} style={{ position: 'relative' }}>
      Messages
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-8px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            fontSize: '0.7rem',
            padding: '0 5px',
          }}
        >
          {unreadCount}
        </span>
      )}
    </Link>
              </li>
           )}
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

            {user ? (
              <div className="kc-user-actions">
                <span className="kc-user-name" title={user.name}>{user.name}</span>
                <button
                  className="kc-cta kc-logout-btn"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/signup" className="kc-cta" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            )}
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
