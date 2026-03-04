import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {fontSizes, gGap} from '../../constants/Sizes';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import {
  FeatherIcon,
  FontAwesome5Icon,
  SimpleLineIcon,
} from '../../constants/Icons';
import ConversationHistoryModal from './ConversationHistoryModal';
import AddNoteModal from './AddNoteModal';

type props = {
  onNextPress: () => void;
};

const InterviewInstructionSection = ({onNextPress}: props) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {singleInterview} = useSelector((state: RootState) => state.interview);
  const [conversationModalVisible, setConversationModalVisible] =
    useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);

  if (!singleInterview) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <NoDataAvailable />
      </View>
    );
  }

  const interview = singleInterview?.interview;
  const submission = singleInterview?.submission;
  const conversations = singleInterview?.conversations;

  const interviewData = {
    duration: interview?.aiData?.duration + ' ' + 'minutes',
    status:
      interview?.submission?.length === 0
        ? 'Started'
        : submission?._id
        ? 'Completed'
        : 'Not Started',
    complexity: interview?.aiData?.complexity || 'Hard',
    title: interview?.name || 'Admin',
    score: submission?._id ? submission.mark : 0,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Header */}
      <View style={styles.statusHeader}>
        <View style={[styles.statusItem, {backgroundColor: '#0736D1'}]}>
          <Text style={styles.statusIcon}>
            <FeatherIcon name="clock" size={25} color={Colors.PureWhite} />
          </Text>
          <Text style={styles.statusLabel}>DURATION</Text>
          <Text style={styles.statusValue}>{interviewData.duration}</Text>
        </View>

        <View style={[styles.statusItem, {backgroundColor: '#00B377'}]}>
          <Text style={styles.statusIcon}>
            <FeatherIcon
              name="check-circle"
              size={25}
              color={Colors.PureWhite}
            />
          </Text>
          <Text style={styles.statusLabel}>STATUS</Text>
          <Text style={styles.statusValue}>{interviewData.status}</Text>
        </View>

        <View style={[styles.statusItem, {backgroundColor: '#ff5d00'}]}>
          <Text style={styles.statusIcon}>
            <SimpleLineIcon name="fire" size={25} color={Colors.PureWhite} />
          </Text>
          <Text style={styles.statusLabel}>COMPLEXITY</Text>
          <Text style={styles.statusValue}>{interviewData.complexity}</Text>
        </View>
        {submission?._id && (
          <View style={[styles.statusItem, {backgroundColor: '#9f2cff'}]}>
            <Text style={styles.statusIcon}>
              <FeatherIcon name="hash" size={25} color={Colors.PureWhite} />
            </Text>
            <Text style={styles.statusLabel}>SCORE</Text>
            <Text style={styles.statusValue}>{interviewData.score}/100</Text>
          </View>
        )}
        {submission?._id && (
          <View style={[styles.statusItem, {backgroundColor: '#5e5aff'}]}>
            <Text style={styles.statusIcon}>
              <FeatherIcon name="calendar" size={25} color={Colors.PureWhite} />
            </Text>
            <Text style={styles.statusLabel}>STARTED</Text>
            <Text style={styles.statusValue}>
              {moment(submission.createdAt)
                .subtract(interview.aiData?.duration, 'minutes')
                .format('LLL')}
            </Text>
          </View>
        )}
        {submission?._id && (
          <View style={[styles.statusItem, {backgroundColor: '#00ad9c'}]}>
            <Text style={styles.statusIcon}>
              <FontAwesome5Icon
                name="check-circle"
                size={25}
                color={Colors.PureWhite}
              />
            </Text>
            <Text style={styles.statusLabel}>COMPLETED</Text>
            <Text style={styles.statusValue}>
              {moment(submission.createdAt).format('LLL')}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.interviewTitle}>
        Interview title:{' '}
        <Text style={{color: Colors.BodyText}}>{interviewData.title}</Text>
      </Text>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Instructions Card */}
        {submission?._id ? (
          <View style={styles.con}>
            <FeatherIcon
              name="clock"
              size={60}
              color="#ff5d00"
              style={styles.icon}
            />
            <Text style={styles.title}>Pending Review</Text>
            <Text style={styles.description}>
              Your interview performance is currently being evaluated. Results
              and feedback will be available once the review process is
              complete.
            </Text>
            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>
                Excellence is never an accident. It is always the result of high
                intention, sincere effort, and intelligent execution.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.instructionsCard}>
            <Text style={styles.cardTitle}>Instructions & Rules</Text>

            <Text style={styles.importantText}>
              Important: Once you start the interview, you cannot stop it until
              completion.
            </Text>

            <Text style={styles.descriptionText}>
              The interview will be submitted automatically if not completed
              within the allocated time.
            </Text>

            <Text style={styles.sectionTitle}>How It Works:</Text>

            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                AI will ask a series of questions
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                You need to answer each question verbally
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Using a microphone is recommended for better quality
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Ensure you complete the interview within the specified time
              </Text>
            </View>

            {/* Audio Check Banner */}
            <View style={styles.audioCheckBanner}>
              <Text style={styles.audioIcon}>🎤</Text>
              <Text style={styles.audioIcon}>🔊</Text>
              <Text style={styles.audioCheckText}>
                Make sure your microphone and speakers are working properly
              </Text>
            </View>
          </View>
        )}

        {/* Start Button */}
        {!submission?._id && (
          <TouchableOpacity
            onPress={() => {
              onNextPress();
            }}
            style={styles.startButton}>
            <Text style={styles.playIcon}>▶</Text>
            <Text style={styles.startButtonText}>Start Interview</Text>
          </TouchableOpacity>
        )}
      </View>
      {submission?._id && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: gGap(10),
            backgroundColor: Colors.Foreground,

            padding: gGap(10),
            marginHorizontal: gGap(10),
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: gGap(10),
            marginBottom: gGap(10),
          }}>
          <TouchableOpacity
            onPress={() => {
              setConversationModalVisible(!conversationModalVisible);
            }}
            style={styles.startButton}>
            <FeatherIcon name="clock" size={20} color={Colors.PureWhite} />
            <Text style={styles.startButtonText}>View History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setNoteModalVisible(!noteModalVisible);
            }}
            style={styles.startButton}>
            <FeatherIcon name="edit" size={20} color={Colors.PureWhite} />
            <Text style={styles.startButtonText}>Add Notes</Text>
          </TouchableOpacity>
          {conversationModalVisible && (
            <ConversationHistoryModal
              isVisible={conversationModalVisible}
              onClose={() => {
                setConversationModalVisible(!conversationModalVisible);
              }}
              conversations={conversations}
            />
          )}
          {noteModalVisible && (
            <AddNoteModal
              isVisible={noteModalVisible}
              handleAddNote={() => {
                console.log('first');
              }}
              onClose={() => {
                setNoteModalVisible(!noteModalVisible);
              }}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default InterviewInstructionSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    con: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: gGap(10),
    },
    icon: {
      marginVertical: gGap(10),
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      color: Colors.BodyText,
      textAlign: 'center',
      marginBottom: 15,
      fontFamily: CustomFonts.MEDIUM,
    },
    quoteContainer: {
      backgroundColor: '#ff5d00',
      padding: 10,
      borderRadius: 5,
      width: '100%',
    },
    quote: {
      fontSize: 14,
      color: '#FFF',
      textAlign: 'center',
      fontStyle: 'italic',
    },

    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    statusHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: gGap(10),
      backgroundColor: Colors.Foreground,
      margin: gGap(5),
      marginHorizontal: gGap(10),
      padding: gGap(10),
      borderRadius: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    statusItem: {
      alignItems: 'center',
      backgroundColor: Colors.Primary + '50',
      padding: gGap(10),
      borderRadius: gGap(10),
      minWidth: gGap(100),
      flexGrow: 1,
    },
    statusIcon: {
      fontSize: gGap(20),
      marginBottom: gGap(4),
    },
    statusLabel: {
      fontSize: gGap(10),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.PureWhite,
      fontWeight: '500',
      marginBottom: gGap(2),
      letterSpacing: 0.5,
    },
    statusValue: {
      fontSize: fontSizes.body,
      color: '#FFFFFF',
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    mainContent: {
      flex: 1,
      backgroundColor: Colors.Foreground,
      margin: gGap(10),
      marginTop: gGap(0),
      borderRadius: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    interviewTitle: {
      fontSize: fontSizes.heading,
      color: Colors.Heading,
      flex: 1,
      fontFamily: CustomFonts.SEMI_BOLD,
      marginBottom: gGap(10),
      paddingHorizontal: gGap(10),
    },
    instructionsCard: {
      backgroundColor: Colors.Background_color, // Darker card background
      borderRadius: gGap(10),
      padding: gGap(10),
      marginBottom: gGap(10),
    },
    cardTitle: {
      fontSize: gGap(18),
      color: Colors.Heading,
      fontWeight: '600',
      marginBottom: gGap(10),
      textAlign: 'center',
    },
    importantText: {
      fontSize: gGap(14),
      color: Colors.WarningColor, // Orange/yellow color for important text
      marginBottom: gGap(10),
      fontFamily: CustomFonts.REGULAR,
    },
    descriptionText: {
      fontSize: gGap(14),
      color: Colors.BodyText,
      marginBottom: gGap(10),
      fontFamily: CustomFonts.REGULAR,
    },
    sectionTitle: {
      fontSize: gGap(14),
      color: Colors.Heading,
      fontWeight: '600',
      marginBottom: gGap(5),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    bulletPoint: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: gGap(5),
    },
    bullet: {
      fontSize: gGap(14),
      color: Colors.BodyText,
      marginRight: gGap(8),
      marginTop: gGap(2),
    },
    bulletText: {
      fontSize: gGap(14),
      color: Colors.BodyText,
      flex: 1,
    },
    audioCheckBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Primary + '80', // Blue background
      borderRadius: gGap(8),
      padding: gGap(12),
      marginTop: gGap(16),
    },
    audioIcon: {
      fontSize: gGap(16),
      marginRight: gGap(8),
    },
    audioCheckText: {
      fontSize: gGap(13),
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      lineHeight: gGap(18),
    },
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      borderRadius: gGap(8),
      paddingVertical: gGap(10),
      flex: 1,
      gap: gGap(5),
    },
    playIcon: {
      fontSize: gGap(16),
      color: '#FFFFFF',
      marginRight: gGap(8),
    },
    startButtonText: {
      fontSize: gGap(16),
      color: '#FFFFFF',
      fontFamily: CustomFonts.MEDIUM,
    },
  });
