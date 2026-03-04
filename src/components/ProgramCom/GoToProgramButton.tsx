import {StyleSheet, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {PressableScale} from '../SharedComponent/PressableScale';
import RNText from '../SharedComponent/RNText';
import {gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';

type props = {
  onPress: () => void;
};

const GoToProgramButton = ({onPress}: props) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Animated opacity value
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // animation duration
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={{opacity: fadeAnim}}>
      <PressableScale style={styles.goButton} onPress={onPress}>
        <RNText style={styles.goButtonText}>Go To Bootcamps</RNText>
      </PressableScale>
    </Animated.View>
  );
};

export default GoToProgramButton;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    goButton: {
      backgroundColor: Colors.Primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: gGap(10),
      borderRadius: gGap(10),
      marginTop: gGap(2),
    },
    goButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
  });
