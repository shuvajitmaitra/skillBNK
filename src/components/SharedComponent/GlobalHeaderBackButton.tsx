import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

const GlobalHeaderBackButton = ({HText = ''}: {HText: string}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButtonContainer}>
        <ArrowLeft />
      </TouchableOpacity>
      <Text style={styles.headerText}>{HText}</Text>
    </View>
  );
};

export default GlobalHeaderBackButton;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    headerText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.4),
      fontWeight: 'bold',
    },
    HeaderContainer: {
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      paddingBottom: 10,
    },
    backButtonContainer: {
      // backgroundColor: Colors.ForegroundOpacityColor,
      padding: 7,
      paddingRight: 0,
      // borderRadius: 1000,
      // borderWidth: 1,
      // overflow: 'hidden',
      // borderColor: Colors.BorderColor,
    },
  });
