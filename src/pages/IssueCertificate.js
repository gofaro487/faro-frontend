import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Autocomplete,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import studentService from '../services/studentService';
import certificateService from '../services/certificateService';

const IssueCertificate = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    courseName: '',
    grade: '',
    issueDate: new Date().toISOString().split('T')[0],
    credits: '',
    institution: '',
    department: '',
    instructor: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await studentService.getStudents(1, 100);
      setStudents(response.data.students);
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const certificateData = {
        studentId: selectedStudent.id,
        courseName: formData.courseName,
        grade: formData.grade,
        issueDate: new Date(formData.issueDate).toISOString(),
      };

      const response = await certificateService.issueCertificate(certificateData);
      
      setSuccess(
        `Certificate issued successfully! Transaction Hash: ${response.data.blockchain.transactionHash.substring(0, 10)}...`
      );
      
      // Reset form
      setSelectedStudent(null);
      setFormData({
        courseName: '',
        grade: '',
        issueDate: new Date().toISOString().split('T')[0],
        credits: '',
        institution: '',
        department: '',
        instructor: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Issue Certificate
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Issue a blockchain-verified certificate to a student
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

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Student Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={selectedStudent}
                onChange={(event, newValue) => setSelectedStudent(newValue)}
                loading={loadingStudents}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Student"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStudents ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Certificate Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
                placeholder="e.g., Blockchain Development"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                placeholder="e.g., A+, 95%, Pass"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Date"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Optional Fields
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                These fields will be included in the blockchain hash
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                type="number"
                placeholder="e.g., 4"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="e.g., MIT"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="e.g., Dr. John Smith"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Issuing Certificate...' : 'Issue Certificate'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default IssueCertificate;
