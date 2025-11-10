import React, { useEffect, useState } from 'react';
import { addCrop } from '../services/api';
import './AddCrop.css';

const Toast = ({ type = 'info', message = '', onClose = () => {} }) => {
  if (!message) return null;
  return (
    <div className={`kc-toast kc-toast-${type}`} role="alert">
      <div className="kc-toast-body">
        <span>{message}</span>
        <button className="kc-toast-close" onClick={onClose} aria-label="Close notification">✕</button>
      </div>
    </div>
  );
};

const AddCrop = () => {
  const [cropName, setCropName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [message, setMessage] = useState(''); // success / inline message
  const [toast, setToast] = useState({ message: '', type: 'info' }); // toast popup
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    // update online status on window events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setToast({ type: 'error', message: 'You are offline. Connect to the internet to add a crop.' });
    } else {
      // clear offline toast automatically
      if (toast.type === 'error' && toast.message?.includes('offline')) {
        setToast({ message: '', type: 'info' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const validateForm = () => {
    if (!cropName.trim()) {
      setToast({ type: 'error', message: 'Please enter a crop name.' });
      return false;
    }
    if (price === '' || Number(price) <= 0 || Number.isNaN(Number(price))) {
      setToast({ type: 'error', message: 'Please enter a valid price.' });
      return false;
    }
    if (quantity === '' || Number(quantity) <= 0 || Number.isNaN(Number(quantity))) {
      setToast({ type: 'error', message: 'Please enter a valid quantity.' });
      return false;
    }
    // optional phone validation (if provided)
    if (contactNumber) {
      const digits = contactNumber.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        setToast({ type: 'error', message: 'Please enter a valid contact number (7–15 digits).' });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setToast({ message: '', type: 'info' });

    if (!isOnline) {
      setToast({ type: 'error', message: 'You appear to be offline. Connect to the internet to add a crop.' });
      return;
    }

    if (!validateForm()) return;

    const cropData = {
      name: cropName.trim(),
      price: Number(price),
      quantity: Number(quantity),
      location: location.trim(),
      contactNumber: contactNumber.trim(),
    };

    try {
      setIsSubmitting(true);

      // call the same addCrop service you already have
      const response = await addCrop(cropData);

      // handle a typical success shape { _id: '...' } - preserve previous logic
      if (response && response._id) {
        setMessage('✅ Crop added successfully!');
        setToast({ type: 'success', message: 'Crop added successfully.' });
        // clear the form after success
        setCropName('');
        setPrice('');
        setQuantity('');
        setLocation('');
        setContactNumber('');
      } else {
        // server did not return _id — show more detailed message if available
        const serverMsg = response && response.message ? response.message : 'Failed to add crop. Please try again.';
        setMessage('❌ ' + serverMsg);
        setToast({ type: 'error', message: serverMsg });
      }
    } catch (error) {
      // network error, CORS, connection refused, timeout, etc.
      console.error('Error adding crop:', error);
      // Try to get a helpful message if available
      const errMsg = error?.message || 'Server unreachable. Please check your network or backend.';
      setMessage('❌ ' + errMsg);
      setToast({ type: 'error', message: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kc-add-crop">
      {/* Toast popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <div className="kc-add-wrapper" aria-live="polite">
        <h2>Add New Crop</h2>

        {/* inline message */}
        {message && <p className="kc-message">{message}</p>}

        <form className="kc-add-form" onSubmit={handleSubmit} noValidate>
          <div className="kc-field">
            <label htmlFor="cropName">Crop Name</label>
            <input
              id="cropName"
              name="cropName"
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g., Wheat, Rice"
              required
            />
          </div>

          <div className="kc-field">
            <label htmlFor="price">Price (₹ per kg)</label>
            <input
              id="price"
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="kc-field">
            <label htmlFor="quantity">Quantity (kg)</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="kc-field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city or village"
            />
          </div>

          <div className="kc-field">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="10-digit phone number"
            />
          </div>

          <button
            type="submit"
            className="kc-submit-btn"
            disabled={isSubmitting || !isOnline}
            aria-disabled={isSubmitting || !isOnline}
          >
            {isSubmitting ? (
              <span className="kc-spinner" aria-hidden="true" />
            ) : null}
            {isSubmitting ? 'Adding...' : 'Add Crop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCrop;
