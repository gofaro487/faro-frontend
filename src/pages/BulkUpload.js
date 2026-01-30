import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  CloudDone as CloudDoneIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import certificateService from '../services/certificateService';
import { viewCertificatePDF, downloadCertificatePDF } from '../utils/pdfGenerator';

const BulkUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadResults, setUploadResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [viewingJson, setViewingJson] = useState(null);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setError('');
      setUploadResults(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await certificateService.bulkUpload(uploadedFile);

      setUploadResults(response.data);
      setSuccess(
        `Successfully issued ${response.data.summary.successful} out of ${response.data.summary.total} certificates`
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadResults(null);
    setError('');
    setSuccess('');
  };

  const handleViewJson = async (certificate) => {
    try {
      if (certificate.certificate?.metadataURI) {
        // Fetch the JSON from S3
        const response = await fetch(certificate.certificate.metadataURI);
        const jsonData = await response.json();
        setViewingJson(jsonData);
        setJsonDialogOpen(true);
      } else {
        setError('Metadata URI not available');
      }
    } catch (error) {
      setError('Failed to fetch certificate JSON');
      console.error('Error fetching JSON:', error);
    }
  };

  const handleCloseJsonDialog = () => {
    setJsonDialogOpen(false);
    setViewingJson(null);
  };

  const handleViewPDF = async (result) => {
    try {
      // Fetch full certificate details if needed
      const certificateData = {
        certificate: result.certificate || {
          id: result.certificateId,
          courseName: result.certificate?.courseName || 'Course Name',
          grade: result.certificate?.grade || 'N/A',
          issueDate: result.certificate?.issueDate || new Date().toISOString(),
          transactionHash: result.transactionHash,
          certificateHash: result.certificate?.certificateHash,
        },
        student: {
          name: result.studentName || result.student?.name,
          email: result.studentEmail || result.student?.email,
        },
        issuer: {
          name: result.certificate?.issuer?.name || 'Institution',
          email: result.certificate?.issuer?.email || '',
        },
      };
      
      viewCertificatePDF(certificateData);
    } catch (error) {
      setError('Failed to generate PDF');
      console.error('Error generating PDF:', error);
    }
  };

  const handleDownloadPDF = async (result) => {
    try {
      const certificateData = {
        certificate: result.certificate || {
          id: result.certificateId,
          courseName: result.certificate?.courseName || 'Course Name',
          grade: result.certificate?.grade || 'N/A',
          issueDate: result.certificate?.issueDate || new Date().toISOString(),
          transactionHash: result.transactionHash,
          certificateHash: result.certificate?.certificateHash,
        },
        student: {
          name: result.studentName || result.student?.name,
          email: result.studentEmail || result.student?.email,
        },
        issuer: {
          name: result.certificate?.issuer?.name || 'Institution',
          email: result.certificate?.issuer?.email || '',
        },
      };
      
      downloadCertificatePDF(certificateData);
    } catch (error) {
      setError('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Bulk Certificate Upload
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload an Excel file to issue multiple certificates at once
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Upload Section */}
      {!uploadResults && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Excel File
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select an Excel file with student and certificate information
                </Typography>
              </Box>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: uploadedFile ? 'success.main' : 'primary.main',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  mb: 3,
                  bgcolor: uploadedFile ? 'success.light' : 'transparent',
                  transition: 'all 0.3s',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {uploadedFile ? uploadedFile.name : 'Select Excel File'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Drag and drop or click to browse
                </Typography>
                <input
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  id="excel-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="excel-upload">
                  <Button variant="contained" component="span">
                    Choose File
                  </Button>
                </label>
              </Box>

              {uploadedFile && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight="bold">
                    File ready for upload
                  </Typography>
                  <Typography variant="body2">
                    {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudDoneIcon />}
                onClick={handleUpload}
                disabled={!uploadedFile || loading}
              >
                {loading ? 'Processing & Issuing Certificates...' : 'Upload & Issue Certificates'}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'info.light', mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <InfoIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Excel Format</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>Required Columns:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary=" Student Email" 
                      secondary="(required)" 
                    />
                  </ListItem>
                </List>
                <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                  <strong>Optional Columns:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary=" Student Name" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary=" Course Name" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary=" Grade" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary=" Credits, Department, etc." />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                How it works:
              </Typography>
              <Typography variant="body2" component="div">
                1. System checks each email<br />
                2. Creates new students if needed<br />
                3. Issues certificates on blockchain<br />
                4. Sends email notifications<br />
                5. Shows detailed results
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      )}

      {/* Results Section */}
      {uploadResults && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Upload Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Certificates have been issued on the blockchain
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h4">{uploadResults.summary.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'success.light' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Successful
                  </Typography>
                  <Typography variant="h4">{uploadResults.summary.successful}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: uploadResults.summary.failed > 0 ? 'error.light' : 'grey.100' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Failed
                  </Typography>
                  <Typography variant="h4">{uploadResults.summary.failed}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {uploadResults.results.successful.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Successful Certificates
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Row</TableCell>
                      <TableCell>Student Email</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Certificate ID</TableCell>
                      <TableCell>Transaction Hash</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadResults.results.successful.map((result) => (
                      <TableRow key={result.row}>
                        <TableCell>{result.row}</TableCell>
                        <TableCell>{result.studentEmail}</TableCell>
                        <TableCell>{result.studentName}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {result.certificateId?.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {result.transactionHash?.substring(0, 16)}...
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View PDF">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleViewPDF(result)}
                            >
                              <PictureAsPdfIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleDownloadPDF(result)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Certificate JSON">
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => handleViewJson(result)}
                            >
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {uploadResults.results.failed.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom color="error">
                Failed Certificates
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Row</TableCell>
                      <TableCell>Student Email</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadResults.results.failed.map((result) => (
                      <TableRow key={result.row}>
                        <TableCell>{result.row}</TableCell>
                        <TableCell>{result.studentEmail}</TableCell>
                        <TableCell>
                          <Chip label={result.error} color="error" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={handleReset}>
              Upload More Certificates
            </Button>
          </Box>
        </Paper>
      )}

      {/* JSON Viewer Dialog */}
      <Dialog 
        open={jsonDialogOpen} 
        onClose={handleCloseJsonDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <DescriptionIcon sx={{ mr: 1 }} />
            Certificate JSON (Stored in S3)
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewingJson ? (
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '500px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(viewingJson, null, 2)}
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJsonDialog}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              const dataStr = JSON.stringify(viewingJson, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `certificate-${viewingJson?.certificateId}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download JSON
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BulkUpload;
