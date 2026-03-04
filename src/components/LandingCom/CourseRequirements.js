import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Markdown from 'react-native-markdown-display';
import {RegularFonts} from '../../constants/Fonts';

const CourseRequirements = ({requirements}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    !requirements !== '' && (
      <View style={styles.container}>
        <Text style={styles.requirementsTitle}>Requirements</Text>
        {/* <Text style={styles.requirementsText}>{requirements}</Text> */}
        <Markdown style={styles.markdownStyle}>{requirements}</Markdown>
      </View>
    )
  );
};

export default CourseRequirements;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
      paddingHorizontal: 20,
      paddingVertical: 25,
    },
    requirementsTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
    },
    requirementsText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 5,
      },
      ordered_list: {
        marginVertical: 5,
      },
      list_item: {
        marginVertical: 5,
      },
      body: {
        flex: 1,
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        // marginBottom: responsiveScreenHeight(1.5),
        fontSize: responsiveFontSize(2),
      },
      heading1: {
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
      },
      blockquote: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    },
  });
