import {View} from 'react-native';
import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import NoDataIcon from '../../assets/Icons/NotDataIcon';
// import {useTheme} from '../../context/ThemeContext';

const NoDataAvailable = ({height = 30}: {height?: number}) => {
  return (
    <View
      style={{
        minHeight: responsiveScreenHeight(height),
        minWidth: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: responsiveScreenHeight(2),
      }}>
      <NoDataIcon />
    </View>
  );
};

export default NoDataAvailable;
