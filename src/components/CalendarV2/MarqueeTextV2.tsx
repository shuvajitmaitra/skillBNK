import React, {useRef, useEffect, useState} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';

const MarqueeText = ({text = 'Bootcampshub', duration = 10000}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const [textWidth, setTextWidth] = useState(0);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  useEffect(() => {
    const startMarquee = () => {
      animatedValue.setValue(screenWidth);

      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: -textWidth,
          duration: (duration * textWidth) / screenWidth, // Adjust duration based on text width
          useNativeDriver: true,
        }),
      ).start();
    };

    if (textWidth > 0) {
      startMarquee();
    }
  }, [animatedValue, screenWidth, duration, textWidth]);

  return (
    <View style={styles.container}>
      <Animated.Text
        onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
        style={[
          styles.marqueeText,
          {
            transform: [{translateX: animatedValue}],
          },
        ]}>
        {text}
      </Animated.Text>
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      height: 30, // Adjust height based on your needs
      backgroundColor: Colors.LightRed, // Optional: background color for better visibility
      justifyContent: 'center',
      width: '150%',
    },
    marqueeText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: 'red',
    },
  });

export default MarqueeText;
