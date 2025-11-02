import React, { useState } from 'react';
import { addCrop } from '../services/api';

const AddCrop = () => {
  const [cropName, setCropName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cropData = {
      name: cropName,
      price: Number(price),
      quantity: Number(quantity),
      location,
      contactNumber,
    };

    try {
      const response = await addCrop(cropData);
      if (response && response._id) {
        setMessage('Crop added successfully!');
        setCropName('');
        setPrice('');
        setQuantity('');
        setLocation('');
        setContactNumber('');
      } else {
        setMessage('Failed to add crop. Please try again.');
      }
    } catch (error) {
      console.error('Error adding crop:', error);
      setMessage('Failed to add crop. Please try again.');
    }
  };

  return (
    <div className="add-crop">
      <h2>Add New Crop</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Crop Name:</label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <button type="submit">Add Crop</button>
      </form>
    </div>
  );
};

export default AddCrop;
