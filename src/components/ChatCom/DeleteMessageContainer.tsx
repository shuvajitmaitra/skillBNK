import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import Images from '../../constants/Images';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {gFontSize} from '../../constants/Sizes';

const DeleteMessageContainer = ({
  time,
  name,
  pic,
  active,
}: {
  time: string | Date;
  name: string;
  pic?: string;
  active: boolean;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <>
      <View style={{flexDirection: 'row', gap: 10}}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={
              pic
                ? {
                    uri: pic,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.userImg}
          />
          {/* Active status indicator */}
          <View
            style={[
              styles.activeStatus,
              {
                backgroundColor: active ? Colors.SuccessColor : Colors.BodyText,
              },
            ]}
          />
        </View>
        <View style={styles.messagesContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.text}>This message has been deleted</Text>
          <Text style={styles.timeText}>
            {moment(time).format('MMM DD, YYYY [at] h:mm A')}
          </Text>
        </View>
      </View>
    </>
  );
};

export default DeleteMessageContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    imageContainer: {
      position: 'relative',
      height: 35,

      width: 35,
      marginTop: 2,
    },
    activeStatus: {
      width: 10,
      height: 10,
      position: 'absolute',
      right: -5,
      bottom: 0,
      borderRadius: 50,
      zIndex: 1,
    },
    name: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 45,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      marginLeft: 5,
    },
    text: {
      color: Colors.Red,
    },
    messagesContainer: {
      backgroundColor: Colors.LightRed,
      padding: 3,
      borderRadius: 10,
      paddingHorizontal: 10,
      width: '60%',
      minWidth: '25%',
      minHeight: 30,
    },
    timeText: {
      color: Colors.Red,
      alignSelf: 'flex-end',
      fontSize: gFontSize(9),
    },
  });
