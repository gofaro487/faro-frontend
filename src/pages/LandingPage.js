import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Logo from '../components/Logo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const pricingPlans = [
    {
      name: 'Starter',
      price: '49',
      period: 'month',
      description: 'Perfect for small institutions getting started',
      features: [
        'Up to 100 certificates/month',
        'Blockchain verification',
        'Email notifications',
        'Basic analytics',
        'Standard support',
        'PDF generation with QR codes',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '149',
      period: 'month',
      description: 'Ideal for growing educational institutions',
      features: [
        'Up to 1,000 certificates/month',
        'Blockchain verification',
        'Email notifications',
        'Advanced analytics & reports',
        'Priority support',
        'Custom branding',
        'Student portal access',
        'Bulk certificate issuance',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with specific needs',
      features: [
        'Unlimited certificates',
        'Blockchain verification',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solution',
        'API access',
        'Advanced security features',
        '24/7 Premium support',
        'Custom workflows',
      ],
      highlighted: false,
    },
  ];

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 50 }} />,
      title: 'Verifiable Credentials',
      description: 'Degrees issued as verifiable credentials on sustainable Polygon blockchain, ensuring immutability and permanent verification.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50 }} />,
      title: 'One-Click Verification',
      description: 'Employers and institutions verify credentials instantly. Zero delays, zero paperwork.',
    },
    {
      icon: <CloudDoneIcon sx={{ fontSize: 50 }} />,
      title: 'Portable Digital Credentials',
      description: 'Students securely store and share credentials from their FARO profile anywhere, anytime.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50 }} />,
      title: 'Zero Re-Verification Costs',
      description: 'One issuance. Lifetime verification. Eliminate expensive re-verification processes forever.',
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 50 }} />,
      title: 'Trust Network',
      description: 'Turning students into a trust network. Sold to universities, adopted by students, used by employers.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 50 }} />,
      title: 'Student Empowerment',
      description: 'Students can access, download, and share their certificates anytime.',
    },
  ];

  const menuItems = ['Home', 'Features', 'About'];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Logo height={100} />
          </Box>
          
          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                sx={{ color: 'text.primary', fontWeight: 500 }}
              >
                {item}
              </Button>
            ))}
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ ml: 2 }}
            >
              Issuer Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/student/auth')}
              sx={{ background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)' }}
            >
              Student Login
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => scrollToSection(item.toLowerCase())}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/login')}>
                <ListItemText primary="Issuer Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/student/auth')}>
                <ListItemText primary="Student Login" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)',
          color: 'white',
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  animation: 'slideInLeft 1s ease-out',
                  '@keyframes slideInLeft': {
                    from: { opacity: 0, transform: 'translateX(-50px)' },
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                The Future of Academic Credentials
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  animation: 'slideInLeft 1s ease-out 0.2s both',
                }}
              >
                Blockchain-verified degrees that turn students into a trusted network. One issuance. Lifetime verification. Zero re-verification costs.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  animation: 'slideInLeft 1s ease-out 0.4s both',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => scrollToSection('features')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  animation: 'fadeInUp 1s ease-out 0.6s both',
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" color="text.primary" fontWeight="bold" gutterBottom>
                      Trusted by Educational Institutions Worldwide
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join thousands of institutions using FARO to issue verifiable digital certificates
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: '#fff3e0' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            The Problem: 2026 Students, 1990s Infrastructure
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 900, mx: 'auto' }}>
            Higher education is managing today's students with outdated infrastructure. Universities lose visibility, trust, and verified connection with students at every critical stage, from admissions through alumni engagement.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mt: 4 }}>
            <Card elevation={3} sx={{ p: 4, maxWidth: 360, textAlign: 'center', bgcolor: '#fff', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Box sx={{ fontSize: 60, mb: 2 }}>📄</Box>
              <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
                Manual Verification Crisis
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Universities spend significant resources on manual re-verification. WES alone processes over one million credential evaluations annually.
              </Typography>
            </Card>
            <Card elevation={3} sx={{ p: 4, maxWidth: 360, textAlign: 'center', bgcolor: '#fff', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Box sx={{ fontSize: 60, mb: 2 }}>🚨</Box>
              <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
                Credential Fraud Epidemic
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Forged transcripts and fake degrees represent a multi-billion dollar global problem that undermines institutional credibility.
              </Typography>
            </Card>
            <Card elevation={3} sx={{ p: 4, maxWidth: 360, textAlign: 'center', bgcolor: '#fff', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Box sx={{ fontSize: 60, mb: 2 }}>💰</Box>
              <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
                Hidden Verification Costs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Trust in higher education is outsourced, duplicated, manual, and expensive. The current system drains resources and slows decisions.
              </Typography>
            </Card>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: '#e8f5e9' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            The Solution: FARO's Trust Infrastructure
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 900, mx: 'auto' }}>
            One issuance. Lifetime verification. Zero re-verification costs.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 340, textAlign: 'center', bgcolor: 'white', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 } }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, fontSize: 28, fontWeight: 'bold', boxShadow: 2 }}>1</Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Issue Credentials
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Degree issued as a verifiable credential on sustainable Polygon blockchain
              </Typography>
            </Paper>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 340, textAlign: 'center', bgcolor: 'white', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 } }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, fontSize: 28, fontWeight: 'bold', boxShadow: 2 }}>2</Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Student Stores
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Student securely stores credentials in their FARO profile, portable and always accessible
              </Typography>
            </Paper>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 340, textAlign: 'center', bgcolor: 'white', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 } }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, fontSize: 28, fontWeight: 'bold', boxShadow: 2 }}>3</Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Instant Verification
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Employers and institutions verify credentials instantly with one click
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Why Universities Choose FARO
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Empowering students with portable, verified credentials creates a network effect that benefits all stakeholders
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                elevation={3}
                sx={{
                  minWidth: 300,
                  maxWidth: 320,
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 3 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Stakeholder Benefits Section */}
      <Box sx={{ py: 10, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Benefits for Every Stakeholder
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Creating value across the entire education ecosystem
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Card elevation={4} sx={{ p: 4, maxWidth: 380, bgcolor: 'white', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Universities
                </Typography>
              </Box>
              <Box sx={{ pl: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Eliminate re-verification costs forever</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Protect institutional credibility from fraud</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Maintain verified alumni connections</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Lead the digital transformation</Typography>
                </Box>
              </Box>
            </Card>
            
            <Card elevation={4} sx={{ p: 4, maxWidth: 380, bgcolor: 'white', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Students
                </Typography>
              </Box>
              <Box sx={{ pl: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Portable credentials you own forever</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Comprehensive verified academic profile</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Share credentials instantly with anyone</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">No more transcript request delays</Typography>
                </Box>
              </Box>
            </Card>
            
            <Card elevation={4} sx={{ p: 4, maxWidth: 380, bgcolor: 'white', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedUserIcon sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Employers
                </Typography>
              </Box>
              <Box sx={{ pl: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Instant credential verification</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">100% fraud prevention</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">Faster hiring decisions</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, mt: 0.5 }} />
                  <Typography variant="body1">No manual verification processes</Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Choose the plan that fits your institution's needs
          </Typography>

          <Grid container spacing={4}>
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={plan.highlighted ? 8 : 2}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: plan.highlighted ? '3px solid' : 'none',
                    borderColor: 'primary.main',
                    transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: plan.highlighted ? 'scale(1.08)' : 'scale(1.03)' },
                  }}
                >
                  {/* {plan.highlighted && (
                    // <Box
                    //   sx={{
                    //     position: 'absolute',
                    //     top: 20,
                    //     right: 20,
                    //     fontWeight: 'bold',
                    //     bgcolor: 'primary.main',
                    //     color: 'white',
                    //     px: 2,
                    //     py: 1,
                    //     borderRadius: 1,
                    //     fontSize: '0.875rem',
                    //   }}
                    // >
                    //   MOST POPULAR
                    // </Box>
                  )} */}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {plan.price === 'Custom' ? (
                        <Typography variant="h3" fontWeight="bold" color="primary">
                          Custom
                        </Typography>
                      ) : (
                        <Box>
                          <Typography variant="h3" fontWeight="bold" color="primary" component="span">
                            ${plan.price}
                          </Typography>
                          <Typography variant="h6" color="text.secondary" component="span">
                            /{plan.period}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 3 }}>
                      {plan.features.map((feature, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={
                        plan.highlighted
                          ? { background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)' }
                          : {}
                      }
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box id="about" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                About FARO
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                FARO is revolutionizing trust infrastructure for higher education. We're building the foundation for 
                verifiable credentials that empowers universities to lead the digital transformation, not be left behind.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                This shift is happening with or without universities. FARO lets them lead it. Built on W3C, Polygon, 
                and EUDI frameworks with production-ready technology, we're aligned with global standards including 
                the EU's rollout of standardized wallets for verifiable credentials.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                FARO is sold to universities, adopted by students, and used by employers. By empowering students 
                with portable, verified credentials, universities create a network effect that benefits all stakeholders.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                  To provide comprehensive trust infrastructure that eliminates fraud, reduces costs, and 
                  empowers students with lifetime-portable credentials verified on the blockchain.
                </Typography>
                <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Our Vision
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  To become the global standard for verifiable academic credentials, where universities 
                  lead the digital transformation and students own their verified achievements forever.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Market Context Section */}
          <Box sx={{ mt: 8, p: 5, bgcolor: '#f5f5f5', borderRadius: 3 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
              The Moment is Now
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 5, fontSize: '1.1rem', maxWidth: 900, mx: 'auto' }}>
              The technological and regulatory infrastructure for verifiable credentials is mature and being adopted globally. 
              The question is whether universities will lead this transformation or be left behind.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Card elevation={3} sx={{ p: 4, maxWidth: 350, textAlign: 'center', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Technology Ready
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  W3C, Polygon, and EUDI frameworks provide production-ready infrastructure
                </Typography>
              </Card>
              <Card elevation={3} sx={{ p: 4, maxWidth: 350, textAlign: 'center', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Regulatory Support
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  EU rolling out standardized wallets for verifiable credentials across member states
                </Typography>
              </Card>
              <Card elevation={3} sx={{ p: 4, maxWidth: 350, textAlign: 'center', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Market Demand
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Credential fraud crisis drives urgency for verifiable, tamper-proof solutions
                </Typography>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box id="contact" sx={{ py: 10, background: 'linear-gradient(135deg, #0016AA 0%, #3345C0 100%)', color: 'white' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Lead the Digital Transformation
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
              This shift is happening with or without universities. FARO lets them lead it.
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, fontSize: '1.1rem', maxWidth: 700, mx: 'auto' }}>
              Join forward-thinking institutions that are empowering their students with portable, 
              verified credentials while eliminating fraud and verification costs.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s',
                }}
              >
                Get Started Today
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  borderWidth: 2,
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { borderColor: 'white', borderWidth: 2, bgcolor: 'rgba(255,255,255,0.15)', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s',
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a2e', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Logo height={55} sx={{ filter: 'brightness(0) invert(1)' }} />
              </Box>
              <Typography variant="body2" color="grey.400">
                Trust infrastructure for higher education. Verifiable credentials that empower students, 
                trusted by universities, used by employers.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button onClick={() => scrollToSection('home')} sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  Home
                </Button>
                <Button onClick={() => scrollToSection('features')} sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  Features
                </Button>
                <Button onClick={() => scrollToSection('pricing')} sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  Pricing
                </Button>
                <Button onClick={() => scrollToSection('about')} sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  About Us
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  Privacy Policy
                </Button>
                <Button sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  Terms of Service
                </Button>
                <Button sx={{ color: 'grey.400', justifyContent: 'flex-start' }}>
                  Cookie Policy
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: 'grey.800' }} />
          <Typography variant="body2" textAlign="center" color="grey.500">
            © {new Date().getFullYear()} FARO. All rights reserved. Powered by Polygon Blockchain.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
