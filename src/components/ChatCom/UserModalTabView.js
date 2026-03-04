import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import UserModalImageGallary from './UserModalImageGallary';
import UserModalUploadedFile from './UserModalUploadedFile';
import UserModalVoice from './UserModalVoice';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

export const UserModalTabView = ({chat}) => {
  const [status, setStatus] = useState('Images');
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const tabLists = [
    {
      status: 'Images',
    },
    {
      status: 'Files',
    },
    {
      status: 'Voices',
    },
  ];

  const handleTabStatus = status => {
    setStatus(status);
  };

  return (
    <View style={styles.tabViewcontainer}>
      <View style={styles.tabContainer}>
        {tabLists.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabStatus(tab.status)}>
            <Text
              style={[
                {
                  fontFamily: CustomFonts.MEDIUM,
                  fontSize: responsiveScreenFontSize(1.8),
                  color: Colors.BodyText,
                },
                status === tab.status && styles.tabActive,
              ]}>
              {tab.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <View>
        {(status === "Images" && <UserModalImageGallary chat={chat} />) ||
          (status === "Files" && <UserModalUploadedFile chat={chat} />) ||
          (status === "Voices" && <UserModalVoice />)}
      </View> */}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    tabViewcontainer: {
      minHeight: responsiveScreenHeight(10),
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: responsiveScreenWidth(10),
      alignItems: 'center',
      paddingBottom: responsiveScreenHeight(1),
    },
    tabActive: {
      color: Colors.Primary,
      borderBottomColor: Colors.Primary,
      borderBottomWidth: 2,
      paddingVertical: responsiveScreenWidth(1),
    },
  });
