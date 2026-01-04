import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Alert,
  Avatar,
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    learningProfile: {
      subjects: [],
      currentLevel: 'beginner',
      learningGoals: [],
      preferredLanguage: 'en',
      strengths: [],
      weaknesses: [],
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        learningProfile: {
          subjects: user.learningProfile?.subjects || [],
          currentLevel: user.learningProfile?.currentLevel || 'beginner',
          learningGoals: user.learningProfile?.learningGoals || [],
          preferredLanguage: user.learningProfile?.preferredLanguage || 'en',
          strengths: user.learningProfile?.strengths || [],
          weaknesses: user.learningProfile?.weaknesses || [],
        },
      });
    }
  }, [user]);

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

  const handleStrengthChange = (strength) => {
    const currentStrengths = formData.learningProfile.strengths;
    const newStrengths = currentStrengths.includes(strength)
      ? currentStrengths.filter((s) => s !== strength)
      : [...currentStrengths, strength];

    setFormData({
      ...formData,
      learningProfile: {
        ...formData.learningProfile,
        strengths: newStrengths,
      },
    });
  };

  const handleWeaknessChange = (weakness) => {
    const currentWeaknesses = formData.learningProfile.weaknesses;
    const newWeaknesses = currentWeaknesses.includes(weakness)
      ? currentWeaknesses.filter((w) => w !== weakness)
      : [...currentWeaknesses, weakness];

    setFormData({
      ...formData,
      learningProfile: {
        ...formData.learningProfile,
        weaknesses: newWeaknesses,
      },
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage('Profile updated successfully!');
        setEditMode(false);
      } else {
        setMessage(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        learningProfile: {
          subjects: user.learningProfile?.subjects || [],
          currentLevel: user.learningProfile?.currentLevel || 'beginner',
          learningGoals: user.learningProfile?.learningGoals || [],
          preferredLanguage: user.learningProfile?.preferredLanguage || 'en',
          strengths: user.learningProfile?.strengths || [],
          weaknesses: user.learningProfile?.weaknesses || [],
        },
      });
    }
    setEditMode(false);
    setMessage('');
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
        My Profile
      </Typography>

      {message && (
        <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: 40,
              }}
            >
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Typography>

            {!editMode && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Edit Profile
              </Button>
            )}
          </Paper>

          {/* Learning Stats */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Learning Statistics
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Current Level
              </Typography>
              <Typography variant="h6" color="primary">
                {user.learningProfile?.currentLevel || 'Beginner'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Subjects
              </Typography>
              <Typography variant="body1">
                {user.learningProfile?.subjects?.length || 0} subjects
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Learning Goals
              </Typography>
              <Typography variant="body1">
                {user.learningProfile?.learningGoals?.length || 0} goals
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Preferred Language
              </Typography>
              <Typography variant="body1">
                {user.learningProfile?.preferredLanguage === 'en' ? 'English' :
                 user.learningProfile?.preferredLanguage === 'es' ? 'Spanish' :
                 user.learningProfile?.preferredLanguage === 'fr' ? 'French' :
                 user.learningProfile?.preferredLanguage === 'de' ? 'German' :
                 'English'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {editMode ? 'Edit Profile' : 'Profile Details'}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Learning Profile
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" disabled={!editMode}>
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
                <FormControl fullWidth margin="normal" disabled={!editMode}>
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

            {/* Subjects */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Subjects of Interest:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  onClick={editMode ? () => handleSubjectChange(subject) : undefined}
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
                  sx={{ cursor: editMode ? 'pointer' : 'default' }}
                />
              ))}
            </Box>

            {/* Learning Goals */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Learning Goals:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {learningGoals.map((goal) => (
                <Chip
                  key={goal}
                  label={goal}
                  onClick={editMode ? () => handleGoalChange(goal) : undefined}
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
                  sx={{ cursor: editMode ? 'pointer' : 'default' }}
                />
              ))}
            </Box>

            {/* Strengths and Weaknesses */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Strengths:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Problem Solving', 'Memorization', 'Critical Thinking', 'Communication', 'Creativity', 'Analysis'].map((strength) => (
                    <Chip
                      key={strength}
                      label={strength}
                      size="small"
                      onClick={editMode ? () => handleStrengthChange(strength) : undefined}
                      color={
                        formData.learningProfile.strengths.includes(strength)
                          ? 'success'
                          : 'default'
                      }
                      variant={
                        formData.learningProfile.strengths.includes(strength)
                          ? 'filled'
                          : 'outlined'
                      }
                      sx={{ cursor: editMode ? 'pointer' : 'default' }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Areas for Improvement:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Time Management', 'Focus', 'Understanding Concepts', 'Practice', 'Study Habits', 'Test Taking'].map((weakness) => (
                    <Chip
                      key={weakness}
                      label={weakness}
                      size="small"
                      onClick={editMode ? () => handleWeaknessChange(weakness) : undefined}
                      color={
                        formData.learningProfile.weaknesses.includes(weakness)
                          ? 'warning'
                          : 'default'
                      }
                      variant={
                        formData.learningProfile.weaknesses.includes(weakness)
                          ? 'filled'
                          : 'outlined'
                      }
                      sx={{ cursor: editMode ? 'pointer' : 'default' }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            {editMode && (
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;



