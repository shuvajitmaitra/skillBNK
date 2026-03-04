import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

// Create an animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Define the component props interface
interface CircularProgressProps {
  activeColor?: string;
  inActiveColor?: string;
  progress?: number;
  radius?: number;
  strokeWidth?: number;
  textColor?: string;
  duration?: number;
  lineCap?: 'butt' | 'round' | 'square';
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  activeColor = '#4caf50',
  inActiveColor = '#e6e6e6',
  progress = 50,
  radius = 70,
  strokeWidth = 20,
  textColor = '#4caf50',
  duration = 2000,
  lineCap = 'round',
}) => {
  // Calculate the circle's circumference
  const circumference = 2 * Math.PI * radius;

  // Create a shared value for the animated progress
  const animatedProgress = useSharedValue(0);

  // Animate the progress value on component mount or when progress/duration changes
  useEffect(() => {
    animatedProgress.value = withTiming(progress, {duration});
  }, [animatedProgress, progress, duration]);

  // Create animated props for the AnimatedCircle
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value / 100),
  }));

  return (
    <View style={styles.container}>
      <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        {/* Background Circle */}
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={inActiveColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap={lineCap}
          fill="none"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${
            radius + strokeWidth / 2
          })`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Animated.Text
          style={[styles.text, {color: textColor, fontSize: radius / 2}]}>
          {`${Math.round(progress)}%`}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CircularProgress;
