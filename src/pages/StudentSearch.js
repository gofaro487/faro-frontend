import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import studentService from '../services/studentService';

const StudentSearch = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [openCertDialog, setOpenCertDialog] = useState(false);
  const [certLoading, setCertLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await studentService.searchStudents(searchQuery, page + 1, rowsPerPage);
      setStudents(response.data.students);
      setTotalStudents(response.data.pagination.total);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to search students');
      setStudents([]);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <SearchIcon color="primary" fontSize="large" />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Student Search
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Search for students by name, email, or student ID
        </Typography>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            placeholder="Search by name, email, or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Results Table */}
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
                    <Typography color="text.secondary">
                      {searchQuery ? 'No students found' : 'Enter a search query to find students'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {student.id.substring(0, 12)}...
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
                      <IconButton size="small" color="primary" title="View Details">
                        <VisibilityIcon fontSize="small" />
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

export default StudentSearch;
