import {Image, Keyboard, Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import Images from '../../constants/Images';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const EmptyMessageContainer = ({
  chat,
}: {
  chat: {
    isChannel: boolean;
    avatar?: string;
    name?: string;
    otherUser?: {fullName: string; profilePicture: string};
  };
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.ListEmptyComponent}>
      <Image
        style={styles.profileImage}
        source={
          chat?.isChannel
            ? chat?.avatar
              ? {uri: chat?.avatar}
              : Images.DEFAULT_IMAGE
            : chat?.otherUser?.profilePicture
            ? {uri: chat?.otherUser.profilePicture}
            : Images.DEFAULT_IMAGE
        }
      />
      <Text style={styles.headingText}>
        This is the very beginning of the{' '}
        {chat?.isChannel
          ? `${chat?.name} channel`
          : `chat with ${chat?.otherUser?.fullName}`}
      </Text>
      <Text style={styles.noMessageText}>No message found! </Text>
    </Pressable>
  );
};

export default EmptyMessageContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    profileImage: {
      borderRadius: 100,
      marginBottom: 10,
      height: 50,
      width: 50,
    },
    headingText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: RegularFonts.HR,
      textAlign: 'center',
    },
    noMessageText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: RegularFonts.HL,
      textAlign: 'center',
      paddingTop: 10,
    },
    ListEmptyComponent: {
      height: responsiveScreenHeight(60),
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'red',
      width: '100%',
      alignSelf: 'center',
      paddingHorizontal: 40,
    },
  });
