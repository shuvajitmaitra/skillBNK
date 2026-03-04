import React from 'react';
import {View} from 'react-native';
import RNText from '../components/SharedComponent/RNText';

/*
  1. Create the config
*/
export const toastConfig = {
  tomatoToast: ({
    text1 = 'No toast message available',
    props = {
      background: '#666666',
      color: 'white',
    },
  }) => {
    return (
      <View
        style={{
          minHeight: 40,
          minWidth: '30%',
          backgroundColor: props.background || '#666666',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          paddingHorizontal: 25,
          paddingVertical: 10,
        }}>
        <RNText
          style={{
            color: props.color || 'white',
            fontSize: 18,
            // fontWeight: 'bold',
          }}>
          {text1}
        </RNText>
      </View>
    );
  },
};
