// blogApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-7x8e.onrender.com/api/', // ✅ Now it matches Django URLs
});

// Automatically attach JWT token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
