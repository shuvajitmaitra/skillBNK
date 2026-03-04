import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import {useTheme} from '../context/ThemeContext';
import ColorDot from './SharedComponent/ColorDot';
import CustomFonts from '../constants/CustomFonts';
import {TColors} from '../types';

const DotComponent = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <>
      <View style={styles.dotContainer}>
        <View
          // onPress={() => handleButtonPress("accepted")}
          style={styles.dot}>
          <ColorDot background={'#629dcc'} />
          <Text style={[styles.text]}>Show N Tell</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("pending")}
          style={styles.dot}>
          <ColorDot background={'#f59f9f'} />
          <Text style={[styles.text]}>Mock Interview</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("proposedNewTime")}
          style={styles.dot}>
          <ColorDot background={'#379793'} />
          <Text style={[styles.text]}>Orientation Meeting</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("denied")}
          style={styles.dot}>
          <ColorDot background={'#ff6502'} />
          <Text style={[styles.text]}>Sync up call</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}>
          <ColorDot background={'#f8a579'} />
          <Text style={[styles.text]}>Technical Interview</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}>
          <ColorDot background={'#0091b9'} />
          <Text style={[styles.text]}>Behavioral Interview</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}>
          <ColorDot background={'#7ccc84'} />
          <Text style={[styles.text]}>Review Meeting</Text>
        </View>
        <View
          // onPress={() => handleButtonPress("finished")}
          style={styles.dot}>
          <ColorDot background={Colors.OthersColor} />
          <Text style={[styles.text]}>Others</Text>
        </View>
      </View>
      {/* <View style={styles.dotCon}>
      </View> */}
    </>
  );
};

export default DotComponent;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    text: {
      color: Colors.BodyText,
      // textDecorationLine: "underline",
      fontFamily: CustomFonts.REGULAR,
    },
    dotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: "space-between",
      gap: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
      marginTop: 10,
      flexWrap: 'wrap',
      backgroundColor: Colors.Foreground,
      // borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingBottom: 10,
      overflow: 'hidden',
    },
    dotCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(11),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
    },
    dot: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
