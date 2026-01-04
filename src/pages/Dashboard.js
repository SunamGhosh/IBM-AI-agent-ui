import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  School,
  Quiz,
  Translate,
  TrendingUp,
  Book,
  Lightbulb,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { learningAPI, quizAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [recResponse, quizResponse] = await Promise.all([
          learningAPI.getRecommendations(),
          quizAPI.getQuizzes(),
        ]);

        setRecommendations(recResponse.data);
        setRecentQuizzes(quizResponse.data.slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'AI Learning Assistant',
      description: 'Get personalized help with any subject',
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/learning',
      color: 'primary',
    },
    {
      title: 'Generate Quiz',
      description: 'Create quizzes based on your learning gaps',
      icon: <Quiz sx={{ fontSize: 40, color: 'secondary.main' }} />,
      path: '/quizzes',
      color: 'secondary',
    },
    {
      title: 'Translation Tools',
      description: 'Translate educational content for accessibility',
      icon: <Translate sx={{ fontSize: 40, color: 'success.main' }} />,
      path: '/translation',
      color: 'success',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.username}! 🎓
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your personalized learning dashboard for SDG 4 - Quality Education
      </Typography>

      {/* Learning Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Current Level
            </Typography>
            <Typography variant="h4" color="primary">
              {user?.learningProfile?.currentLevel || 'Beginner'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep learning to advance!
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Subjects
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {user?.learningProfile?.subjects?.slice(0, 3).map((subject) => (
                <Chip key={subject} label={subject} size="small" />
              )) || <Typography variant="body2">No subjects selected</Typography>}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recentQuizzes.length > 0
                ? `${recentQuizzes.length} quiz${recentQuizzes.length > 1 ? 'es' : ''} completed`
                : 'No recent activity'
              }
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                {action.icon}
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color={action.color}
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(action.path)}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* AI Recommendations */}
      {recommendations && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Learning Recommendations
              </Typography>
              {loading ? (
                <LinearProgress />
              ) : (
                <Box>
                  {recommendations.nextTopics && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Next Topics to Study:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {recommendations.nextTopics.map((topic, index) => (
                          <Chip key={index} label={topic} variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {recommendations.studyMethods && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Recommended Study Methods:
                      </Typography>
                      <ul>
                        {recommendations.studyMethods.map((method, index) => (
                          <li key={index}>
                            <Typography variant="body2">{method}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Recent Quizzes */}
      {recentQuizzes.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                <Book sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Quizzes
              </Typography>
              <Grid container spacing={2}>
                {recentQuizzes.map((quiz) => (
                  <Grid item xs={12} md={4} key={quiz._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {quiz.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {quiz.subject} - {quiz.topic}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Score: {quiz.score || 'Not completed'}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        {!quiz.completed && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/quiz/${quiz._id}`)}
                          >
                            Take Quiz
                          </Button>
                        )}
                        {quiz.completed && (
                          <Button
                            size="small"
                            color="secondary"
                            onClick={() => navigate(`/quiz/${quiz._id}/results`)}
                          >
                            View Results
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/quizzes')}
                >
                  View All Quizzes
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;



