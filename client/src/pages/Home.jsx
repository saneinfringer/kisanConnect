import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import hero from '../assets/images/kisan_hero.svg';
import { getCrops } from '../services/api';
import './Home.css';

const Home = () => {
const history = useHistory(); // v5 navigation hook
  const [loadingCrops, setLoadingCrops] = useState(false);

  const handleViewCrops = async (e) => {
    e.preventDefault();
    try {
      setLoadingCrops(true);
      const data = await getCrops();
      history.push({
        pathname: '/crops',
        state: { prefetched: data },
      });
    } catch (err) {
      console.error('Failed to prefetch crops:', err);
      history.push('/crops'); // fallback navigation
    } finally {
      setLoadingCrops(false);
    }
  };

  return (
    <div className="home-page">
      {/* <header className="nav">
        <div className="nav-left">
          <h2 className="brand">KisanConnect</h2>
          <span className="tagline">Fresh from fields to markets</span>
        </div>
        <div className="nav-right">
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/signup" className="btn-secondary">Get Started</Link>
        </div>
      </header> */}

      <main className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Connect. Trade. Grow.</h1>
          <p className="hero-sub">
            KisanConnect helps farmers list their harvest and buyers discover fresh produce — secure, local, and transparent.
          </p>

          <div className="hero-actions">
            <Link to="/add-crop" className="btn-primary">Add Your Crop</Link>
            <Link to="/crops" className="btn-outline">View Available Crops</Link>
          </div>

          <div className="quick-search">
            <input type="text" placeholder="Search crops or locations (e.g., mangoes, Pune)" />
            <button className="search-btn">Search</button>
          </div>

          <div className="stats">
            <div>
              <strong>1.2K+</strong>
              <span>Farmers</span>
            </div>
            <div>
              <strong>4.8K+</strong>
              <span>Listings</span>
            </div>
            <div>
              <strong>250+</strong>
              <span>Cities</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img src={hero} alt="KisanConnect illustration" className="hero-image" />
        </div>
      </main>

      <section className="features">
        <div className="feature-card">
          <h3>Verified Farmers</h3>
          <p>Profiles verified to ensure trust and quality.</p>
        </div>
        <div className="feature-card">
          <h3>Transparent Pricing</h3>
          <p>Clear pricing, no hidden commission.</p>
        </div>
        <div className="feature-card">
          <h3>Fast Delivery</h3>
          <p>Connect with logistics partners nearby.</p>
        </div>
      </section>

      {/* <footer className="footer">
        <p>© {new Date().getFullYear()} KisanConnect — Built for every farmer</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer> */}
    </div>
  );
};

export default Home;
