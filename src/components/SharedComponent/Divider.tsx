import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const Divider = ({
  marginTop,
  marginBottom,
  style,
}: {
  marginTop?: number;
  marginBottom?: number;
  style?: ViewStyle;
}) => {
  const dividerMarginTop = marginTop || 0;
  const dividerMarginBottom = marginBottom || 0;
  const Colors = useTheme();
  const styles = getStyles(Colors, dividerMarginTop, dividerMarginBottom);
  return <View style={[styles.dividerMain, style]} />;
};

export default Divider;

const getStyles = (
  Colors: TColors,
  dividerMarginTop: number,
  dividerMarginBottom: number,
) =>
  StyleSheet.create({
    dividerMain: {
      borderTopWidth: 1,
      borderTopColor: Colors.LineColor,
      marginTop: responsiveScreenHeight(dividerMarginTop),
      marginBottom: responsiveScreenHeight(dividerMarginBottom),
      overflow: 'hidden',
    },
  });
