import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import Divider from '../SharedComponent/Divider';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

const DocumentsProgress = ({myUploadedDocuments}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.HeadingText}>Documents</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Presentation')}>
          <ArrowTopRight />
        </TouchableOpacity>
      </View>
      <Divider marginTop={1} marginBottom={1} />
    </View>
  );
};

export default DocumentsProgress;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 10,
      width: '100%',
    },
    headerContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
  });
