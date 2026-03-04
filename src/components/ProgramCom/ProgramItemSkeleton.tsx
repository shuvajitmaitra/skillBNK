import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import Skeleton from '../SharedComponent/Skeleton';
import {withOpacity} from '../ChatCom/Mention/utils';

const ProgramItemSkeleton = memo(() => {
  const Colors = useTheme();

  const styles = getStyles();

  const base = withOpacity(Colors.Foreground, 0.4);
  const highlight = Colors.Foreground;

  return (
    <View style={[styles.container, {backgroundColor: base}]}>
      <Skeleton
        width={responsiveScreenWidth(87)}
        height={50}
        borderRadius={10}
        baseColor={base}
        highlightColor={highlight}
      />

      <View style={{height: 10}} />

      <Skeleton
        height={30}
        width={300}
        borderRadius={8}
        baseColor={base}
        highlightColor={highlight}
      />
      <View style={{height: 8}} />
      <Skeleton
        height={30}
        width={200}
        borderRadius={8}
        baseColor={base}
        highlightColor={highlight}
      />

      <View style={{height: 10}} />

      <Skeleton
        height={20}
        width={responsiveScreenWidth(87)}
        borderRadius={100}
        baseColor={base}
        highlightColor={highlight}
      />

      <View style={{height: 10}} />

      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Skeleton
          height={50}
          width={responsiveScreenWidth(42)}
          borderRadius={8}
          baseColor={base}
          highlightColor={highlight}
        />
        <Skeleton
          height={50}
          width={responsiveScreenWidth(42)}
          borderRadius={8}
          baseColor={base}
          highlightColor={highlight}
        />
      </View>

      <View style={{height: 10}} />

      <Skeleton
        height={50}
        width={responsiveScreenWidth(87)}
        borderRadius={8}
        baseColor={base}
        highlightColor={highlight}
      />
    </View>
  );
});

export default ProgramItemSkeleton;

const getStyles = () =>
  StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 10,
    },
  });
