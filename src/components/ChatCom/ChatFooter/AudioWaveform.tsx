import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const NUM_BARS = 30;
const BAR_WIDTH = 5;
const BAR_MAX_HEIGHT = 40;
const BAR_MARGIN = 3;
const ANIMATION_DURATION = 500;

const AudioWaveform = () => {
  const styles = getStyles();
  const animatedValues = useRef(
    Array.from({length: NUM_BARS}, () => new Animated.Value(1)),
  ).current;

  useEffect(() => {
    const animateBar = (animatedValue: Animated.Value) => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.5,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.5,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => animateBar(animatedValue));
    };

    animatedValues.forEach((animatedValue, index) => {
      setTimeout(() => {
        animateBar(animatedValue);
      }, index * 100);
    });

    return () => {
      animatedValues.forEach(animatedValue => animatedValue.stopAnimation());
    };
  }, [animatedValues]);

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [{scaleY: animatedValue}],
            },
          ]}
        />
      ))}
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center', // Center vertically for symmetrical animation
      height: BAR_MAX_HEIGHT,
      justifyContent: 'space-between',
      width: NUM_BARS * (BAR_WIDTH + BAR_MARGIN),
    },
    bar: {
      width: BAR_WIDTH,
      backgroundColor: 'rgba(153,0,0,0.8)',
      marginHorizontal: BAR_MARGIN / 2,
      borderRadius: BAR_WIDTH / 2,
      height: BAR_MAX_HEIGHT / 2, // Set initial height for scaleY to expand both up and down
    },
  });

export default AudioWaveform;
