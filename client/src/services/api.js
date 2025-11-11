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

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn('⚠️ Auth token invalid or expired — clearing localStorage.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('kc_user');
      window.dispatchEvent(new Event('kc-auth-change'));
      // Optional: redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
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

// ---------- MESSAGES ENDPOINTS ----------

// Get all conversations for the current user
export const getConversations = async () => {
  const response = await axiosInstance.get('/messages/conversations');
  return response.data;
};

// Get messages for a specific conversation
export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(`/messages/${conversationId}`);
  return response.data;
};

// Send a message
export const sendMessage = async (conversationId, text) => {
  const response = await axiosInstance.post(`/messages/${conversationId}`, { text });
  return response.data;
};


// ---------- START CHAT / CONVERSATION HELPER ----------
export const startConversation = async (partnerId, text = 'Hello!') => {
  // This simply sends a first message if no conversation exists
  const response = await axiosInstance.post(`/messages/${partnerId}`, { text });
  return response.data;
};


export default axiosInstance;
