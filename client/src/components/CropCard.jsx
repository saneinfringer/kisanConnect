import React, { useState } from 'react';
import ContactModal from './ContactModal';
import './CropCard.css';

const CropCard = ({ crop }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // build farmer object for ContactModal
  const farmer = {
    name: crop.raw?.farmerName || crop.raw?.contactName || crop.name || 'Farmer',
    contactNumber: crop.contactNumber || '',
    location: crop.location || ''
  };

  return (
    <div className="kc-crop-card">
      <div className="kc-crop-header">
        <h3 className="kc-crop-name">{crop.name}</h3>
        <span className="kc-crop-price">₹{crop.price}</span>
      </div>

      <div className="kc-crop-details">
        <p><strong>Quantity:</strong> {crop.quantity} kg</p>
        <p><strong>Location:</strong> {crop.location}</p>
      </div>

      <div className="kc-crop-actions">
        <button className="kc-crop-btn" onClick={() => setModalOpen(true)}>
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
    </div>
  );
};

export default CropCard;
