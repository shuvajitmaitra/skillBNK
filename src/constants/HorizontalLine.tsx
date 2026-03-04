import React from 'react';
import {StyleSheet, View, DimensionValue} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {TColors} from '../types';

// Define the props interface for the HorizontalLine component.
interface HorizontalLineProps {
  width?: DimensionValue;
  color?: string;
  borderWidth?: number;
  marginVertical?: number;
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({
  width = '100%' as DimensionValue,
  color,
  borderWidth = 1,
  marginVertical = 20, // provide a default value if not passed
}) => {
  const Colors = useTheme();
  const styles = getStyles({
    Colors,
    width,
    color: color || '',
    borderWidth,
    marginVertical,
  });

  return <View style={styles.horizontalLine} />;
};

export default HorizontalLine;

// Define an interface for the style parameters.
interface GetStylesParams {
  Colors: TColors;
  width: DimensionValue;
  color: string;
  borderWidth: number;
  marginVertical: number;
}

const getStyles = ({
  Colors,
  width,
  color,
  borderWidth,
  marginVertical,
}: GetStylesParams) =>
  StyleSheet.create({
    horizontalLine: {
      borderBottomWidth: borderWidth,
      width,
      marginVertical,
      alignSelf: 'center',
      borderColor: color || Colors.BodyTextOpacity,
    },
  });
