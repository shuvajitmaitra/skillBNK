import React, {useRef, useEffect} from 'react';
import {Pressable, Animated} from 'react-native';

interface AnimatedSwitchV1Props {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
  testID?: string;
}

const AnimatedSwitchV1: React.FC<AnimatedSwitchV1Props> = ({
  value,
  onValueChange,
  size = 'small',
  activeColor = '#f97316', // orange-500
  inactiveColor = '#9ca3af', // gray-400
  disabled = false,
  testID,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Size configurations
  const sizeConfig = {
    small: {
      width: 40,
      height: 20,
      thumbSize: 8,
      padding: 3,
    },
    medium: {
      width: 50,
      height: 24,
      thumbSize: 10,
      padding: 3,
    },
    large: {
      width: 60,
      height: 28,
      thumbSize: 12,
      padding: 3,
    },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.width - config.thumbSize - config.padding * 6],
  });

  const thumbScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <Pressable onPress={handlePress} disabled={disabled} testID={testID}>
      <Animated.View
        style={{
          width: config.width,
          height: config.height,
          borderWidth: 4,
          padding: 5,
          borderColor: trackColor,
          borderRadius: config.height / 2,
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            width: config.thumbSize,
            height: config.thumbSize,
            backgroundColor: trackColor,
            borderRadius: config.thumbSize / 2,
            transform: [{translateX: thumbTranslateX}, {scale: thumbScale}],
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedSwitchV1;
