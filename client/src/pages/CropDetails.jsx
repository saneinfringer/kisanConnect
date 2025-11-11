import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { getCropDetails } from '../services/api';
import ContactModal from '../components/ContactModal';
import { startConversation } from '../services/api';
import { getStoredUser } from '../services/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './CropDetails.css';

const CropDetails = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const user = getStoredUser();
  const history = useHistory();
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

    const handleMessageFarmer = async () => {
    try {
      if (!user) {
        toast.info('🔒 Please log in to send a message.');
        return;
      }
      if (user.role === 'farmer') {
        toast.warn('⚠️ Farmers cannot message other farmers.');
        return;
      }
      setSending(true);
      await startConversation(crop.owner || crop.ownerId || crop.userId); // Adjust based on your crop model
      toast.success('✅ Conversation started!');
      window.location.href = '/messages'; // redirect to messages

      // determine partner id from several possible fields
      const partnerId =
        (crop && (crop.owner || crop.ownerId || crop.userId || crop.farmerId)) ||
        (crop?.farmer?._id) ||
        null;

      if (!partnerId) {
        toast.error('⚠️ Farmer contact not available for this crop.');
        return;
      }

      setSending(true);
      await startConversation(partnerId);
      toast.success('✅ Conversation started!');
      history.push('/messages');
    } catch (err) {
      console.error('Failed to start conversation:', err);
      toast.error('Failed to start conversation.');
    } finally {
      setSending(false);
    }
  };

  // Use the same prop names the ContactModal expects:
  // isOpen, onRequestClose, farmer
  return (
    <div className="crop-details">
      <h1>{crop.name}</h1>
      <p><strong>Price:</strong> ₹{crop.price}</p>
      <p><strong>Quantity:</strong> {crop.quantity} kg</p>
      <p><strong>Location:</strong> {crop.location}</p>

      {/* Show "Message Farmer" button if logged in */}
      {user && user.role === 'buyer' && (
        <button
          className="btn-primary"
          disabled={sending}
          onClick={handleMessageFarmer}
          style={{ marginTop: '1rem' }}
        >
          {sending ? 'Sending...' : 'Message Farmer'}
        </button>
      )}

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
