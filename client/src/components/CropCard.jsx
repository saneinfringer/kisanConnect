import React, { useState } from 'react';
import ContactModal from './ContactModal';

const CropCard = ({ crop }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleContactClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="crop-card">
            <h3>{crop.name}</h3>
            <p>Price: ${crop.price}</p>
            <p>Quantity: {crop.quantity} kg</p>
            <p>Location: {crop.location}</p>
            <button onClick={handleContactClick}>Contact Farmer</button>
            {modalOpen && <ContactModal crop={crop} onClose={handleCloseModal} />}
        </div>
    );
};

export default CropCard;