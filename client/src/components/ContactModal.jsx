import React from 'react';
import Modal from 'react-modal';

const ContactModal = ({ isOpen, onRequestClose, farmer }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
            <h2>Contact Farmer</h2>
            {farmer ? (
                <div>
                    <p>Name: {farmer.name}</p>
                    <p>Contact Number: {farmer.contactNumber}</p>
                    <p>Location: {farmer.location}</p>
                </div>
            ) : (
                <p>No farmer details available.</p>
            )}
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default ContactModal;