// src/components/CropCard.jsx
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ContactModal from './ContactModal';
import './CropCard.css';

const CropCard = ({ crop }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();

  // determine id (cover several possible shapes)
  const id = crop?.id || crop?.raw?._id || crop?.raw?.id || '';

  // build farmer object for ContactModal
  const farmer = {
    name:
      crop.raw?.farmerName ||
      crop.raw?.contactName ||
      crop.name ||
      'Farmer',
    contactNumber: crop.contactNumber || crop.raw?.contactNumber || '',
    location: crop.location || crop.raw?.location || ''
  };

  const onCardClick = (e) => {
    // don't navigate when clicking interactive inner elements
    const tag = e.target.tagName?.toLowerCase();
    if (tag === 'button' || tag === 'a' || e.defaultPrevented) return;
    if (id) history.push(`/crops/${id}`);
  };

  return (
    <article
      className="kc-crop-card"
      onClick={onCardClick}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onCardClick(e);
      }}
    >
      <div className="kc-crop-header">
        <h3 className="kc-crop-name">{crop.name}</h3>
        <span className="kc-crop-price">₹{crop.price}</span>
      </div>

      <div className="kc-crop-details">
        <p><strong>Quantity:</strong> {crop.quantity} kg</p>
        <p><strong>Location:</strong> {crop.location}</p>
      </div>

      <div className="kc-crop-actions">
        {/* View Details (Link) - stops propagation so it doesn't trigger card onClick twice */}
        <Link
          to={`/crops/${id}`}
          className="kc-crop-view-link"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>

        <button
          className="kc-crop-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevent card navigation
            setModalOpen(true);
          }}
        >
          Contact Farmer
        </button>
      </div>

      {modalOpen && (
        <ContactModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          farmer={farmer}
        />
      )}
    </article>
  );
};

export default CropCard;
