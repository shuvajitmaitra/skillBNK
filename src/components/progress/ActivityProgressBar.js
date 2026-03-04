import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';

const ActivityProgressBar = ({item}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>{item?.title}</Text>
          <TouchableOpacity
            onPress={() => {
              item.func();
            }}>
            <ArrowTopRight
              backgroundColor={Colors.PrimaryOpacityColor}
              color={Colors.Primary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>
          <Text style={styles.headerBold}>{item?.count}</Text> out of{' '}
          <Text style={styles.headerBold}>{item?.limit}</Text>
        </Text>
      </View>
      <View style={styles.progress}>
        <View
          style={{
            ...styles.progressBar,
            width: `${
              item?.count > 100 ? 100 : item?.count ? item?.count : 0
            }%`,
            backgroundColor:
              (item.title === 'Show N Tell' && Colors.Primary) ||
              (item.title === 'Mock Interview' && '#00d7c4') ||
              (item.title === 'My Uploaded Documents' && Colors.Red) ||
              (item.title === 'Community' && '#00bc8b') ||
              Colors.Primary,
          }}
        />
      </View>
    </View>
  );
};

export default ActivityProgressBar;

const getStyles = Colors =>
  StyleSheet.create({
    progressBar: {
      height: '100%',
      borderRadius: 100,
    },
    headerBold: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    progress: {
      width: '100%',
      height: 15,
      borderRadius: 100,
      //   marginTop: responsiveScreenHeight(1),
      backgroundColor: Colors.Background_color,
    },
    container: {
      width: '100%',
      //   gap: 10,
      //   backgroundColor: "red",
      marginBottom: 10,
    },
    headerText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: responsiveScreenHeight(1),
      //   marginTop: responsiveScreenHeight(1),
    },
  });
