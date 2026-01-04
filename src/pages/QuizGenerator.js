import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Quiz, Add, PlayArrow, Analytics } from '@mui/icons-material';
import { quizAPI } from '../services/api';

const QuizGenerator = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [quizForm, setQuizForm] = useState({
    subject: '',
    topic: '',
    difficulty: 'medium',
    learningGaps: [],
  });

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

  const topics = {
    Mathematics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
    Science: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    History: ['World History', 'Ancient Civilizations', 'Modern History'],
    Literature: ['Poetry', 'Fiction', 'Drama', 'Literary Analysis'],
    Physics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Optics'],
    Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
    Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Biology'],
    'Computer Science': ['Programming', 'Algorithms', 'Data Structures', 'Web Development'],
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const [quizzesResponse, analyticsResponse] = await Promise.all([
        quizAPI.getQuizzes(),
        quizAPI.getAnalytics(),
      ]);
      setQuizzes(quizzesResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizForm.subject || !quizForm.topic) {
      alert('Please select both subject and topic');
      return;
    }

    setGenerating(true);
    try {
      const response = await quizAPI.generateQuiz(quizForm);
      const newQuiz = response.data.quiz;
      setQuizzes([response.data, ...quizzes]);
      setOpenDialog(false);
      setQuizForm({
        subject: '',
        topic: '',
        difficulty: 'medium',
        learningGaps: [],
      });

      // Navigate to take the quiz
      navigate(`/quiz/${response.data.quizId}`);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewResults = (quizId) => {
    navigate(`/quiz/${quizId}/results`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            <Quiz sx={{ mr: 1, verticalAlign: 'middle' }} />
            Quiz Generator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and take quizzes based on your learning gaps
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          size="large"
        >
          Generate New Quiz
        </Button>
      </Box>

      {/* Analytics Overview */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {analytics.totalQuizzes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Quizzes
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {analytics.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {analytics.recentPerformance.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent Quizzes
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Analytics sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Performance Analytics
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Recent Performance */}
      {analytics?.recentPerformance?.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Performance
          </Typography>
          <Grid container spacing={2}>
            {analytics.recentPerformance.map((performance, index) => (
              <Grid xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {performance.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {performance.topic}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color={`${getScoreColor(performance.score)}.main`}>
                        {performance.score}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(performance.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Quiz List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your Quizzes
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : quizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Quiz sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No quizzes yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate your first quiz to get started with learning gap-based assessments
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid xs={12} md={6} lg={4} key={quiz._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ flex: 1, mr: 1 }}>
                        {quiz.title}
                      </Typography>
                      <Chip
                        label={quiz.difficulty}
                        color={getDifficultyColor(quiz.difficulty)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {quiz.subject} - {quiz.topic}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </Typography>

                    {quiz.completed && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Score: <span style={{ color: getScoreColor(quiz.score) === 'success' ? 'green' : getScoreColor(quiz.score) === 'warning' ? 'orange' : 'red' }}>
                            {quiz.score}%
                          </span>
                        </Typography>
                      </Box>
                    )}

                    {quiz.learningGaps && quiz.learningGaps.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Learning Gaps:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {quiz.learningGaps.slice(0, 2).map((gap, index) => (
                            <Chip
                              key={index}
                              label={gap.topic}
                              size="small"
                              variant="outlined"
                              color="warning"
                            />
                          ))}
                          {quiz.learningGaps.length > 2 && (
                            <Chip
                              label={`+${quiz.learningGaps.length - 2} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    {!quiz.completed ? (
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => handleTakeQuiz(quiz._id)}
                        fullWidth
                      >
                        Take Quiz
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        onClick={() => handleViewResults(quiz._id)}
                        fullWidth
                      >
                        View Results
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Generate Quiz Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate New Quiz</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Alert severity="info">
              Our AI will analyze your learning gaps and create a personalized quiz to help you improve.
            </Alert>

            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={quizForm.subject}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    subject: e.target.value,
                    topic: '', // Reset topic when subject changes
                  })
                }
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {quizForm.subject && (
              <FormControl fullWidth>
                <InputLabel>Topic</InputLabel>
                <Select
                  value={quizForm.topic}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, topic: e.target.value })
                  }
                >
                  {topics[quizForm.subject]?.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={quizForm.difficulty}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, difficulty: e.target.value })
                }
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Learning Gaps (optional)"
              multiline
              rows={3}
              value={quizForm.learningGaps.join('\n')}
              onChange={(e) =>
                setQuizForm({
                  ...quizForm,
                  learningGaps: e.target.value.split('\n').filter(gap => gap.trim()),
                })
              }
              placeholder="Specify areas you want to focus on, one per line..."
              helperText="Leave empty for AI to analyze your learning patterns"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateQuiz}
            variant="contained"
            disabled={generating || !quizForm.subject || !quizForm.topic}
          >
            {generating ? <CircularProgress size={24} /> : 'Generate Quiz'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizGenerator;



