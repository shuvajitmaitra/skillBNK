import React from 'react';
import {View} from 'react-native';
import MyButton from '../AuthenticationCom/MyButton';
import {StyleSheet} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const ChartSection = ({
  onPress,
  Colors,
  Component,
  title,
  width,
  height,
  fontSize,
}) => {
  const styles = getStyles(Colors);

  return (
    <View style={styles.chartContainer}>
      <Component />
      {onPress && (
        <View style={styles.btn}>
          <MyButton
            onPress={() => onPress()}
            borderRadius={4}
            title={title}
            bg={Colors.Primary}
            colour={Colors.PureWhite}
            width={width}
            height={height}
            fontSize={fontSize}
          />
        </View>
      )}
    </View>
  );
};

export default ChartSection;
const getStyles = Colors =>
  StyleSheet.create({
    chartContainer: {
      backgroundColor: Colors.Foreground,
      padding: 10,
      borderRadius: responsiveScreenWidth(3),
      // marginTop: 10,
      marginHorizontal: 5,
    },
    btn: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 10,
      paddingTop: 10,
      borderTopColor: Colors.BorderColor,
      borderTopWidth: 1,
    },
  });
