import {View} from 'react-native';
import React from 'react';

const Grabber = ({
  top = 10,
  width = 60,
  height = 7,
  backgroundColor = '#27AC1F',
}) => {
  return (
    <View
      style={{
        height: height,
        width: width,
        backgroundColor: backgroundColor,
        position: 'absolute',
        top: top,
        alignSelf: 'center',
        borderRadius: 50,
      }}
    />
  );
};

export default Grabber;
