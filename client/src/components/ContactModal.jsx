import React from 'react';
import Modal from 'react-modal';
import './ContactModal.css';

Modal.setAppElement('#root'); // accessibility compliance

const ContactModal = ({ isOpen, onRequestClose, farmer }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="kc-modal-overlay"
      className="kc-modal-content"
      closeTimeoutMS={250}
    >
      <div className="kc-modal-header">
        <h2>Contact Farmer</h2>
        <button className="kc-close-btn" onClick={onRequestClose} aria-label="Close modal">
          ✕
        </button>
      </div>

      {farmer ? (
        <div className="kc-modal-body">
          <p><strong>Name:</strong> {farmer.name}</p>
          <p><strong>Contact Number:</strong> {farmer.contactNumber}</p>
          <p><strong>Location:</strong> {farmer.location}</p>

          <div className="kc-modal-actions">
            <a href={`tel:${farmer.contactNumber}`} className="kc-modal-call-btn">
              📞 Call Farmer
            </a>
            <button onClick={onRequestClose} className="kc-modal-close-btn">
              Close
            </button>
          </div>
        </div>
      ) : (
        <p className="kc-no-data">No farmer details available.</p>
      )}
    </Modal>
  );
};

export default ContactModal;
