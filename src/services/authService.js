import api from './api';
import { API_ENDPOINTS } from '../config/api';

class AuthService {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.issuer));
    }
    return response.data;
  }

  async register(name, email, password) {
    const response = await api.post(API_ENDPOINTS.REGISTER, { name, email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.issuer));
    }
    return response.data;
  }

  async getProfile() {
    const response = await api.get(API_ENDPOINTS.GET_PROFILE);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
