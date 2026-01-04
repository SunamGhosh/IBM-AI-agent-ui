import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  School,
  Quiz,
  Translate,
  Psychology,
  TrendingUp,
  People,
  Lightbulb,
  Star,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI Learning Assistant',
      description: 'Get personalized help from our advanced AI tutor. Ask questions, get explanations, and learn at your own pace.',
      benefits: ['24/7 availability', 'Personalized responses', 'Adaptive learning'],
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Smart Quiz Generator',
      description: 'AI-powered quizzes that adapt to your learning gaps and current skill level. Track progress and improve continuously.',
      benefits: ['Gap-based questions', 'Adaptive difficulty', 'Detailed analytics'],
    },
    {
      icon: <Translate sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Translation Tools',
      description: 'Break language barriers in education with our AI-powered translation tools for educational content and accessibility.',
      benefits: ['Multiple languages', 'Educational context', 'Quiz translation'],
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Students Helped' },
    { number: '50+', label: 'Subjects Covered' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'AI Support' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'High School Student',
      avatar: 'SJ',
      content: 'EduAgent helped me understand complex math concepts that I struggled with for months. The AI assistant is like having a personal tutor!',
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      role: 'University Professor',
      avatar: 'MC',
      content: 'As an educator, I\'m impressed by how well this platform adapts to different learning styles and provides comprehensive support.',
      rating: 5,
    },
    {
      name: 'Emma Rodriguez',
      role: 'Language Learner',
      avatar: 'ER',
      content: 'The translation tools made learning a new language so much easier. I can now access educational content in multiple languages.',
      rating: 5,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          zIndex: 1000,
          py: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                EduAgent
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ color: 'text.primary' }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ borderRadius: 20 }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Add padding top to account for fixed header */}
      <Box sx={{ pt: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                AI-Powered Education for
                <Box component="span" sx={{ color: '#FFD700' }}>
                  {' '}Everyone
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Unlock your potential with personalized AI learning assistants, smart quiz generators, and multilingual educational tools. SDG 4 Quality Education made accessible.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#FFD700',
                    color: '#333',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#FFC107',
                    },
                  }}
                >
                  Start Learning Free
                  <ArrowForward sx={{ ml: 1 }} />
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FFD700',
                      bgcolor: 'rgba(255, 215, 0, 0.1)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/logo192.png"
                  alt="EduAgent Logo"
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    boxShadow: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    p: 3,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: '#FFD700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                  }}
                >
                  <Psychology sx={{ fontSize: 30, color: '#333' }} />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                  }}
                >
                  <Lightbulb sx={{ fontSize: 30, color: 'white' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            opacity: 0.1,
            fontSize: '8rem',
          }}
        >
          🎓
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            opacity: 0.1,
            fontSize: '6rem',
          }}
        >
          🤖
        </Box>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Powerful AI Features for Quality Education
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Our AI-powered platform combines cutting-edge technology with educational excellence to provide personalized learning experiences.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {feature.benefits.map((benefit, i) => (
                        <Chip
                          key={i}
                          label={benefit}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/register')}
                      sx={{ borderRadius: 20 }}
                    >
                      Try It Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SDG 4 Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Contributing to SDG 4:
              <Box component="span" sx={{ color: 'primary.main' }}>
                {' '}Quality Education
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              EduAgent is committed to achieving Sustainable Development Goal 4 by ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                'Inclusive and accessible education for everyone',
                'Personalized learning experiences',
                'Multilingual educational support',
                'AI-powered educational equity',
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 3,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                To democratize quality education through artificial intelligence, breaking down barriers and providing personalized learning experiences that adapt to every student's unique needs and circumstances.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Join Our Mission
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              What Our Users Say
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join thousands of learners who have transformed their educational journey with EduAgent.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardContent sx={{ pt: 4 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#FFD700' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Transform Your Learning Experience?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join EduAgent today and discover the power of AI-driven personalized education.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#FFD700',
                color: '#333',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  bgcolor: '#FFC107',
                },
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                '&:hover': {
                  borderColor: '#FFD700',
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                🎓 EduAgent
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                AI-powered education for SDG 4 Quality Education. Empowering learners worldwide with personalized, accessible, and inclusive educational experiences.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['AI Learning Assistant', 'Quiz Generator', 'Translation Tools', 'Dashboard'].map((item) => (
                  <Button
                    key={item}
                    sx={{ color: 'white', justifyContent: 'flex-start', p: 0 }}
                    onClick={() => navigate('/register')}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact & Support
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                support@eduagent.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © 2024 EduAgent. Built for Quality Education Worldwide.
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: 'grey.700' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.6 }}>
            Made with ❤️ for SDG 4 - Quality Education
          </Typography>
        </Container>
      </Box>
      </Box>
    </Box>
  );
};

export default Home;
