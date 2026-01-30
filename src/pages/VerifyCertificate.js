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
  TextField,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { viewCertificatePDF, downloadCertificatePDF } from '../utils/pdfGenerator';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import ErrorIcon from '@mui/icons-material/Error';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // If certificate ID is in URL, verify automatically
    if (certificateId) {
      handleVerify();
    }
  }, []);

  const handleVerify = async () => {
    if (!certificateId) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setCertificate(null);
    setVerified(false);

    try {
      // Get certificate details from database
      const certResponse = await api.get(`/certificates/${certificateId}`);
      
      if (!certResponse.data.success) {
        setError('Certificate not found');
        setLoading(false);
        return;
      }

      const cert = certResponse.data.data;

      // Verify on blockchain using the certificate hash
      if (cert.certificateHash) {
        const verifyResponse = await api.post('/verification/verify-hash', {
          certificateHash: cert.certificateHash,
        });

        if (verifyResponse.data.success && verifyResponse.data.data.valid) {
          setCertificate(cert);
          setVerified(true);
        } else {
          setError('Certificate verification failed. This certificate may not be valid on the blockchain.');
        }
      } else {
        setError('Certificate hash not found. This certificate cannot be verified.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify certificate');
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              py: 4,
              px: 3,
              textAlign: 'center',
            }}
          >
            <QrCodeScannerIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Verify Certificate
            </Typography>
            <Typography variant="body1">
              Enter certificate ID or scan QR code to verify authenticity
            </Typography>
          </Box>

          {/* Search Form */}
          <Box sx={{ px: 3, pt: 3 }}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Certificate ID Verification
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Enter Certificate ID"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                    variant="outlined"
                    disabled={loading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleVerify();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    onClick={handleVerify}
                    disabled={loading || !certificateId}
                    sx={{
                      minWidth: 120,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  The certificate ID can be found on the certificate document
                </Typography>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                icon={<ErrorIcon />}
                sx={{ mb: 3 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Verification Success */}
            {verified && certificate && (
              <Box>
                <Alert 
                  severity="success" 
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    ✓ Certificate Verified Successfully
                  </Typography>
                  <Typography variant="body2">
                    This certificate is authentic and has been verified on the Polygon blockchain.
                  </Typography>
                </Alert>

                {/* Certificate Details */}
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <VerifiedIcon color="success" />
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {certificate.courseName}
                      </Typography>
                    </Box>
                    
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
                              {certificate.student?.name}
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
                              {certificate.issuer?.name}
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
                          <CheckCircleIcon color="action" />
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
                        🔗 Blockchain Verification Details
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                        <strong>Certificate Hash:</strong><br />
                        {certificate.certificateHash}
                      </Typography>
                      {certificate.blockchainTxHash && (
                        <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all', display: 'block', mt: 1 }}>
                          <strong>Blockchain Transaction:</strong><br />
                          {certificate.blockchainTxHash}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
                        This certificate is permanently stored on the Polygon blockchain and cannot be altered or forged.
                      </Typography>
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setCertificate(null);
                    setVerified(false);
                    setCertificateId('');
                  }}
                  sx={{ mt: 2 }}
                >
                  Verify Another Certificate
                </Button>
              </Box>
            )}

            {/* Footer */}
            <Box sx={{ mt: 4, pb: 3, textAlign: 'center' }}>
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

export default VerifyCertificate;
