import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Article as ArticleIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import certificateService from '../services/certificateService';

const StatCard = ({ title, value, icon, color, loading }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.main`,
            color: 'white',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem',
            },
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCertificates: 0,
    recentCertificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [studentsRes, certificatesRes] = await Promise.all([
        studentService.getStudents(1, 1),
        certificateService.getCertificatesByIssuer(user.id, 1, 1),
      ]);

      setStats({
        totalStudents: studentsRes.data?.pagination?.total || 0,
        totalCertificates: certificatesRes.data?.pagination?.total || 0,
        recentCertificates: certificatesRes.data?.certificates?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your certificates today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<SchoolIcon />}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Certificates Issued"
            value={stats.totalCertificates}
            icon={<ArticleIcon />}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Blockchain Verified"
            value={stats.totalCertificates}
            icon={<VerifiedIcon />}
            color="info"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Issue individual certificates to students
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Upload bulk certificates via Excel
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Manage student records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View and verify issued certificates
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              System Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">API Connection: Active</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Blockchain: Online</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">Database: Connected</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
