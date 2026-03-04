import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const getRandomHeight = (min, max) => {
  return Math.random() * (max - min) + min;
};

const Waveform = ({progress, color}) => {
  const [barHeights, setBarHeights] = useState([]);

  useEffect(() => {
    const generateBarHeights = () => {
      const bars = 40;
      let heights = [];
      for (let i = 0; i < bars; i++) {
        heights.push(getRandomHeight(5, 20));
      }
      setBarHeights(heights);
    };

    generateBarHeights();
  }, []);

  let completedBars = Math.floor(40 * progress);
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors, color);
  return (
    <View style={styles.waveformContainer}>
      {barHeights.map((height, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            {height: height},
            index < completedBars ? styles.completedBar : null,
          ]}
        />
      ))}
      <View style={[styles.progressLine, {left: `${progress * 100}%`}]} />
      <View style={[styles.ProgressDot, {left: `${progress * 100}%`}]} />
    </View>
  );
};

const getStyles = (Colors, color) =>
  StyleSheet.create({
    waveformContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      // marginLeft: 10,
      // marginRight: 10,
      overflow: 'hidden',
      // backgroundColor: "red",
      width: '100%',
    },
    waveformBar: {
      height: 20,
      width: 1,
      backgroundColor: color || Colors.PureWhite,
      marginHorizontal: 1,
    },
    completedBar: {
      backgroundColor: Colors.PureCyan,
    },
    ProgressDot: {
      height: '30%',
      width: 8,
      backgroundColor: Colors.PureCyan,
      position: 'absolute',
      borderRadius: 100,
    },
    progressLine: {
      height: '100%',
      width: 2,
      backgroundColor: Colors.Primary,
      position: 'absolute',
      // right: 10,
      // borderRadius: 100,
    },
  });

export default Waveform;
