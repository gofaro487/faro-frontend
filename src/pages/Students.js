import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import studentService from '../services/studentService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [bulkData, setBulkData] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [openCertDialog, setOpenCertDialog] = useState(false);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudents(page + 1, rowsPerPage);
      setStudents(response.data.students);
      setTotalStudents(response.data.pagination.total);
    } catch (error) {
      setError('Failed to fetch students');
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({ name: '', email: '' });
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', email: '' });
  };

  const handleOpenBulkDialog = () => {
    setOpenBulkDialog(true);
    setBulkData('');
    setError('');
  };

  const handleCloseBulkDialog = () => {
    setOpenBulkDialog(false);
    setBulkData('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      await studentService.createStudent(formData);
      setSuccess('Student created successfully');
      handleCloseDialog();
      fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create student');
    }
  };

  const handleBulkSubmit = async () => {
    try {
      setError('');
      // Parse bulk data (expecting CSV format: name,email)
      const lines = bulkData.trim().split('\n');
      const students = lines.map(line => {
        const [name, email] = line.split(',').map(s => s.trim());
        return { name, email };
      }).filter(s => s.name && s.email);

      if (students.length === 0) {
        setError('Invalid format. Use: Name,Email (one per line)');
        return;
      }

      await studentService.bulkCreateStudents(students);
      setSuccess(`${students.length} students created successfully`);
      handleCloseBulkDialog();
      fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create students');
    }
  };

  const handleViewCertificates = async (student) => {
    try {
      setCertLoading(true);
      setSelectedStudent(student);
      setOpenCertDialog(true);
      const response = await studentService.getStudentCertificates(student.id);
      setCertificates(response.data.certificates);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch certificates');
    } finally {
      setCertLoading(false);
    }
  };

  const handleCloseCertDialog = () => {
    setOpenCertDialog(false);
    setSelectedStudent(null);
    setCertificates([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ISSUED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REVOKED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Students
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={handleOpenBulkDialog}
              sx={{ mr: 1 }}
            >
              Bulk Add
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add Student
            </Button>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your student records
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

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Certificates</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">No students found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {student.id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${student._count?.certificates || 0} certificates`} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewCertificates(student)}
                        title="View Certificates"
                      >
                        <SchoolIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalStudents}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Add Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Student Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Add Dialog */}
      <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Add Students</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter student data in CSV format (Name,Email) - one per line
          </Typography>
          <TextField
            fullWidth
            label="Bulk Student Data"
            multiline
            rows={10}
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder="John Doe,john@example.com&#10;Jane Smith,jane@example.com&#10;..."
            helperText="Format: Name,Email (one per line)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkDialog}>Cancel</Button>
          <Button onClick={handleBulkSubmit} variant="contained">
            Add Students
          </Button>
        </DialogActions>
      </Dialog>

      {/* Certificates Dialog */}
      <Dialog open={openCertDialog} onClose={handleCloseCertDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="primary" />
            <Typography variant="h6">
              Certificates for {selectedStudent?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {certLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : certificates.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography color="text.secondary">
                No certificates found for this student
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell>{cert.courseName}</TableCell>
                      <TableCell>
                        <Chip label={cert.grade || 'N/A'} size="small" />
                      </TableCell>
                      <TableCell>{formatDate(cert.issueDate)}</TableCell>
                      <TableCell>
                        <Chip
                          label={cert.status}
                          color={getStatusColor(cert.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCertDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;
