import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { studentAuthService } from '../services/studentAuthService';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';

const StudentAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0); // 0: Email, 1: Password Setup/Login
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // If email is provided in URL, check it automatically
    if (email) {
      handleCheckEmail();
    }
  }, []);

  const handleCheckEmail = async () => {
    if (!email) {
      setError('Please enter your college email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await studentAuthService.checkEmail(email);
      
      if (!response.success) {
        setError('Unable to check email. Please try again.');
        return;
      }

      if (!response.data.exists) {
        setError('No certificate found for this email. Please check your email or contact your institution.');
        return;
      }

      setHasPassword(response.data.hasPassword);
      setStudentName(response.data.name);
      setStep(1);
      setSuccess('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await studentAuthService.setPassword(email, password);
      
      if (response.success) {
        setSuccess('Password set successfully! Logging you in...');
        // Auto-login after setting password
        setTimeout(() => {
          handleLogin();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password');
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await studentAuthService.studentLogin(email, password);
      
      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 500);
      }
    } catch (err) {
      if (err.response?.data?.data?.passwordNotSet) {
        setError('Please set your password first');
        setHasPassword(false);
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SchoolIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              FARO Student Portal
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Access Your Blockchain-Secured Certificates
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Stepper activeStep={step} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Enter Email</StepLabel>
            </Step>
            <Step>
              <StepLabel>{hasPassword ? 'Login' : 'Set Password'}</StepLabel>
            </Step>
          </Stepper>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Step 0: Email Input */}
          {step === 0 && (
            <Box>
              <TextField
                fullWidth
                label="College Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleCheckEmail)}
                placeholder="student@college.edu"
                variant="outlined"
                sx={{ mb: 3 }}
                autoFocus
                disabled={loading}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckEmail}
                disabled={loading || !email}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
              </Button>

              <Card sx={{ mt: 3, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    <strong>First time here?</strong> Enter the email where you received your certificate notification.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Step 1: Password Setup or Login */}
          {step === 1 && (
            <Box>
              <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="body2" color="textPrimary">
                    <strong>Welcome, {studentName}!</strong>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {email}
                  </Typography>
                </CardContent>
              </Card>

              {!hasPassword ? (
                // Set Password Form
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon /> Create Your Password
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    This is your first time logging in. Please create a secure password to access your certificates.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    autoFocus
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSetPassword)}
                    placeholder="Re-enter password"
                    variant="outlined"
                    sx={{ mb: 3 }}
                    disabled={loading}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSetPassword}
                    disabled={loading || !password || !confirmPassword}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Password & Login'}
                  </Button>
                </Box>
              ) : (
                // Login Form
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LoginIcon /> Welcome Back
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Enter your password to access your certificates.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    autoFocus
                    disabled={loading}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    disabled={loading || !password}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>
                </Box>
              )}

              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  setStep(0);
                  setPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                Use Different Email
              </Button>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Powered by FARO Certificate Registry
            </Typography>
            <br />
            <Typography variant="caption" color="textSecondary">
              Blockchain-Secured • Tamper-Proof • Verifiable
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentAuth;
