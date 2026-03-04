import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ContentBody = ({item, chapters}) => {
  // console.log("chapters", JSON.stringify(chapters?.myCourse?.parent, null, 1));
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [openLesson, setOpenLesson] = useState(null);

  const handleOpenDescription = lessonId => {
    setOpenLesson(openLesson === lessonId ? null : lessonId);
  };

  // console.log("item", JSON.stringify(item, null, 1));

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordion}
        disabled={true || !item.isPreview}
        onPress={() => handleOpenDescription(item._id)}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {item.type === 'lesson' ? (
            <AntDesign name="play" size={24} color={Colors.BodyText} />
          ) : (
            <FontAwesome name="lock" size={24} color={Colors.BodyText} />
          )}
          {/* {!item?.isPreview && item.type !== "lesson" ? (
            <FontAwesome name="lock" size={24} color={Colors.BodyText} />
          ) : item.type === "chapter" ? (
            <Feather name="chevron-down" size={24} color={Colors.Heading} />
          ) : (
            <AntDesign name="play" size={24} color={Colors.BodyText} />
          )} */}

          {/* <MaterialIcons name="lock" size={24} color={Colors.Heading} /> */}
          <Text style={styles.accordionTitle}>
            {item?.chapter?.name || item?.lesson?.title || 'Unavailable'}
          </Text>
        </View>
        <Text style={styles.subTitle}>15 chapters • 1h 30m</Text>
      </TouchableOpacity>
      {openLesson === item._id && (
        <View style={styles.lessonList}>
          <Text style={styles.lessonText}>For testing</Text>
        </View>
      )}
    </View>
  );
};

export default ContentBody;

const getStyles = Colors =>
  StyleSheet.create({
    accordionContainer: {
      marginBottom: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    lessonText: {
      color: Colors.BodyText,
      padding: 15,
      fontFamily: CustomFonts.REGULAR,
      lineHeight: responsiveHeight(2.5),
    },
    lessonList: {
      backgroundColor: Colors.Foreground,
    },
    subTitle: {color: Colors.BodyText},
    accordionTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(1.7),
      flex: 1,
      flexWrap: 'wrap',
    },
    accordion: {
      backgroundColor: Colors.Foreground,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      gap: 5,
      justifyContent: 'space-between',
    },
  });
