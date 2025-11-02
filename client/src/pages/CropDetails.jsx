import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCropDetails } from '../services/api';
import ContactModal from '../components/ContactModal';

const CropDetails = () => {
    const { id } = useParams();
    const [crop, setCrop] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchCropDetails = async () => {
            const data = await getCropDetails(id);
            setCrop(data);
        };
        fetchCropDetails();
    }, [id]);

    const handleContactClick = () => {
        setModalOpen(true);
    };

    if (!crop) {
        return <div>Loading...</div>;
    }

    return (
        <div className="crop-details">
            <h1>{crop.name}</h1>
            <p>Price: ${crop.price}</p>
            <p>Quantity: {crop.quantity} kg</p>
            <p>Location: {crop.location}</p>
            <button onClick={handleContactClick}>Contact Farmer</button>
            <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} contact={crop.contact} />
        </div>
    );
};

export default CropDetails;