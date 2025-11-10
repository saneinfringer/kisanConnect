// src/pages/CropsList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCrops } from '../services/api';
import CropCard from '../components/CropCard';
import './CropsList.css';

const normalize = (items) => {
  return (Array.isArray(items) ? items : []).map(item => ({
    id: item._id || item.id || String(item._id || item.id || Math.random()),
    name: item.name || '',
    price: item.price ?? 0,
    quantity: item.quantity ?? 0,
    location: item.location || '',
    contactNumber: item.contactNumber || item.contact || item.phone || '',
    raw: item,
  }));
};

const CropsList = () => {
  const location = useLocation();
  const prefetched = location?.state?.prefetched || null;

  const [crops, setCrops] = useState(prefetched ? normalize(prefetched) : null);
  const [loading, setLoading] = useState(!prefetched);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    if (prefetched) {
      setCrops(prev => prev ?? normalize(prefetched));
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getCrops();
        const items = Array.isArray(res) ? res : (res.data || res.crops || []);
        const normalized = normalize(items);
        if (mounted) setCrops(normalized);
      } catch (err) {
        console.error('[CropsList] Fetch error:', err);
        if (mounted) setError(err.message || 'Failed to load crops.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [prefetched]);

  if (loading) {
    return (
      <div className="crops-page">
        <h2 className="crops-heading">Loading Crops…</h2>
        <div className="crops-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="crop-skeleton">
              <div className="skeleton-title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-btn"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="crops-error">⚠️ {error}</div>;
  if (!crops || crops.length === 0)
    return <div className="crops-empty">No crops available.</div>;

  return (
    <div className="crops-page">
      <h2 className="crops-heading">Available Crops</h2>
      <div className="crops-grid">
        {crops.map(crop => (
          <CropCard key={crop.id} crop={crop} />
        ))}
      </div>
    </div>
  );
};

export default CropsList;
