import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';

const MessageBar = ({title, count, limit}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <Text style={styles.headerText}>
          <Text style={styles.headerBold}>{count}</Text> out of{' '}
          <Text style={styles.headerBold}>{limit}</Text>
        </Text>
      </View>
      <View style={styles.progress}>
        <View
          style={{
            ...styles.progressBar,
            width: `${(count / limit) * 100}%`,
            backgroundColor:
              (title === 'Read' && Colors.Primary) ||
              (title === 'Unread' && '#00d7c4') ||
              (title === 'Unread Chat Crowd' && Colors.Red) ||
              (title === 'Unread Direct Message' && '#00bc8b') ||
              (title === 'Pinned Message' && '#FF9900') ||
              Colors.Primary,
          }}
        />
      </View>
    </View>
  );
};

export default MessageBar;

const getStyles = Colors =>
  StyleSheet.create({
    progressBar: {
      height: '100%',
      borderRadius: 100,
    },
    headerBold: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    progress: {
      width: '100%',
      height: 15,
      borderRadius: 100,
      backgroundColor: Colors.Background_color,
    },
    container: {
      width: '100%',
    },
    headerText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: responsiveScreenHeight(1),
    },
  });
