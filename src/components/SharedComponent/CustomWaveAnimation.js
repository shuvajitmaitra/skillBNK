import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';

const _color = '#72cf5a';
const _size = 100;

const Ring = ({delay}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(4, {
          duration: 2000,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, {
          duration: 2000,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      ),
    );
  }, [delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.dot, animatedStyle]}
    />
  );
};

export function CustomWaveAnimation() {
  return (
    // <View
    //   style={{
    //     // flex: 1,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     backgroundColor: "transparent",
    //   }}
    // >
    <View style={[styles.dot, styles.center]}>
      {[0, 400, 800, 1600, 3200, 6400].map((delay, index) => (
        <Ring key={index} delay={delay} />
      ))}
      {/* <Feather name="phone-outgoing" size={32} color="red" /> */}
    </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: _size,
    height: _size,
    borderRadius: _size / 2,
    backgroundColor: _color,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomWaveAnimation;
