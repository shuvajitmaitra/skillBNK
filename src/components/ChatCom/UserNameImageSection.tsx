import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Images from '../../constants/Images';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useSelector} from 'react-redux';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';

const UserNameImageSection = ({
  image = '',
  name = 'N/A',
  handleCreateChat = () => {},
}) => {
  const {singleChat} = useSelector((state: RootState) => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      disabled={!singleChat?.isChannel}
      onPress={handleCreateChat}
      style={styles.container}>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

export default UserNameImageSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    name: {
      //   alignSelf: 'flex-end',
      color: Colors.Heading,
      // fontWeight: "500",
      fontFamily: CustomFonts.MEDIUM,
      // marginBottom: responsiveScreenHeight(1),
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 20,
      marginTop: 10,
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 45,
      // backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
    },
  });
