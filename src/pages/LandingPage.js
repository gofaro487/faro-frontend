import React, { useState, useEffect } from 'react';
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
  TextField,
  Divider,
  Chip,
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
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    institutions: 0,
    students: 0,
    certificates: 0,
  });

  // Target stats
  const targetStats = {
    institutions: 150,
    students: 50000,
    certificates: 75000,
  };

  useEffect(() => {
    // Trigger animation when component mounts
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  const animateStats = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        institutions: Math.floor(targetStats.institutions * progress),
        students: Math.floor(targetStats.students * progress),
        certificates: Math.floor(targetStats.certificates * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(targetStats);
      }
    }, stepDuration);
  };

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
      title: 'Blockchain Security',
      description: 'Certificates secured on Polygon blockchain ensuring immutability and permanent verification.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50 }} />,
      title: 'Instant Verification',
      description: 'Verify certificates in seconds with QR codes and shareable links.',
    },
    {
      icon: <CloudDoneIcon sx={{ fontSize: 50 }} />,
      title: 'Cloud-Based Platform',
      description: 'Access from anywhere, anytime. No installation required.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50 }} />,
      title: 'Tamper-Proof',
      description: 'Blockchain technology ensures certificates cannot be forged or altered.',
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 50 }} />,
      title: 'Multi-Institution',
      description: 'Support for multiple educational institutions and organizations.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 50 }} />,
      title: 'Student Portal',
      description: 'Students can access, download, and share their certificates anytime.',
    },
  ];

  const menuItems = ['Home', 'Features', 'Pricing', 'About', 'Contact'];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              FARO
            </Typography>
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
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                Blockchain-Powered Certificate Management
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  animation: 'slideInLeft 1s ease-out 0.2s both',
                }}
              >
                Issue, verify, and manage tamper-proof digital certificates secured on the blockchain
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

      {/* Stats Section */}
      <Box
        id="stats-section"
        sx={{
          py: 6,
          bgcolor: '#f8f9fa',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'transparent',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-10px)' },
                }}
              >
                <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {animatedStats.institutions.toLocaleString()}+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Institutions
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'transparent',
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-10px)' },
                }}
              >
                <SchoolIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h3" fontWeight="bold" color="secondary">
                  {animatedStats.students.toLocaleString()}+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Students
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'transparent',
                  border: '2px solid',
                  borderColor: 'success.main',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-10px)' },
                }}
              >
                <VerifiedUserIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {animatedStats.certificates.toLocaleString()}+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Certificates Issued
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Why Choose FARO?
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Secure, scalable, and simple certificate management platform
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            {/* {pricingPlans.map((plan, index) => (
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
                  {plan.highlighted && (
                    <Chip
                      label="MOST POPULAR"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        fontWeight: 'bold',
                      }}
                    />
                  )}
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
                        <>
                          <Typography variant="h3" fontWeight="bold" color="primary" component="span">
                            ${plan.price}
                          </Typography>
                          <Typography variant="h6" color="text.secondary" component="span">
                            /{plan.period}
                          </Typography>
                        </>
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
                          ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
                          : {}
                      }
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))} */}
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
                FARO is a cutting-edge blockchain-based certificate management platform designed to revolutionize
                how educational institutions issue, manage, and verify digital certificates.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Built on the secure Polygon blockchain network, FARO ensures that every certificate is
                tamper-proof, permanently verifiable, and globally accessible. Our platform empowers institutions
                to move beyond traditional paper certificates and embrace the future of credential verification.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                With FARO, students can easily access, download, and share their achievements with employers,
                educational institutions, and on professional networks like LinkedIn, all while maintaining
                the highest levels of security and authenticity.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                  To provide secure, accessible, and verifiable digital credentials that empower learners
                  and institutions worldwide.
                </Typography>
                <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Our Vision
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  To become the global standard for blockchain-based credential verification, making
                  certificate fraud a thing of the past.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Us Section */}
      <Box id="contact" sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Get In Touch
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Have questions? We'd love to hear from you.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Contact Information
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <EmailIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        contact@faro.education
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PhoneIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        +1 (555) 123-4567
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocationOnIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        123 Education Street, Tech City, TC 12345
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <IconButton
                      sx={{ bgcolor: '#0077b5', color: 'white', '&:hover': { bgcolor: '#006097' } }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton
                      sx={{ bgcolor: '#1DA1F2', color: 'white', '&:hover': { bgcolor: '#0d8bd9' } }}
                    >
                      <TwitterIcon />
                    </IconButton>
                    <IconButton
                      sx={{ bgcolor: '#4267B2', color: 'white', '&:hover': { bgcolor: '#365899' } }}
                    >
                      <FacebookIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Send Us a Message
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a2e', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  FARO
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                Blockchain-powered certificate management for the modern age. Secure, verifiable, and accessible.
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
