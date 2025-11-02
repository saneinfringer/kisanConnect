import axios from 'axios';

const API_URL = 'http://localhost:5000/api/crops';

// Get all crops
export const getCrops = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching crops:', error);
    throw error;
  }
};

// Add a new crop
export const addCrop = async (cropData) => {
  try {
    const response = await axios.post(API_URL, cropData, {
      headers: { 'Content-Type': 'application/json' }, // Axios automatically serializes JSON
    });
    return response.data;
  } catch (error) {
    console.error('Error adding crop:', error);
    throw error;
  }
};

// Get crop details by ID
export const getCropDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`); // Use full URL for backend
    return response.data;
  } catch (error) {
    console.error('Error fetching crop details:', error);
    throw error;
  }
};
