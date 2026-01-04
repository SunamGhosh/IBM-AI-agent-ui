import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send, School, Lightbulb } from '@mui/icons-material';
import { learningAPI } from '../services/api';

const LearningAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState({
    subject: '',
    topic: '',
    learningObjectives: [],
  });
  const [showSetup, setShowSetup] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleStartSession = async () => {
    if (!sessionData.subject || !sessionData.topic) {
      alert('Please select both subject and topic');
      return;
    }

    setLoading(true);
    try {
      const response = await learningAPI.startSession({
        subject: sessionData.subject,
        topic: sessionData.topic,
        learningObjectives: sessionData.learningObjectives,
      });

      setSessionId(response.data.sessionId);
      setShowSetup(false);

      // Add initial welcome message
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I'm your AI learning assistant. I'll help you with ${sessionData.subject} - ${sessionData.topic}. What would you like to learn or what questions do you have?`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start learning session');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await learningAPI.chat({
        message: inputMessage,
        sessionId,
        subject: sessionData.subject,
        topic: sessionData.topic,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndSession = async () => {
    if (sessionId) {
      try {
        await learningAPI.endSession(sessionId);
        alert('Learning session ended successfully!');
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    setSessionId(null);
    setMessages([]);
    setShowSetup(true);
    setSessionData({ subject: '', topic: '', learningObjectives: [] });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <School sx={{ mr: 1, verticalAlign: 'middle' }} />
        AI Learning Assistant
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Get personalized help with any subject using our AI-powered learning assistant
      </Typography>

      {showSetup ? (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Start a Learning Session
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tell us what you'd like to learn about, and our AI assistant will provide personalized guidance.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={sessionData.subject}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
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

            {sessionData.subject && (
              <FormControl fullWidth>
                <InputLabel>Topic</InputLabel>
                <Select
                  value={sessionData.topic}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, topic: e.target.value })
                  }
                >
                  {topics[sessionData.subject]?.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              label="Learning Objectives (optional)"
              multiline
              rows={3}
              value={sessionData.learningObjectives.join('\n')}
              onChange={(e) =>
                setSessionData({
                  ...sessionData,
                  learningObjectives: e.target.value.split('\n').filter(obj => obj.trim()),
                })
              }
              placeholder="Enter your learning goals, one per line..."
              helperText="What do you want to achieve in this session?"
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleStartSession}
              disabled={loading || !sessionData.subject || !sessionData.topic}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Start Learning Session'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          {/* Session Info */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">
                  Session: {sessionData.subject} - {sessionData.topic}
                </Typography>
                <Typography variant="body2">
                  AI-powered personalized learning assistant
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleEndSession}
                size="small"
              >
                End Session
              </Button>
            </Box>
          </Paper>

          {/* Messages */}
          <Paper
            sx={{
              flex: 1,
              p: 2,
              mb: 2,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Card
                  sx={{
                    maxWidth: '70%',
                    bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <CardContent sx={{ pb: '16px !important' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        color: message.role === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Paper>

          {/* Input */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your AI learning assistant anything..."
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={24} /> : <Send />}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Press Enter to send, Shift+Enter for new line
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default LearningAssistant;



