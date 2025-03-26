import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

export const logoutUser = async () => {
  return api.get('/auth/logout');
};

// Donor API calls
export const registerDonor = async (donorData) => {
  return api.post('/donors/register', donorData);
};

export const getNearbyDonors = async (longitude, latitude, distance, bloodType) => {
  return api.get('/donors/nearby', {
    params: { longitude, latitude, distance, bloodType }
  });
};

export const getDonorProfile = async () => {
  return api.get('/donors/me');
};

export const updateDonorProfile = async (profileData) => {
  return api.put('/donors/me', profileData);
};

export const updateDonorAvailability = async (availability) => {
  return api.put('/donors/me/availability', { availability });
};

// Recipient API calls
export const registerRecipient = async (recipientData) => {
  return api.post('/recipients/register', recipientData);
};

export const createBloodRequest = async (requestData) => {
  return api.post('/recipients/requests', requestData);
};

export const getRecipientProfile = async () => {
  return api.get('/recipients/me');
};

export const getRecipientRequests = async () => {
  return api.get('/recipients/me/requests');
};

export const updateRecipientProfile = async (profileData) => {
  return api.put('/recipients/me', profileData);
};

export default api; 