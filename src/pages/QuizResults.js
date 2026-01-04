import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import {
  Quiz,
  CheckCircle,
  Cancel,
  ExpandMore,
  Replay,
  ArrowBack,
  TrendingUp,
} from '@mui/icons-material';
import { quizAPI } from '../services/api';

const QuizResults = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.results) {
      // Results passed from QuizTaking component
      setResults(location.state.results);
      loadQuiz();
    } else {
      // Load results from API
      loadResults();
    }
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(quizId);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    try {
      // This would need to be implemented in the backend to get stored results
      const quizResponse = await quizAPI.getQuiz(quizId);
      setQuiz(quizResponse.data);
      // For now, we'll just show the quiz info
      setResults({
        score: quizResponse.data.score || 0,
        totalQuestions: quizResponse.data.questions?.length || 0,
        correctAnswers: 0,
        results: [],
      });
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! Excellent work!';
    if (score >= 80) return 'Great job! Well done!';
    if (score >= 70) return 'Good work! Keep it up!';
    if (score >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better.';
  };

  if (loading || !quiz || !results) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading results...</Typography>
      </Container>
    );
  }

  const scorePercentage = results.score;
  const scoreColor = getScoreColor(scorePercentage);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: `${scoreColor}.light` }}>
        <Quiz sx={{ fontSize: 64, color: `${scoreColor}.main`, mb: 2 }} />
        <Typography variant="h4" gutterBottom color={`${scoreColor}.contrastText`}>
          Quiz Complete!
        </Typography>
        <Typography variant="h6" gutterBottom color={`${scoreColor}.contrastText`}>
          {quiz.title}
        </Typography>
        <Typography variant="body1" color={`${scoreColor}.contrastText`} sx={{ mb: 3 }}>
          {quiz.subject} - {quiz.topic}
        </Typography>

        {/* Score Display */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" color={`${scoreColor}.contrastText`} sx={{ fontWeight: 'bold', mb: 1 }}>
            {scorePercentage}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={scorePercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'white',
              },
            }}
          />
          <Typography variant="body1" color={`${scoreColor}.contrastText`} sx={{ mt: 1 }}>
            {results.correctAnswers} out of {results.totalQuestions} correct
          </Typography>
        </Box>

        <Alert
          severity={scoreColor}
          sx={{
            mb: 3,
            color: `${scoreColor}.contrastText`,
            bgcolor: 'rgba(255,255,255,0.1)',
            border: `1px solid rgba(255,255,255,0.3)`,
          }}
        >
          <Typography variant="body1">
            {getScoreMessage(scorePercentage)}
          </Typography>
        </Alert>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Replay />}
          onClick={() => navigate('/quizzes')}
          size="large"
        >
          Take Another Quiz
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/quizzes')}
          size="large"
        >
          Back to Quizzes
        </Button>
      </Box>

      {/* Detailed Results */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Question Review
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review your answers and learn from the explanations
            </Typography>

            {quiz.questions?.map((question, index) => {
              const userAnswer = results.results?.[index];
              const isCorrect = userAnswer?.isCorrect;

              return (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: isCorrect ? 'success.light' : 'error.light',
                      '&:hover': {
                        bgcolor: isCorrect ? 'success.main' : 'error.main',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {isCorrect ? (
                        <CheckCircle sx={{ mr: 1, color: 'success.dark' }} />
                      ) : (
                        <Cancel sx={{ mr: 1, color: 'error.dark' }} />
                      )}
                      <Typography sx={{ flex: 1 }}>
                        Question {index + 1}: {isCorrect ? 'Correct' : 'Incorrect'}
                      </Typography>
                      <Chip
                        label={`${question.difficulty}`}
                        size="small"
                        color={question.difficulty === 'easy' ? 'success' :
                               question.difficulty === 'medium' ? 'warning' : 'error'}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      {question.question}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Your Answer:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={String.fromCharCode(65 + (userAnswer?.userAnswer || 0))}
                        color={isCorrect ? 'success' : 'error'}
                        sx={{ mr: 1 }}
                      />
                      <Typography>
                        {question.options[userAnswer?.userAnswer || 0]}
                      </Typography>
                    </Box>

                    {!isCorrect && (
                      <>
                        <Typography variant="subtitle2" gutterBottom color="success.main">
                          Correct Answer:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={String.fromCharCode(65 + question.correctAnswer)}
                            color="success"
                            sx={{ mr: 1 }}
                          />
                          <Typography>
                            {question.options[question.correctAnswer]}
                          </Typography>
                        </Box>
                      </>
                    )}

                    {question.explanation && (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          Explanation:
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {question.explanation}
                        </Typography>
                      </>
                    )}

                    {question.topic && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={`Topic: ${question.topic}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Performance Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Performance Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Score Distribution
              </Typography>
              <Typography variant="h6" color={`${scoreColor}.main`}>
                {scorePercentage >= 80 ? 'Excellent' :
                 scorePercentage >= 60 ? 'Good' :
                 scorePercentage >= 40 ? 'Fair' : 'Needs Improvement'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Questions Answered
              </Typography>
              <Typography variant="h6">
                {results.correctAnswers} / {results.totalQuestions}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Accuracy Rate
              </Typography>
              <Typography variant="h6">
                {results.totalQuestions > 0 ? Math.round((results.correctAnswers / results.totalQuestions) * 100) : 0}%
              </Typography>
            </Box>
          </Paper>

          {/* Learning Recommendations */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Learning Recommendations
            </Typography>

            {scorePercentage < 70 ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Here are some tips to improve:
                </Typography>
                <ul>
                  <li>Review the explanations for incorrect answers</li>
                  <li>Focus on the topics you struggled with</li>
                  <li>Take another quiz on similar subjects</li>
                  <li>Use the AI Learning Assistant for help</li>
                </ul>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Great work! To continue improving:
                </Typography>
                <ul>
                  <li>Try quizzes at a higher difficulty level</li>
                  <li>Explore related topics</li>
                  <li>Challenge yourself with advanced subjects</li>
                  <li>Help others learn these concepts</li>
                </ul>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/learning')}
              >
                Get AI Learning Help
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuizResults;


