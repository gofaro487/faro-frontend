import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { studentAuthService } from '../services/studentAuthService';
import { generateCertificatePDF, downloadCertificatePDF, viewCertificatePDF } from '../utils/pdfGenerator';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Logo from '../components/Logo';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Check if student is authenticated
    if (!studentAuthService.isStudentAuthenticated()) {
      navigate('/student/auth');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentAuthService.getStudentDashboard();
      
      if (response.success) {
        setStudentData(response.data);
        setCertificates(response.data.certificates || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    studentAuthService.studentLogout();
    navigate('/student/auth');
  };

  const handleViewCertificate = async (certificate) => {
    try {
      const certificateData = {
        certificate: certificate,
        student: {
          name: studentData.name,
          email: studentData.email,
        },
        issuer: certificate.issuer,
      };
      
      await viewCertificatePDF(certificateData);
      showSnackbar('Certificate opened in new tab', 'success');
    } catch (err) {
      showSnackbar('Failed to view certificate', 'error');
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      const certificateData = {
        certificate: certificate,
        student: {
          name: studentData.name,
          email: studentData.email,
        },
        issuer: certificate.issuer,
      };
      
      await downloadCertificatePDF(certificateData);
      showSnackbar('Certificate downloaded successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to download certificate', 'error');
    }
  };

  const handleGenerateShareLink = async (certificate) => {
    setSelectedCertificate(certificate);
    setGeneratingLink(true);
    setShareDialogOpen(true);

    try {
      const response = await studentAuthService.generateShareableLink(certificate.id);
      
      if (response.success) {
        setShareableUrl(response.data.shareableUrl);
      }
    } catch (err) {
      showSnackbar('Failed to generate shareable link', 'error');
      setShareDialogOpen(false);
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    showSnackbar('Link copied to clipboard!', 'success');
  };

  const handleShareLinkedIn = async (certificate) => {
    // Open LinkedIn directly
    const linkedInUrl = `https://www.linkedin.com/feed/`;
    window.open(linkedInUrl, '_blank');
    showSnackbar('LinkedIn opened! Share your achievement.', 'success');
  };

  const handleDownloadBlockchainReceipt = async (certificate) => {
    try {
      showSnackbar('Generating blockchain receipt...', 'info');
      
      const response = await studentAuthService.getBlockchainReceipt(certificate.id);
      
      if (response.success) {
        const data = response.data;
        
        // Format as human-readable text
        const receiptText = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                        BLOCKCHAIN RECEIPT                                 ║
║                     FARO Certificate Verification                         ║
╚═══════════════════════════════════════════════════════════════════════════╝

CERTIFICATE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Certificate ID:       ${data.certificate.id}
Course Name:          ${data.certificate.courseName}
Grade:                ${data.certificate.grade || 'N/A'}
Issue Date:           ${new Date(data.certificate.issueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric' })}

STUDENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:                 ${data.student.name}
Email:                ${data.student.email}

ISSUER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Institution:          ${data.issuer.name}
Email:                ${data.issuer.email}
Issuer ID:            ${data.issuer.id}

BLOCKCHAIN VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network:              ${data.blockchain.network}
Type:                 ${data.blockchain.type}
Certificate Hash:     ${data.targetHash}
Transaction Hash:     ${data.blockchain.transactionHash}
Blockchain Explorer:  ${data.blockchain.blockchainExplorer}
Status:               ${data.verification.status}

VERIFICATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verification URL:     ${data.verification.verificationURL}
Shareable URL:        ${data.verification.shareableURL || 'Not generated yet'}
Verification Method:  ${data.verification.method}

SECURITY METADATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Algorithm:            ${data.metadata.algorithm}
Blockchain Type:      ${data.metadata.blockchainType}
Chainpoint Version:   ${data.metadata.chainpointVersion}
Immutable:            ${data.metadata.immutable ? 'YES' : 'NO'}
Tamper-Proof:         ${data.metadata.tamperProof ? 'YES' : 'NO'}

RECEIPT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Receipt Type:         ${data.type}
Context:              ${data['@context']}
Certificate Issued:   ${new Date(data.issuedAt).toLocaleString('en-US')}
Receipt Generated:    ${new Date(data.generatedAt).toLocaleString('en-US')}

═══════════════════════════════════════════════════════════════════════════

WHAT IS THIS RECEIPT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This blockchain receipt serves as cryptographic proof that your certificate 
has been permanently recorded on the Polygon blockchain network. The certificate
hash above is a unique digital fingerprint that can be independently verified
on the blockchain, ensuring authenticity and preventing tampering.

HOW TO VERIFY:
1. Visit the Blockchain Explorer URL above
2. Check the transaction hash on PolygonScan
3. Use the Verification URL to verify the certificate online
4. The certificate hash will match the blockchain record

This receipt can be shared with employers, educational institutions, or anyone
who needs to verify the authenticity of your certificate.

═══════════════════════════════════════════════════════════════════════════
Powered by FARO - Blockchain Certificate Management System
© ${new Date().getFullYear()} FARO. All rights reserved.
═══════════════════════════════════════════════════════════════════════════
`;
        
        // Create blob from text data
        const blob = new Blob([receiptText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `blockchain-receipt-${certificate.courseName.replace(/\s+/g, '-')}-${certificate.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showSnackbar('Blockchain receipt downloaded successfully', 'success');
      }
    } catch (err) {
      console.error('Error downloading blockchain receipt:', err);
      showSnackbar('Failed to download blockchain receipt', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Logo height={70} />
              My Certificates
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome back, <strong>{studentData?.name}</strong>!
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            color="error"
          >
            Logout
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Student Info Card */}
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Student Information
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {studentData?.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {studentData?.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Institution:</strong> {studentData?.issuer?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="h3" fontWeight="bold">
                    {certificates.length}
                  </Typography>
                  <Typography variant="body1">
                    Certificate{certificates.length !== 1 ? 's' : ''} Earned
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <SchoolIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No certificates yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Certificates issued to you will appear here
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {certificates.map((certificate) => (
              <Grid item xs={12} md={6} key={certificate.id}>
                <Card 
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Blockchain Verified"
                        color="success"
                        size="small"
                      />
                      <Chip
                        label={certificate.status}
                        color={certificate.status === 'ISSUED' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                      {certificate.courseName}
                    </Typography>

                    {certificate.grade && (
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        Grade: <strong>{certificate.grade}</strong>
                      </Typography>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Issued By:</strong> {certificate.issuer.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                        <strong>Certificate ID:</strong> {certificate.id}
                      </Typography>
                    </Box>

                    {certificate.certificateHash && (
                      <Box sx={{ mt: 2, p: 1, bgcolor: '#f0f7ff', borderRadius: 1 }}>
                        <Typography variant="caption" color="primary">
                          <CheckCircleIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                          Secured on Polygon Blockchain
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewCertificate(certificate)}
                      fullWidth
                      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      View PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadCertificate(certificate)}
                      fullWidth
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ReceiptIcon />}
                      onClick={() => handleDownloadBlockchainReceipt(certificate)}
                      fullWidth
                      color="success"
                    >
                      Blockchain Receipt
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => handleGenerateShareLink(certificate)}
                      fullWidth
                      color="secondary"
                    >
                      Share
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<LinkedInIcon />}
                      onClick={() => handleShareLinkedIn(certificate)}
                      fullWidth
                      sx={{ bgcolor: '#0077b5', '&:hover': { bgcolor: '#006097' } }}
                    >
                      Post on LinkedIn
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShareIcon color="primary" />
              Share Certificate
            </Box>
          </DialogTitle>
          <DialogContent>
            {generatingLink ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Generating shareable link...
                </Typography>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Anyone with this link can view and verify your certificate
                </Alert>
                
                <TextField
                  fullWidth
                  value={shareableUrl}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton onClick={handleCopyLink} edge="end">
                        <ContentCopy />
                      </IconButton>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyLink}
                    fullWidth
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<LinkedInIcon />}
                    onClick={() => handleShareLinkedIn(selectedCertificate)}
                    fullWidth
                    sx={{ bgcolor: '#0077b5', '&:hover': { bgcolor: '#006097' } }}
                  >
                    Share on LinkedIn
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.severity === 'info' ? 8000 : 4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
