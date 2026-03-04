import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import RNModal from '../SharedComponent/RNModal';
import {TColors, TConversation} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import AudioMessage from '../ChatCom/AudioMessage';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {fontSizes, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';

const ConversationHistoryModal = ({
  isVisible,
  onClose,
  conversations,
}: {
  isVisible: boolean;
  onClose: () => void;
  conversations: TConversation[];
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <RNModal isVisible={isVisible} modalType="fullScreen">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ai Interview Conversations</Text>
        </View>
        <View style={{flex: 1}}>
          <ScrollView>
            {conversations.map(item => (
              <ConversationItem
                transcript={item.aiConversationData?.transcript?.trim() || ''}
                audioUrl={item?.aiConversationData?.audioUrl || ''}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

export default ConversationHistoryModal;

const ConversationItem = ({
  transcript,
  audioUrl,
}: {
  transcript?: string;
  audioUrl?: string;
}) => {
  console.log('transcript', JSON.stringify(transcript, null, 2));
  console.log('audioUrl', JSON.stringify(audioUrl, null, 2));
  const Colors = useTheme();

  const styles = getStyles(Colors);
  return (
    <View style={styles.conversationItemContainer}>
      {transcript && <Text style={styles.itemText}>{transcript}</Text>}
      {audioUrl && (
        <AudioMessage background={Colors.Primary + '30'} audioUrl={audioUrl} />
      )}
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {backgroundColor: Colors.Background_color, flex: 1},
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
      marginBottom: gGap(10),
    },
    headerTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.heading,
      color: Colors.Heading,
    },
    conversationItemContainer: {
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderRadius: gGap(10),
      borderColor: Colors.BorderColor,
      marginBottom: gGap(10),
      padding: gGap(10),
      gap: 10,
    },
    itemText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      color: Colors.Heading,
    },
  });
