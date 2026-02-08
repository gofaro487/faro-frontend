import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAuthService } from '../services/studentAuthService';
import { viewCertificatePDF, downloadCertificatePDF } from '../utils/pdfGenerator';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const SharedCertificate = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [token]);

  const fetchCertificate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentAuthService.getCertificateByToken(token);
      
      if (response.success) {
        setCertificate(response.data);
      } else {
        setError('Certificate not found or link has expired');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = async () => {
    try {
      const certificateData = {
        certificate: certificate,
        student: certificate.student,
        issuer: certificate.issuer,
      };
      
      await viewCertificatePDF(certificateData);
    } catch (err) {
      console.error('Failed to view certificate:', err);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const certificateData = {
        certificate: certificate,
        student: certificate.student,
        issuer: certificate.issuer,
      };
      
      await downloadCertificatePDF(certificateData);
    } catch (err) {
      console.error('Failed to download certificate:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !certificate) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={24} sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4" color="error" gutterBottom>
              Certificate Not Found
            </Typography>
            <Alert severity="error" sx={{ mt: 2 }}>
              {error || 'The certificate link is invalid or has expired.'}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mt: 3 }}
            >
              Go to Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)',
              color: 'white',
              py: 4,
              px: 3,
              textAlign: 'center',
            }}
          >
            <VerifiedIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Verified Certificate
            </Typography>
            <Typography variant="body1">
              This certificate has been verified on the blockchain
            </Typography>
          </Box>

          {/* Verification Badge */}
          <Box sx={{ px: 3, pt: 3 }}>
            <Alert 
              severity="success" 
              icon={<CheckCircleIcon fontSize="inherit" />}
              sx={{ mb: 3 }}
            >
              <Typography variant="body1" fontWeight="bold">
                ✓ Certificate Authenticated
              </Typography>
              <Typography variant="body2">
                This certificate is cryptographically secured on the Polygon blockchain and has been verified as authentic.
              </Typography>
            </Alert>
          </Box>

          {/* Certificate Details */}
          <Box sx={{ px: 3, pb: 3 }}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                  {certificate.courseName}
                </Typography>
                
                {certificate.grade && (
                  <Chip 
                    label={`Grade: ${certificate.grade}`} 
                    color="primary" 
                    sx={{ mb: 2 }} 
                  />
                )}

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SchoolIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          Recipient
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {certificate.student.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BusinessIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          Issued By
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {certificate.issuer.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarTodayIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          Issue Date
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FingerprintIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          Status
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          <Chip 
                            label={certificate.status} 
                            color="success" 
                            size="small"
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            {certificate.certificateHash && (
              <Card variant="outlined" sx={{ bgcolor: '#f0f7ff', mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
                    🔗 Blockchain Information
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                    <strong>Certificate Hash:</strong><br />
                    {certificate.certificateHash}
                  </Typography>
                  {certificate.blockchainTxHash && (
                    <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all', display: 'block', mt: 1 }}>
                      <strong>Transaction Hash:</strong><br />
                      {certificate.blockchainTxHash}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<VisibilityIcon />}
                  onClick={handleViewCertificate}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)',
                  }}
                >
                  View Certificate PDF
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadCertificate}
                  sx={{ py: 1.5 }}
                >
                  Download PDF
                </Button>
              </Grid>
            </Grid>

            {/* Footer */}
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Powered by <strong>FARO Certificate Registry</strong>
              </Typography>
              <br />
              <Typography variant="caption" color="textSecondary">
                Blockchain-Secured • Tamper-Proof • Globally Verifiable
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SharedCertificate;
