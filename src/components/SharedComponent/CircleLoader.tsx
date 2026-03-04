import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, Easing} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const CircleLoader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    );
    spinAnimation.start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          transform: [{rotate: spin}],
        },
      ]}
    />
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    circle: {
      width: 14,
      height: 14,
      borderWidth: 2,
      borderColor: Colors.PureWhite,
      borderTopColor: 'transparent',
      borderRadius: 100,
    },
  });

export default CircleLoader;
