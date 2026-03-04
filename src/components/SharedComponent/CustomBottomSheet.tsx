import {Pressable, StyleSheet, useWindowDimensions, View} from 'react-native';
import React, {ReactNode} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const CustomBottomSheet = ({
  children,
  onBackdropPress,
}: {
  children: ReactNode;
  onBackdropPress: () => void;
}) => {
  const {top, bottom} = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <Pressable
      onPress={onBackdropPress}
      style={[
        styles.backdrop,
        {paddingTop: top, minHeight: height, width: width},
      ]}>
      <View style={[styles.parent, {paddingBottom: bottom}]}>{children}</View>
    </Pressable>
  );
};

export default CustomBottomSheet;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    backdrop: {
      position: 'absolute',
      backgroundColor: Colors.BackDropColor,
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    parent: {
      backgroundColor: Colors.Foreground,
      // height: '30%',
      borderTopStartRadius: 15,
      borderTopRightRadius: 15,
      padding: 20,
    },
  });
