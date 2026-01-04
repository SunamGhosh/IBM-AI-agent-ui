import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    learningProfile: {
      subjects: [],
      currentLevel: 'beginner',
      learningGoals: [],
      preferredLanguage: 'en',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const subjects = [
    'Mathematics',
    'Science',
    'History',
    'Literature',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Languages',
    'Art',
    'Music',
    'Geography',
  ];

  const learningGoals = [
    'Improve grades',
    'Learn new skills',
    'Prepare for exams',
    'Career advancement',
    'Personal development',
    'Language learning',
    'STEM education',
    'Creative thinking',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubjectChange = (subject) => {
    const currentSubjects = formData.learningProfile.subjects;
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];

    setFormData({
      ...formData,
      learningProfile: {
        ...formData.learningProfile,
        subjects: newSubjects,
      },
    });
  };

  const handleGoalChange = (goal) => {
    const currentGoals = formData.learningProfile.learningGoals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];

    setFormData({
      ...formData,
      learningProfile: {
        ...formData.learningProfile,
        learningGoals: newGoals,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Join EduAgent
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create your personalized learning profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Learning Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Current Level</InputLabel>
                  <Select
                    name="learningProfile.currentLevel"
                    value={formData.learningProfile.currentLevel}
                    onChange={handleChange}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Preferred Language</InputLabel>
                  <Select
                    name="learningProfile.preferredLanguage"
                    value={formData.learningProfile.preferredLanguage}
                    onChange={handleChange}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Subjects of Interest:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  onClick={() => handleSubjectChange(subject)}
                  color={
                    formData.learningProfile.subjects.includes(subject)
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    formData.learningProfile.subjects.includes(subject)
                      ? 'filled'
                      : 'outlined'
                  }
                />
              ))}
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Learning Goals:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {learningGoals.map((goal) => (
                <Chip
                  key={goal}
                  label={goal}
                  onClick={() => handleGoalChange(goal)}
                  color={
                    formData.learningProfile.learningGoals.includes(goal)
                      ? 'secondary'
                      : 'default'
                  }
                  variant={
                    formData.learningProfile.learningGoals.includes(goal)
                      ? 'filled'
                      : 'outlined'
                  }
                />
              ))}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/login" variant="body2">
                  {'Already have an account? Sign In'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;



