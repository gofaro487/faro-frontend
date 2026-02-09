import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  PictureAsPdf as PictureAsPdfIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import certificateService from '../services/certificateService';
import { viewCertificatePDF, downloadCertificatePDF } from '../utils/pdfGenerator';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, [page, rowsPerPage]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getCertificatesByIssuer(
        user.id,
        page + 1,
        rowsPerPage
      );
      setCertificates(response.data.certificates);
      setTotalCertificates(response.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewCertificate = async (certificateId) => {
    try {
      const response = await certificateService.getCertificateById(certificateId);
      setSelectedCertificate(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Failed to fetch certificate details:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCertificate(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewPDF = (certificate) => {
    try {
      const certificateData = {
        certificate: {
          id: certificate.id,
          courseName: certificate.courseName,
          grade: certificate.grade,
          issueDate: certificate.issueDate,
          transactionHash: certificate.transactionHash,
          certificateHash: certificate.certificateHash,
        },
        student: certificate.student,
        issuer: certificate.issuer,
      };
      
      viewCertificatePDF(certificateData);
    } catch (error) {
      console.error('Error viewing PDF:', error);
    }
  };

  const handleDownloadPDF = (certificate) => {
    try {
      const certificateData = {
        certificate: {
          id: certificate.id,
          courseName: certificate.courseName,
          grade: certificate.grade,
          issueDate: certificate.issueDate,
          transactionHash: certificate.transactionHash,
          certificateHash: certificate.certificateHash,
        },
        student: certificate.student,
        issuer: certificate.issuer,
      };
      
      downloadCertificatePDF(certificateData);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleCopyHash = async (hash, type = 'Transaction') => {
    try {
      await navigator.clipboard.writeText(hash);
      setSnackbarMessage(`${type} hash copied to clipboard!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to copy:', error);
      setSnackbarMessage('Failed to copy hash');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Issued Certificates
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage all blockchain-verified certificates
        </Typography>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Transaction Hash</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : certificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">No certificates found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{certificate.student?.name || 'N/A'}</TableCell>
                    <TableCell>{certificate.courseName}</TableCell>
                    <TableCell>
                      <Chip label={certificate.grade} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{formatDate(certificate.issueDate)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={certificate.transactionHash || 'N/A'}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace', 
                              fontSize: '0.75rem',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              cursor: 'pointer'
                            }}
                          >
                            {certificate.transactionHash ? 
                              `${certificate.transactionHash.substring(0, 10)}...${certificate.transactionHash.substring(certificate.transactionHash.length - 8)}` 
                              : 'N/A'
                            }
                          </Typography>
                        </Tooltip>
                        {certificate.transactionHash && (
                          <Tooltip title="Copy transaction hash">
                            <IconButton
                              size="small"
                              onClick={() => handleCopyHash(certificate.transactionHash, 'Transaction')}
                              sx={{ padding: '2px' }}
                            >
                              <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={certificate.status}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewCertificate(certificate.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View PDF">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleViewPDF(certificate)}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleDownloadPDF(certificate)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCertificates}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Certificate Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Certificate Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedCertificate && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Student Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedCertificate.student?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedCertificate.student?.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Certificate Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Course Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedCertificate.courseName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Grade
                  </Typography>
                  <Typography variant="body1">
                    <Chip label={selectedCertificate.grade} color="primary" size="small" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Issue Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedCertificate.issueDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={selectedCertificate.status}
                      color="success"
                      size="small"
                    />
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Blockchain Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Transaction Hash
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {selectedCertificate.transactionHash}
                      </Typography>
                    </Box>
                    <Tooltip title="Copy transaction hash">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyHash(selectedCertificate.transactionHash, 'Transaction')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Certificate Hash
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {selectedCertificate.certificateHash}
                      </Typography>
                    </Box>
                    <Tooltip title="Copy certificate hash">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyHash(selectedCertificate.certificateHash, 'Certificate')}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdfIcon />}
            onClick={() => handleViewPDF(selectedCertificate)}
          >
            View PDF
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => handleDownloadPDF(selectedCertificate)}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for copy confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Certificates;
