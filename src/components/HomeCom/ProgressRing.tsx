import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0..1
  color?: string;
  trackColor?: string;
  glowColor?: string;
  textStyle?: any;
  subTextStyle?: any;
  centerStyle?: any;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const ProgressRing = React.memo(
  ({
    size = 90,
    strokeWidth = 6,
    progress = 0.24,
    color = '#2F66FF',
    trackColor = '#E9EEF9',
    glowColor = '#2F66FF',
    textStyle,
    subTextStyle,
    centerStyle,
  }: ProgressRingProps) => {
    const r = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
    const c = useMemo(() => 2 * Math.PI * r, [r]);

    const prog = useRef(new Animated.Value(clamp01(progress))).current; // keep current
    const glow = useRef(new Animated.Value(0)).current;
    const lastProgress = useRef(clamp01(progress));
    console.log('Progress Ring --------------Re-rendering');
    const percentRef = useRef<Text>(null);

    // Animate ring + update percent (only when progress truly changes)
    useEffect(() => {
      const next = clamp01(progress);
      if (next === lastProgress.current) return; // prevents restarting animation
      lastProgress.current = next;

      const anim = Animated.timing(prog, {
        toValue: next,
        duration: 1800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // strokeDashoffset uses JS driver
      });

      const id = prog.addListener(({value}) => {
        const p = Math.round(value * 100);
        percentRef.current?.setNativeProps?.({text: `${p}%`});
      });

      anim.start();

      return () => {
        prog.removeListener(id);
        anim.stop();
      };
    }, [progress, prog]);

    // Glow loop: start once
    useEffect(() => {
      glow.setValue(0);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }, [glow]);

    // Correct dashOffset: progress is 0..1
    const dashOffset = useMemo(
      () =>
        prog.interpolate({
          inputRange: [0, 1],
          outputRange: [c, 0], // full empty -> full filled
        }),
      [c, prog],
    );

    const glowOpacity = glow.interpolate({
      inputRange: [0, 1],
      outputRange: [0.15, 0.35],
    });
    const glowScale = glow.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.06],
    });

    return (
      <View style={{width: size, height: size}}>
        {/* Glow */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 999,
              opacity: glowOpacity,
              transform: [{scale: glowScale}],
              borderWidth: strokeWidth,
              borderColor: glowColor,
            },
          ]}
        />

        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={dashOffset}
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>

        <View style={[stylesLocal.ringCenter, centerStyle]}>
          <Text ref={percentRef} style={[stylesLocal.ringPercent, textStyle]}>
            {Math.round(clamp01(progress) * 100)}%
          </Text>
          <Text style={[stylesLocal.ringComplete, subTextStyle]}>COMPLETE</Text>
        </View>
      </View>
    );
  },
  // Custom memo compare: avoids re-render if props didn't change
  (prev, next) =>
    prev.size === next.size &&
    prev.strokeWidth === next.strokeWidth &&
    prev.progress === next.progress &&
    prev.color === next.color &&
    prev.trackColor === next.trackColor &&
    prev.glowColor === next.glowColor &&
    prev.textStyle === next.textStyle &&
    prev.subTextStyle === next.subTextStyle &&
    prev.centerStyle === next.centerStyle,
);

const stylesLocal = StyleSheet.create({
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercent: {fontSize: 20, fontWeight: '900'},
  ringComplete: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
