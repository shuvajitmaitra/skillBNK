import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';
import {TColors} from '../../types';

const AIcon = AntDesign as any;

// Define interfaces for the props
interface Instructor {
  image?: string;
  name: string;
}

interface Course {
  title: string;
  instructor?: Instructor;
}

interface Session {
  name: string;
}

interface Enrollment {
  session?: Session;
}

interface MyProgram {
  enrollment?: Enrollment;
}

type ProgramDetailsCardProps = {
  course: Course;
  myprogram: MyProgram;
};

export default function ProgramDetailsCard({
  course,
  myprogram,
}: ProgramDetailsCardProps) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.backgroundImageContainer}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/ApplicationImage/Background.png')}
      />
      <Text style={styles.title}>{course?.title}</Text>
      <View style={styles.sessionContainer}>
        <Text style={styles.sessionText}>Session:</Text>
        <Text style={styles.sessionDate}>
          {myprogram?.enrollment?.session?.name
            ? myprogram?.enrollment?.session?.name
            : ''}
        </Text>
        <Text style={styles.rating}>0.0</Text>
        <AIcon name="star" style={styles.starIcon} />
        <Text style={styles.sessionDate}>(0)</Text>
      </View>
      <View style={[styles.sessionContainer, styles.ExtraMergin]}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              course?.instructor?.image
                ? {uri: course?.instructor?.image}
                : Images.DEFAULT_IMAGE
            }
            style={styles.image}
          />
        </View>
        <Text style={[styles.sessionDate, styles.instructor]}>Instructor:</Text>
        <Text style={styles.sessionText}>{course?.instructor?.name}</Text>
      </View>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    backgroundImageContainer: {
      width: responsiveScreenWidth(93),
      height: responsiveScreenHeight(19),
      marginTop: responsiveScreenHeight(2),
      alignSelf: 'center',
    },
    backgroundImage: {
      width: responsiveScreenWidth(93),
      height: responsiveScreenHeight(19),
      borderRadius: 10,
      resizeMode: 'cover',
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Foreground,
      width: responsiveScreenWidth(75),
      position: 'absolute',
      top: responsiveScreenHeight(2),
      left: responsiveScreenWidth(5),
    },
    sessionContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(1),
      alignItems: 'center',
      position: 'absolute',
      top: responsiveScreenHeight(7),
      left: responsiveScreenWidth(5),
    },
    ExtraMergin: {
      top: responsiveScreenHeight(12),
    },
    sessionText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Foreground,
    },
    sessionDate: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Foreground,
      marginLeft: 6,
    },
    rating: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Foreground,
      marginLeft: 10,
    },
    starIcon: {
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.StarColor,
      marginLeft: 6,
    },
    profileImageContainer: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(12),
    },
    image: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(12),
    },
    instructor: {
      marginRight: 8,
      marginLeft: 8,
    },
  });
