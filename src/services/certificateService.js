import api from './api';
import { API_ENDPOINTS } from '../config/api';

class CertificateService {
  async issueCertificate(certificateData) {
    const response = await api.post(API_ENDPOINTS.CERTIFICATES, certificateData);
    return response.data;
  }

  async downloadTemplate(studentIds) {
    const response = await api.post(
      API_ENDPOINTS.CERTIFICATES_DOWNLOAD_TEMPLATE,
      { studentIds },
      { responseType: 'blob' }
    );
    return response;
  }

  async bulkUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      API_ENDPOINTS.CERTIFICATES_BULK_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getCertificateById(certificateId) {
    const response = await api.get(API_ENDPOINTS.CERTIFICATE_BY_ID(certificateId));
    return response.data;
  }

  async getCertificatesByIssuer(issuerId, page = 1, limit = 10, status = null) {
    const params = { page, limit };
    if (status) params.status = status;
    
    const response = await api.get(
      API_ENDPOINTS.CERTIFICATES_BY_ISSUER(issuerId),
      { params }
    );
    return response.data;
  }
}

export default new CertificateService();
