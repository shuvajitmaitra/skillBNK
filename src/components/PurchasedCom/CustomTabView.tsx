import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import MyCourses from './MyCourses';
import {TColors} from '../../types';

const CustomTabView = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [status, setStatus] = useState('Courses');
  const tabLists = [
    {
      status: 'Courses',
    },
    // {
    //   status: "Assessments",
    // },
  ];

  const handleTabStatus = (stat: string) => {
    setStatus(stat);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.scrollViewContainer}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <View style={styles.tabContainer}>
            {tabLists.map((tab, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTabStatus(tab.status)}
                style={[
                  {
                    paddingHorizontal: responsiveScreenWidth(1.9),
                  },
                  status === tab.status && styles.tabActiveButton,
                ]}>
                <Text
                  style={[
                    {
                      fontFamily: CustomFonts.MEDIUM,
                      fontSize: responsiveScreenFontSize(1.7),
                      color: Colors.Primary,
                    },
                    status === tab.status && styles.tabActiveText,
                  ]}>
                  {tab.status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabViewContainer}>
        {status === 'Courses' ? <MyCourses /> : null}
        {/* {status === "Assessments" ? <AssessmentScreen /> : null} */}
      </ScrollView>
    </View>
  );
};

export default CustomTabView;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    tabViewContainer: {
      // maxHeight: responsiveScreenHeight(70),
      // marginBottom: responsiveScreenHeight(23),
    },
    scrollViewContainer: {
      backgroundColor: Colors.Foreground,
      borderRadius: 100,
      marginBottom: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    tabActiveButton: {
      backgroundColor: Colors.Primary,
      paddingVertical: responsiveScreenWidth(2.5),
      borderRadius: 100,
    },
    tabActiveText: {
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    programNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      paddingBottom: responsiveScreenHeight(1.5),
    },
    mainContainer: {
      //   paddingVertical: responsiveScreenHeight(1.3),
      //   paddingHorizontal: responsiveScreenWidth(5),
      flex: 1,
    },
  });
