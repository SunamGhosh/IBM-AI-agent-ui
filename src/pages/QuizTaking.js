import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Quiz, ArrowBack, ArrowForward } from '@mui/icons-material';
import { quizAPI } from '../services/api';

const QuizTaking = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, unansweredCount: 0 });

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(quizId);
      setQuiz(response.data);
      // Initialize answers array with null values
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = answers.filter(answer => answer === null).length;
    if (unanswered > 0) {
      setConfirmDialog({ open: true, unansweredCount: unanswered });
      return;
    }

    await submitQuiz();
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const response = await quizAPI.submitQuiz(quizId, answers);
      navigate(`/quiz/${quizId}/results`, { state: { results: response.data } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmSubmit = () => {
    setConfirmDialog({ open: false, unansweredCount: 0 });
    submitQuiz();
  };

  const handleCancelSubmit = () => {
    setConfirmDialog({ open: false, unansweredCount: 0 });
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading quiz...</Typography>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Quiz not found</Alert>
      </Container>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredQuestions = answers.filter(answer => answer !== null).length;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Quiz Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            <Quiz sx={{ mr: 1, verticalAlign: 'middle' }} />
            {quiz.title}
          </Typography>
          <Chip
            label={quiz.difficulty}
            color={getDifficultyColor(quiz.difficulty)}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {quiz.subject} - {quiz.topic}
        </Typography>

        {quiz.description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {quiz.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Progress: Question {currentQuestion + 1} of {quiz.questions.length}
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Answered: {answeredQuestions} / {quiz.questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
      </Paper>

      {/* Current Question */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
            {question.question}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={
                    <Typography variant="body1">
                      {String.fromCharCode(65 + index)}. {option}
                    </Typography>
                  }
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    border: answers[currentQuestion] === index ? '2px solid' : '1px solid transparent',
                    borderColor: answers[currentQuestion] === index ? 'primary.main' : 'transparent',
                    bgcolor: answers[currentQuestion] === index ? 'primary.light' : 'transparent',
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {quiz.questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestion ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setCurrentQuestion(index)}
              sx={{
                minWidth: 40,
                bgcolor: answers[index] !== null ? 'success.light' : 'transparent',
                color: answers[index] !== null ? 'success.contrastText' : 'inherit',
              }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={submitting}
            size="large"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>

      {/* Learning Gaps Info */}
      {quiz.learningGaps && quiz.learningGaps.length > 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            This quiz targets these learning gaps:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {quiz.learningGaps.map((gap, index) => (
              <Chip
                key={index}
                label={`${gap.topic}: ${gap.gapDescription}`}
                size="small"
                color="warning"
                variant="outlined"
              />
            ))}
          </Box>
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelSubmit}
        aria-labelledby="confirm-submit-title"
        aria-describedby="confirm-submit-description"
      >
        <DialogTitle id="confirm-submit-title">
          Unanswered Questions
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-submit-description">
            You have {confirmDialog.unansweredCount} unanswered question(s).
            Are you sure you want to submit the quiz? Unanswered questions will be marked as incorrect.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} variant="contained" autoFocus>
            Submit Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizTaking;



