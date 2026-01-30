import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_PROFILE: '/auth/me',
  
  // Students
  STUDENTS: '/students',
  STUDENTS_BULK: '/students/bulk',
  STUDENTS_SEARCH: '/students/search',
  STUDENT_BY_ID: (id) => `/students/${id}`,
  STUDENT_CERTIFICATES: (id) => `/students/${id}/certificates`,
  
  // Certificates
  CERTIFICATES: '/certificates',
  CERTIFICATES_DOWNLOAD_TEMPLATE: '/certificates/download-template',
  CERTIFICATES_BULK_UPLOAD: '/certificates/bulk-upload',
  CERTIFICATE_BY_ID: (id) => `/certificates/${id}`,
  CERTIFICATES_BY_ISSUER: (id) => `/certificates/issuer/${id}`,
  
  // Issuer
  ISSUER: '/issuer',
  ISSUER_BY_ID: (id) => `/issuer/${id}`,
  ISSUER_STATUS: (id) => `/issuer/${id}/status`,
  
  // Verification (public)
  VERIFY: '/verify',
  VERIFY_HASH: '/verify/hash',
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from either issuer or student
    const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check which type of user and redirect accordingly
      const userType = localStorage.getItem('userType');
      if (userType === 'student') {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        localStorage.removeItem('userType');
        window.location.href = '/student/auth';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
