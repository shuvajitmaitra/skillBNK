import React, {useCallback} from 'react';
import {StyleSheet, Text} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';

const MyAnimatedSection = () => {
  const appear = useSharedValue(1);

  // ✅ run when coming from another route (screen focused)
  useFocusEffect(
    useCallback(() => {
      appear.value = 0; // reset
      appear.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });

      // optional cleanup when leaving screen
      return () => {
        appear.value = 0;
      };
    }, [appear]),
  );

  const animStyle = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{scale: 0.9 + 0.1 * appear.value}],
  }));

  return (
    <Animated.View sharedTransitionTag="test" style={[styles.box, animStyle]}>
      <Text>Animated on Focus</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {padding: 16, borderRadius: 12},
});

export default MyAnimatedSection;
