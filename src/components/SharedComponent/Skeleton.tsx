// Skeleton.tsx
import React, {memo, useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, StyleProp, StyleSheet, ViewStyle} from 'react-native';

type SkeletonProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;

  /** Base (background) color of the skeleton block */
  baseColor?: string;

  /** Shimmer highlight color */
  highlightColor?: string;

  /** Shimmer duration in ms */
  duration?: number;

  /** Disable animation (e.g., reduce motion) */
  animated?: boolean;
};

const Skeleton = memo(
  ({
    width,
    height,
    borderRadius = 8,
    style,
    baseColor = 'rgba(255,255,255,0.10)',
    highlightColor = 'rgba(255,255,255,0.22)',
    duration = 1100,
    animated = true,
  }: SkeletonProps) => {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (!animated) return;

      const loop = Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      loop.start();
      return () => loop.stop();
    }, [animated, duration, progress]);

    // translate shimmer from left -> right
    const translateX = useMemo(() => {
      // needs a number; if width is %, shimmer will still look fine using a constant
      const numericWidth = typeof width === 'number' ? width : 280;
      return progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-numericWidth, numericWidth],
      });
    }, [progress, width]);

    const containerStyle = useMemo(
      () => [
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        } as ViewStyle,
        style,
      ],
      [width, height, borderRadius, baseColor, style],
    );

    return (
      <Animated.View style={containerStyle}>
        {animated ? (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: highlightColor,
                opacity: 0.9,
                transform: [{translateX}, {skewX: '-15deg'}],
                // Make the highlight band narrower
                width: '35%',
              },
            ]}
          />
        ) : null}
      </Animated.View>
    );
  },
);

export default Skeleton;
