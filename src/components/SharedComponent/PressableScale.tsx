import React, {useCallback, useMemo} from 'react';
import {
  GestureResponderEvent,
  TouchableWithoutFeedbackProps,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';

export interface PressableScaleProps
  extends TouchableWithoutFeedbackProps,
    Partial<Omit<WithSpringConfig, 'mass'>> {
  children: React.ReactNode;
  activeScale?: number;
  weight?: 'light' | 'medium' | 'heavy';
  restSpeedThreshold?: number;
  restDisplacementThreshold?: number;
}

export function PressableScale(props: PressableScaleProps): React.ReactElement {
  const {
    activeScale = 0.95,
    weight = 'heavy',
    damping = 15,
    stiffness = 150,
    overshootClamping = true,
    restSpeedThreshold = 0.001,
    restDisplacementThreshold = 0.001,
    style,
    onPressIn: _onPressIn,
    onPressOut: _onPressOut,
    delayPressIn = 0,
    children,
    ...passThroughProps
  } = props;

  const mass = useMemo(() => {
    switch (weight) {
      case 'light':
        return 0.15;
      case 'medium':
        return 0.2;
      case 'heavy':
      default:
        return 0.3;
    }
  }, [weight]);

  const isPressedIn = useSharedValue(false);

  const springConfig = useMemo<WithSpringConfig>(
    () => ({
      damping,
      mass,
      stiffness,
      overshootClamping,
      restSpeedThreshold,
      restDisplacementThreshold,
    }),
    [
      damping,
      mass,
      overshootClamping,
      restDisplacementThreshold,
      restSpeedThreshold,
      stiffness,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isPressedIn.value ? activeScale : 1, springConfig),
        },
      ],
    };
  }, [activeScale, springConfig]);

  const onPressIn = useCallback(
    (event: GestureResponderEvent) => {
      isPressedIn.value = true;
      _onPressIn?.(event);
    },
    [_onPressIn, isPressedIn],
  );

  const onPressOut = useCallback(
    (event: GestureResponderEvent) => {
      isPressedIn.value = false;
      _onPressOut?.(event);
    },
    [_onPressOut, isPressedIn],
  );

  return (
    <TouchableWithoutFeedback
      delayPressIn={delayPressIn}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...passThroughProps}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  );
}
