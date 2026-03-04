import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedLesson} from '../../store/reducer/programReducer';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {gGap} from '../../constants/Sizes';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';

interface Option {
  _id?: string;
  option: string;
  isCorrect?: boolean;
  isAnswered?: boolean;
}

interface Question {
  _id?: string;
  question: string;
  options: Option[];
  updatedAt?: string;
  createdAt?: string;
}

interface QuizData {
  interview: {_id: string};
  questions?: Question[];
  result?: {
    answers: any[];
  };
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passingStatus?: string;
  answers?: any[];
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

function calculateQuizResult(questions: any[]): QuizResult {
  let score = 0;
  let totalQuestions = 0;

  // Iterate through each question
  for (const question of questions) {
    if (
      !question.question ||
      question.question.trim() === '' ||
      question.options.length === 0
    ) {
      continue;
    }

    totalQuestions++;

    // Find the answered option
    const answeredOption = question.options.find(
      (option: {isAnswered: boolean}) => option.isAnswered === true,
    );

    // If an option was answered, check if it is correct
    if (answeredOption && answeredOption.isCorrect === true) {
      score++;
    }
  }

  return {
    score: score,
    total: totalQuestions,
    percentage: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
  };
}

const ProgramQuizModal: React.FC = () => {
  const {selectedLesson} = useSelector((state: RootState) => state.program);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // State for quiz data and UI
  const [loading, setLoading] = useState<boolean>(true);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60);
  console.log('timeRemaining', JSON.stringify(timeRemaining, null, 2));
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Flag to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Set mounted flag to true
    isMounted.current = true;

    const loadProgramQuiz = async () => {
      if (!selectedLesson?.lesson?.url) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/interviewqa/question/getactive/${selectedLesson?.lesson?.url}?source=${selectedLesson._id}`,
        );

        // Only update state if component is still mounted
        if (isMounted.current) {
          setQuizData(response.data);

          if (response.data.questions) {
            setQuestions(response.data.questions);
          }

          // Check if there are already results
          if (response.data.result?.answers?.length > 0) {
            setQuizResults(calculateQuizResult(response.data.result.answers));
          }

          setLoading(false);
        }
      } catch (error: any) {
        console.error(
          'Error fetching quiz data:',
          error.response?.data || error.message,
        );
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadProgramQuiz();

    // Cleanup - clear timer and mark component as unmounted
    return () => {
      isMounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      restartQuiz();
    };
  }, [selectedLesson?._id, selectedLesson?.lesson?.url]);

  // Start quiz and timer
  const startQuiz = () => {
    setQuizStarted(true);

    // Start 15-minute countdown
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle option selection
  const handleSelectOption = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz answers
  const submitQuiz = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      setLoading(true);

      function generateQuizData() {
        return Object.keys(selectedAnswers).map(item => ({
          question: questions[parseInt(item, 10)].question,
          options: questions[parseInt(item, 10)].options.map(i =>
            i.option === selectedAnswers[parseInt(item, 10)]
              ? {...i, isAnswered: true}
              : i,
          ),
        }));
      }

      if (!quizData?.interview?._id || !selectedLesson?._id) {
        console.error('Missing required data for submission');
        if (isMounted.current) {
          setLoading(false);
        }
        return;
      }

      const data = {
        answers: generateQuizData(),
        source: selectedLesson._id,
        course: selectedLesson.myCourse?.course || null,
      };

      const response = await axiosInstance.post<{result: QuizResult}>(
        `/interviewqa/answer/submit/${quizData.interview._id}`,
        data,
      );

      // Only update state if component is still mounted
      if (isMounted.current) {
        setQuizResults(calculateQuizResult(response.data.result.answers || []));
        setLoading(false);
      }
    } catch (error: any) {
      console.error(
        'Error submitting quiz:',
        error.response?.data || error.message,
      );
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(15 * 60);
    setQuizResults(null);
  };

  // Handle close modal
  const handleCloseModal = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Use our safe close method
    handleModalClose();
  };

  // Render quiz results
  const renderResults = () => {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Quiz Results</Text>

        {quizResults ? (
          <>
            <Text style={styles.scoreText}>
              Your score: {quizResults.score || '0'}/
              {quizResults.total || questions.length}
            </Text>

            <Text style={styles.percentageText}>
              {Math.abs(quizResults.percentage).toFixed(2)}%
            </Text>

            {quizResults.passingStatus && (
              <Text
                style={[
                  styles.passingStatus,
                  quizResults.passingStatus === 'Passed'
                    ? styles.passed
                    : styles.failed,
                ]}>
                {quizResults.passingStatus}
              </Text>
            )}

            <TouchableOpacity
              style={styles.restartButton}
              onPress={restartQuiz}>
              <Text style={styles.buttonText}>Retake Quiz</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noResultsText}>No results available.</Text>
        )}
      </View>
    );
  };

  // Render current question
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return null;

    return (
      <View style={styles.questionContainer}>
        <View style={styles.timerAndNavigation}>
          <Text style={styles.timerText}>
            Time: {formatTime(timeRemaining)}
          </Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswers[currentQuestionIndex] === option.option
                  ? styles.selectedOption
                  : {},
              ]}
              onPress={() =>
                handleSelectOption(currentQuestionIndex, option.option)
              }>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswers[currentQuestionIndex] === option.option
                    ? styles.selectedOptionText
                    : {},
                ]}>
                {option.option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0
                ? {backgroundColor: Colors.DisableSecondaryBackgroundColor}
                : {backgroundColor: Colors.SecondaryButtonBackgroundColor},
            ]}
            onPress={prevQuestion}
            disabled={currentQuestionIndex === 0}>
            <Text
              style={[
                styles.navButtonText,
                currentQuestionIndex === 0 && {
                  color: Colors.DisableSecondaryButtonTextColor,
                },
              ]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestionIndex === questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.submitButton]}
              onPress={submitQuiz}>
              <Text style={styles.submitButtonText}>Submit Quiz</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navButton} onPress={nextQuestion}>
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render start screen
  const renderStartScreen = () => {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.quizTitle}>
          {selectedLesson?.lesson?.title || 'Quiz'}
        </Text>
        <Text style={styles.quizInstructions}>
          You will have 15 minutes to complete this quiz. There are{' '}
          {questions.length} questions in total.
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Track modal visibility with local state to prevent unexpected closing
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Update local visibility state when selectedLesson changes
  useEffect(() => {
    if (selectedLesson?.quizModalVisible) {
      setIsModalVisible(true);
    }
  }, [selectedLesson]);

  // Handle modal close with proper state management
  const handleModalClose = () => {
    // First set local state
    setIsModalVisible(false);

    // Use setTimeout to delay the Redux dispatch to prevent race conditions
    setTimeout(() => {
      dispatch(setSelectedLesson(null));
    }, 100);
  };

  // Don't render anything if no selected lesson
  if (!selectedLesson) return null;

  return (
    <ReactNativeModal
      // onBackdropPress={handleCloseModal}
      isVisible={isModalVisible}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
          <CrossCircle size={35} color="white" />
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.Primary} />
            <Text style={styles.loadingText}>Loading quiz...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {quizResults?.total
              ? renderResults()
              : quizStarted
              ? renderQuestion()
              : renderStartScreen()}
          </ScrollView>
        )}
      </View>
    </ReactNativeModal>
  );
};

export default ProgramQuizModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: Colors.Background_color,
      width: '90%',
      maxHeight: '80%',
      borderRadius: 15,
      padding: gGap(16),
      position: 'relative',
    },
    closeButton: {
      backgroundColor: '#F97066',
      position: 'absolute',
      top: gGap(-15),
      right: gGap(-15),
      borderRadius: 100,
      zIndex: 10,
    },
    scrollContent: {
      flexGrow: 1,
      paddingVertical: gGap(10),
    },
    loadingContainer: {
      padding: gGap(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: gGap(10),
      fontSize: 16,
      color: Colors.BodyText,
    },

    // Start screen styles
    startContainer: {
      alignItems: 'center',
      padding: gGap(20),
    },
    quizTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: gGap(20),
      textAlign: 'center',
    },
    quizInstructions: {
      fontSize: 16,
      color: Colors.BodyText,
      textAlign: 'center',
      marginBottom: gGap(40),
      lineHeight: 22,
    },
    startButton: {
      backgroundColor: Colors.Primary,
      paddingVertical: gGap(12),
      paddingHorizontal: gGap(24),
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    startButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },

    // Question styles
    questionContainer: {
      padding: gGap(10),
    },
    timerAndNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: gGap(20),
    },
    timerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF5722',
    },
    questionCounter: {
      fontSize: 14,
      color: Colors.BodyText,
    },
    questionText: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.Heading,
      marginBottom: gGap(24),
      lineHeight: 24,
    },
    optionsContainer: {
      marginBottom: gGap(20),
    },
    optionButton: {
      backgroundColor: Colors.Foreground,
      padding: gGap(12),
      borderRadius: 8,
      marginBottom: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    optionText: {
      fontSize: 16,
      color: Colors.Heading,
    },
    selectedOption: {
      backgroundColor: Colors.PrimaryOpacityColor,
      borderColor: Colors.Primary,
    },
    selectedOptionText: {
      color: Colors.BodyText,
      fontWeight: '600',
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    navButton: {
      backgroundColor: Colors.Primary,
      paddingVertical: gGap(10),
      paddingHorizontal: gGap(20),
      borderRadius: 8,
      width: '45%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    disabledButton: {
      opacity: 0.5,
    },
    navButtonText: {
      color: Colors.PrimaryButtonTextColor,
      fontSize: 16,
      fontWeight: '500',
    },
    submitButton: {
      backgroundColor: Colors.Primary,
      paddingVertical: gGap(10),
      paddingHorizontal: gGap(20),
      borderRadius: 8,
      width: '45%',
      alignItems: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },

    // Results styles
    resultsContainer: {
      alignItems: 'center',
      padding: gGap(20),
      backgroundColor: Colors.Background_color,
    },
    resultsTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: gGap(24),
    },
    scoreText: {
      fontSize: 18,
      color: Colors.BodyText,
      marginBottom: gGap(10),
    },
    percentageText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: gGap(16),
    },
    passingStatus: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: gGap(30),
    },
    passed: {
      color: '#4CAF50',
    },
    failed: {
      color: '#F44336',
    },
    restartButton: {
      backgroundColor: Colors.Primary,
      paddingVertical: gGap(12),
      paddingHorizontal: gGap(24),
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noResultsText: {
      fontSize: 16,
      color: Colors.BodyText,
      marginVertical: gGap(20),
    },
  });
