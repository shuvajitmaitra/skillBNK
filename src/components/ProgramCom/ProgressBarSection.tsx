import {StyleSheet, Text, View, Animated, Easing} from 'react-native';
import React, {useEffect, useRef, memo} from 'react';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';

type props = {
  overall: number;
};

const ProgressBarSection = ({overall}: props) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: overall,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width can't use native driver
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overall]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      <Text style={styles.overallText}>Overall Progress {overall}%</Text>

      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, {width: widthInterpolate}]}
        />
      </View>
    </>
  );
};

export default memo(ProgressBarSection);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    overallText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: fontSizes.body,
      color: Colors.Heading,
      marginBottom: gGap(10),
    },
    progressTrack: {
      width: '100%',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: borderRadius.circle,
      overflow: 'hidden',
      height: gGap(10),
    },
    progressFill: {
      backgroundColor: Colors.Primary,
      height: '100%',
      borderRadius: borderRadius.circle,
    },
  });
