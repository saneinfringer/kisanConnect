// updated
// src/services/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create a single axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // from login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- CROP ENDPOINTS ----------

// Get all crops
export const getCrops = async () => {
  const response = await axiosInstance.get('/crops');
  return response.data;
};

// Add a new crop (requires authentication)
export const addCrop = async (cropData) => {
  const response = await axiosInstance.post('/crops', cropData);
  return response.data;
};

// Get crop details by ID
export const getCropDetails = async (id) => {
  const response = await axiosInstance.get(`/crops/${id}`);
  return response.data;
};

// ---------- USER / AUTH ENDPOINTS ----------

// Register a new user
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/users/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/users/login', credentials);
  return response.data;
};

// Fetch current authenticated user
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// Logout (client-side only)
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default axiosInstance;
