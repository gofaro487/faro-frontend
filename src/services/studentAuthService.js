import api from '../config/api';

export const studentAuthService = {
  // Check if email exists and has password
  checkEmail: async (email) => {
    const response = await api.get(`/students/auth/check-email/${email}`);
    return response.data;
  },

  // Set password for new student
  setPassword: async (email, password) => {
    const response = await api.post('/students/auth/set-password', {
      email,
      password,
    });
    return response.data;
  },

  // Student login
  studentLogin: async (email, password) => {
    const response = await api.post('/students/auth/login', {
      email,
      password,
    });
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('studentToken', response.data.data.token);
      localStorage.setItem('studentData', JSON.stringify(response.data.data.student));
      localStorage.setItem('userType', 'student');
    }
    
    return response.data;
  },

  // Student logout
  studentLogout: () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    localStorage.removeItem('userType');
  },

  // Get current student from localStorage
  getCurrentStudent: () => {
    const studentData = localStorage.getItem('studentData');
    return studentData ? JSON.parse(studentData) : null;
  },

  // Check if student is authenticated
  isStudentAuthenticated: () => {
    return !!localStorage.getItem('studentToken') && localStorage.getItem('userType') === 'student';
  },

  // Get student token
  getStudentToken: () => {
    return localStorage.getItem('studentToken');
  },

  // Get student dashboard
  getStudentDashboard: async () => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },

  // Get student certificate
  getStudentCertificate: async (certificateId) => {
    const response = await api.get(`/students/certificate/${certificateId}`);
    return response.data;
  },

  // Generate shareable link
  generateShareableLink: async (certificateId) => {
    const response = await api.post(`/students/certificate/${certificateId}/share`, {});
    return response.data;
  },

  // Get certificate by shareable token (public)
  getCertificateByToken: async (token) => {
    const response = await api.get(`/students/public/share/${token}`);
    return response.data;
  },

  // Get blockchain receipt for certificate
  getBlockchainReceipt: async (certificateId) => {
    const response = await api.get(`/students/certificate/${certificateId}/blockchain-receipt`);
    return response.data;
  },
};
