import api from './api';
import { API_ENDPOINTS } from '../config/api';

class StudentService {
  async createStudent(studentData) {
    const response = await api.post(API_ENDPOINTS.STUDENTS, studentData);
    return response.data;
  }

  async bulkCreateStudents(students) {
    const response = await api.post(API_ENDPOINTS.STUDENTS_BULK, { students });
    return response.data;
  }

  async getStudents(page = 1, limit = 10) {
    const response = await api.get(API_ENDPOINTS.STUDENTS, {
      params: { page, limit }
    });
    return response.data;
  }

  async searchStudents(query, page = 1, limit = 10) {
    const response = await api.get(API_ENDPOINTS.STUDENTS_SEARCH, {
      params: { query, page, limit }
    });
    return response.data;
  }

  async getStudentById(studentId) {
    const response = await api.get(API_ENDPOINTS.STUDENT_BY_ID(studentId));
    return response.data;
  }

  async getStudentCertificates(studentId) {
    const response = await api.get(API_ENDPOINTS.STUDENT_CERTIFICATES(studentId));
    return response.data;
  }
}

export default new StudentService();
