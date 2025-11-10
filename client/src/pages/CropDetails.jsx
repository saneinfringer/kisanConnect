import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCropDetails } from '../services/api';
import ContactModal from '../components/ContactModal';
import './CropDetails.css';

const CropDetails = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchCropDetails = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('[CropDetails] fetching crop id=', id);
        const res = await getCropDetails(id);

        // Normalize response shape:
        // Accept either: cropObject OR { data: cropObject } OR { crop: cropObject }
        const normalized =
          res && typeof res === 'object'
            ? res.data || res.crop || res // if it's already the crop object
            : res;

        if (!normalized) {
          throw new Error('Crop not found or invalid response from server.');
        }

        if (mounted) {
          setCrop(normalized);
          console.log('[CropDetails] loaded:', normalized);
        }
      } catch (err) {
        console.error('[CropDetails] error fetching crop:', err);
        if (mounted) setError(err.message || 'Failed to load crop details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCropDetails();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleContactClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  if (loading) {
    return <div className="crop-details-loading" aria-live="polite">Loading crop details…</div>;
  }

  if (error) {
    return (
      <div className="crop-details-error" role="alert">
        <p>Something went wrong: {error}</p>
        <p>
          <Link to="/crops">Back to crops</Link>
        </p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="crop-details-empty">
        <p>Crop not found.</p>
        <p>
          <Link to="/crops">Back to crops</Link>
        </p>
      </div>
    );
  }

  // Use the same prop names the ContactModal expects:
  // isOpen, onRequestClose, farmer
  return (
    <div className="crop-details">
      <h1>{crop.name}</h1>
      <p><strong>Price:</strong> ₹{crop.price}</p>
      <p><strong>Quantity:</strong> {crop.quantity} kg</p>
      <p><strong>Location:</strong> {crop.location}</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <button className="kc-contact-btn" onClick={handleContactClick}>
          Contact Farmer
        </button>

        <Link to="/crops" className="kc-back-link">
          Back to listings
        </Link>
      </div>

      <ContactModal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        farmer={crop.farmer || crop.contact || {
          name: crop.farmerName || crop.contactName || 'Farmer',
          contactNumber: crop.contactNumber || crop.phone || ''
        }}
      />
    </div>
  );
};

export default CropDetails;
