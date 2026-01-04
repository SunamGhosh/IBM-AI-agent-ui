import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Translate, SwapHoriz, School, Quiz } from '@mui/icons-material';
import { translationAPI } from '../services/api';

const TranslationTools = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [languages, setLanguages] = useState({});
  const [translationData, setTranslationData] = useState({
    text: '',
    fromLang: 'en',
    toLang: 'es',
    translatedText: '',
    loading: false,
  });
  const [educationalData, setEducationalData] = useState({
    content: '',
    contentType: 'text',
    fromLang: 'en',
    toLang: 'es',
    translatedContent: '',
    loading: false,
  });
  const [quizData, setQuizData] = useState({
    questions: [],
    fromLang: 'en',
    toLang: 'es',
    translatedQuestions: [],
    loading: false,
  });

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const response = await translationAPI.getLanguages();
      setLanguages(response.data.languages);
    } catch (error) {
      console.error('Error loading languages:', error);
    }
  };

  const handleTranslate = async () => {
    if (!translationData.text.trim()) return;

    setTranslationData({ ...translationData, loading: true });
    try {
      const response = await translationAPI.translate({
        text: translationData.text,
        fromLang: translationData.fromLang,
        toLang: translationData.toLang,
      });

      setTranslationData({
        ...translationData,
        translatedText: response.data.translatedText,
        loading: false,
      });
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationData({ ...translationData, loading: false });
    }
  };

  const handleEducationalTranslate = async () => {
    if (!educationalData.content.trim()) return;

    setEducationalData({ ...educationalData, loading: true });
    try {
      const response = await translationAPI.translateEducationalContent({
        content: educationalData.content,
        contentType: educationalData.contentType,
        fromLang: educationalData.fromLang,
        toLang: educationalData.toLang,
      });

      setEducationalData({
        ...educationalData,
        translatedContent: response.data.translatedContent,
        loading: false,
      });
    } catch (error) {
      console.error('Educational translation error:', error);
      setEducationalData({ ...educationalData, loading: false });
    }
  };

  const handleQuizTranslate = async () => {
    if (!quizData.questions.length) return;

    setQuizData({ ...quizData, loading: true });
    try {
      const response = await translationAPI.translateQuiz({
        questions: quizData.questions,
        fromLang: quizData.fromLang,
        toLang: quizData.toLang,
      });

      setQuizData({
        ...quizData,
        translatedQuestions: response.data.translatedQuestions,
        loading: false,
      });
    } catch (error) {
      console.error('Quiz translation error:', error);
      setQuizData({ ...quizData, loading: false });
    }
  };

  const addQuizQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
        },
      ],
    });
  };

  const updateQuizQuestion = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const swapLanguages = () => {
    setTranslationData({
      ...translationData,
      fromLang: translationData.toLang,
      toLang: translationData.fromLang,
      text: translationData.translatedText,
      translatedText: translationData.text,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Translate sx={{ mr: 1, verticalAlign: 'middle' }} />
        Translation Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Translate educational content for better accessibility and understanding
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="translation tabs">
          <Tab icon={<Translate />} label="General Translation" />
          <Tab icon={<School />} label="Educational Content" />
          <Tab icon={<Quiz />} label="Quiz Translation" />
        </Tabs>

        {/* General Translation Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Text Translation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Translate any text between supported languages for educational purposes.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>From Language</InputLabel>
                  <Select
                    value={translationData.fromLang}
                    onChange={(e) =>
                      setTranslationData({ ...translationData, fromLang: e.target.value })
                    }
                  >
                    {Object.entries(languages).map(([code, name]) => (
                      <MenuItem key={code} value={code}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Text to translate"
                  value={translationData.text}
                  onChange={(e) =>
                    setTranslationData({ ...translationData, text: e.target.value })
                  }
                  placeholder="Enter text to translate..."
                />
              </Grid>

              <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={swapLanguages}
                  sx={{ minWidth: 60, height: 60 }}
                >
                  <SwapHoriz />
                </Button>
              </Grid>

              <Grid item xs={12} md={5}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>To Language</InputLabel>
                  <Select
                    value={translationData.toLang}
                    onChange={(e) =>
                      setTranslationData({ ...translationData, toLang: e.target.value })
                    }
                  >
                    {Object.entries(languages).map(([code, name]) => (
                      <MenuItem key={code} value={code}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Translated text"
                  value={translationData.translatedText}
                  InputProps={{
                    readOnly: true,
                  }}
                  placeholder="Translation will appear here..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleTranslate}
                disabled={translationData.loading || !translationData.text.trim()}
              >
                {translationData.loading ? <CircularProgress size={24} /> : 'Translate'}
              </Button>
            </Box>

            {translationData.translatedText && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Translation completed! The text has been translated from {languages[translationData.fromLang]} to {languages[translationData.toLang]}.
              </Alert>
            )}
          </Box>
        )}

        {/* Educational Content Translation Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Educational Content Translation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Specialized translation for educational materials with subject-specific terminology.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    value={educationalData.contentType}
                    onChange={(e) =>
                      setEducationalData({ ...educationalData, contentType: e.target.value })
                    }
                  >
                    <MenuItem value="text">General Text</MenuItem>
                    <MenuItem value="lesson">Lesson Content</MenuItem>
                    <MenuItem value="explanation">Explanation</MenuItem>
                    <MenuItem value="definition">Definition</MenuItem>
                  </Select>
                </FormControl>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>From</InputLabel>
                      <Select
                        value={educationalData.fromLang}
                        onChange={(e) =>
                          setEducationalData({ ...educationalData, fromLang: e.target.value })
                        }
                      >
                        {Object.entries(languages).map(([code, name]) => (
                          <MenuItem key={code} value={code}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>To</InputLabel>
                      <Select
                        value={educationalData.toLang}
                        onChange={(e) =>
                          setEducationalData({ ...educationalData, toLang: e.target.value })
                        }
                      >
                        {Object.entries(languages).map(([code, name]) => (
                          <MenuItem key={code} value={code}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Educational content"
                  value={educationalData.content}
                  onChange={(e) =>
                    setEducationalData({ ...educationalData, content: e.target.value })
                  }
                  placeholder="Enter educational content to translate..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Translated Content
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={educationalData.translatedContent}
                  InputProps={{
                    readOnly: true,
                  }}
                  placeholder="Translated educational content will appear here..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleEducationalTranslate}
                disabled={educationalData.loading || !educationalData.content.trim()}
              >
                {educationalData.loading ? <CircularProgress size={24} /> : 'Translate Educational Content'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Quiz Translation Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quiz Question Translation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Translate quiz questions and answers for multilingual education.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>From</InputLabel>
                    <Select
                      value={quizData.fromLang}
                      onChange={(e) =>
                        setQuizData({ ...quizData, fromLang: e.target.value })
                      }
                    >
                      {Object.entries(languages).map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>To</InputLabel>
                    <Select
                      value={quizData.toLang}
                      onChange={(e) =>
                        setQuizData({ ...quizData, toLang: e.target.value })
                      }
                    >
                      {Object.entries(languages).map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    onClick={addQuizQuestion}
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    Add Question
                  </Button>
                </Grid>
              </Grid>

              {quizData.questions.map((question, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Question {index + 1}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Question text"
                      value={question.question}
                      onChange={(e) => updateQuizQuestion(index, 'question', e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle2" gutterBottom>
                      Answer Options
                    </Typography>
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={String.fromCharCode(65 + optionIndex)}
                          color={question.correctAnswer === optionIndex ? 'success' : 'default'}
                          size="small"
                          sx={{ mr: 1, minWidth: 40 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optionIndex] = e.target.value;
                            updateQuizQuestion(index, 'options', newOptions);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                        />
                        <Button
                          size="small"
                          variant={question.correctAnswer === optionIndex ? 'contained' : 'outlined'}
                          color="success"
                          onClick={() => updateQuizQuestion(index, 'correctAnswer', optionIndex)}
                          sx={{ ml: 1, minWidth: 80 }}
                        >
                          Correct
                        </Button>
                      </Box>
                    ))}

                    <TextField
                      fullWidth
                      label="Explanation"
                      value={question.explanation}
                      onChange={(e) => updateQuizQuestion(index, 'explanation', e.target.value)}
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              ))}

              {quizData.questions.length > 0 && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleQuizTranslate}
                    disabled={quizData.loading}
                  >
                    {quizData.loading ? <CircularProgress size={24} /> : 'Translate Quiz'}
                  </Button>
                </Box>
              )}

              {quizData.translatedQuestions.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Translated Questions
                  </Typography>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Quiz questions have been translated from {languages[quizData.fromLang]} to {languages[quizData.toLang]}.
                  </Alert>

                  {quizData.translatedQuestions.map((question, index) => (
                    <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Question {index + 1} (Translated)
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {question.question}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                          Answer Options:
                        </Typography>
                        {question.options?.map((option, optionIndex) => (
                          <Typography
                            key={optionIndex}
                            variant="body2"
                            sx={{
                              mb: 0.5,
                              color: question.correctAnswer === optionIndex ? 'success.main' : 'text.primary',
                              fontWeight: question.correctAnswer === optionIndex ? 'bold' : 'normal',
                            }}
                          >
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </Typography>
                        ))}

                        {question.explanation && (
                          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            Explanation: {question.explanation}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TranslationTools;



