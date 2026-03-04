import {Animated, Easing} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';

type AnimatedCardProps = {
  children: React.ReactNode;
  index: number;
};

const AnimatedStatCard = ({children, index}: AnimatedCardProps) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 120, // 👈 stagger effect
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        delay: index * 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{translateY}, {scale}],
        opacity,
      }}>
      {children}
    </Animated.View>
  );
};

export default memo(AnimatedStatCard);
