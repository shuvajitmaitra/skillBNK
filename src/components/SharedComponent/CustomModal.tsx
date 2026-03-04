import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TColors} from '../../types';

const CustomModal = ({
  children,
  customStyles,
  onPress,
  parentStyle,
}: {
  children: ReactNode;
  customStyles?: ViewStyle;
  onPress?: () => void;
  parentStyle?: ViewStyle;
}) => {
  const Colors = useTheme();
  const {top} = useSafeAreaInsets();
  const styles = getStyles(Colors);
  return (
    <Pressable onPress={onPress} style={[styles.container, parentStyle]}>
      <View
        style={[
          {
            backgroundColor: Colors.Foreground,
            padding: 10,
            borderRadius: 4,
            paddingTop: top,
          },
          customStyles,
        ]}>
        {children}
      </View>
    </Pressable>
  );
};

export default CustomModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      height: responsiveScreenHeight(100),
      position: 'absolute',
      backgroundColor: Colors.BackDropColor,
      zIndex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
