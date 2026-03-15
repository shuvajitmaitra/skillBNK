import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0..1
  color?: string;
  trackColor?: string;
  textStyle?: StyleProp<TextStyle>;
  subTextStyle?: StyleProp<TextStyle>;
  centerStyle?: StyleProp<ViewStyle>;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const ProgressRingComponent = ({
  size = 90,
  strokeWidth = 6,
  progress = 0.24,
  color = '#2F66FF',
  trackColor = '#E9EEF9',
  textStyle,
  subTextStyle,
  centerStyle,
}: ProgressRingProps) => {
  const safeProgress = clamp01(progress);
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const dashOffset = useMemo(
    () => circumference * (1 - safeProgress),
    [circumference, safeProgress],
  );

  return (
    <View style={{width: size, height: size}}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={[styles.ringCenter, centerStyle]}>
        <Text style={[styles.ringPercent, textStyle]}>
          {Math.round(safeProgress * 100)}%
        </Text>
        <Text style={[styles.ringComplete, subTextStyle]}>COMPLETE</Text>
      </View>
    </View>
  );
};

export const ProgressRing = React.memo(ProgressRingComponent);

const styles = StyleSheet.create({
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercent: {
    fontSize: 20,
    fontWeight: '900',
  },
  ringComplete: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
