// updated code for buyer prevention of add crop and merger of both header add crop and home add crop link
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hero from '../assets/images/kisan_hero.svg';
import { getCrops } from '../services/api';
import { getStoredUser } from '../services/auth';
import './Home.css';

const Home = () => {
  const history = useHistory(); // for navigation
  const [loadingCrops, setLoadingCrops] = useState(false);

  // 🔹 Handles clicking "View Crops"
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
      history.push('/crops');
    } finally {
      setLoadingCrops(false);
    }
  };

  // 🔹 Handles clicking "Add Crop"
  const handleAddCrop = (e) => {
  e.preventDefault();

  const user = getStoredUser() || JSON.parse(localStorage.getItem('kc_user') || 'null');

  if (user?.role === 'buyer') {
    toast.warn('⚠️ Buyers are not allowed to add crops. Please log in as a farmer.');
    // redirect buyer back to login
    history.push('/login');
    return;
  }

  if (!user?.role) {
    toast.info('🔒 Please sign in as a farmer to add crops.');
    history.push('/login');
    return;
  }

  history.push('/add-crop');
};

  return (
    <div className="home-page">
      <main className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Connect. Trade. Grow.</h1>
          <p className="hero-sub">
            KisanConnect helps farmers list their harvest and buyers discover fresh produce —
            secure, local, and transparent.
          </p>

          <div className="hero-actions">
            <button onClick={handleAddCrop} className="btn-primary">
              Add Your Crop
            </button>
            <button onClick={handleViewCrops} className="btn-outline" disabled={loadingCrops}>
              {loadingCrops ? 'Loading…' : 'View Available Crops'}
            </button>
          </div>

          <div className="quick-search">
            <input
              type="text"
              placeholder="Search crops or locations (e.g., mangoes, Pune)"
            />
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
    </div>
  );
};

export default Home;
