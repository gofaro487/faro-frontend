import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme/theme';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentSearch from './pages/StudentSearch';
import IssueCertificate from './pages/IssueCertificate';
import BulkUpload from './pages/BulkUpload';
import Certificates from './pages/Certificates';
import StudentAuth from './pages/StudentAuth';
import StudentDashboard from './pages/StudentDashboard';
import SharedCertificate from './pages/SharedCertificate';
import VerifyCertificate from './pages/VerifyCertificate';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Public Routes */}
            <Route path="/student/auth" element={<StudentAuth />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/share/:token" element={<SharedCertificate />} />
            <Route path="/verify" element={<VerifyCertificate />} />

            {/* Protected Issuer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="student-search" element={<StudentSearch />} />
              <Route path="issue-certificate" element={<IssueCertificate />} />
              <Route path="bulk-upload" element={<BulkUpload />} />
              <Route path="certificates" element={<Certificates />} />
            </Route>

            {/* Default Route - removed as / is now LandingPage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
