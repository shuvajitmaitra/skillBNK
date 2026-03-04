import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {RegularFonts} from '../../constants/Fonts';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';

const UserNameDateContainer = ({name, date, image, handleCreateChat}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCreateChat}>
        <Image
          onPress={handleCreateChat}
          resizeMode="contain"
          source={
            image
              ? {
                  uri: image,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.userImg}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>{moment(date).format('h:mm A')}</Text>
    </View>
  );
};

export default UserNameDateContainer;

const getStyles = Colors =>
  StyleSheet.create({
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 100,
      // backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 10,
      alignItems: 'center',
    },
    name: {
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    date: {
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
  });
