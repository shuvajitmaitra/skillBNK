import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {gGap} from '../../constants/Sizes';

const Divider2 = ({
  marginTop,
  marginBottom,
  style,
}: {
  marginTop?: number;
  marginBottom?: number;
  style?: ViewStyle;
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const dividerMarginTop = marginTop || gGap(5);
  const dividerMarginBottom = marginBottom || gGap(5);
  const Colors = useTheme();
  const styles = getStyles(Colors, dividerMarginTop, dividerMarginBottom);
  return <View style={[styles.dividerMain, style]} />;
};

export default Divider2;

const getStyles = (
  Colors: TColors,
  dividerMarginTop: number,
  dividerMarginBottom: number,
) =>
  StyleSheet.create({
    dividerMain: {
      borderTopWidth: 1,
      borderTopColor: Colors.LineColor,
      marginTop: dividerMarginTop,
      marginBottom: dividerMarginBottom,
      overflow: 'hidden',
    },
  });
