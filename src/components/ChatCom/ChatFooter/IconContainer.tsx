import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import GalleryIcon from '../../../assets/Icons/GalleryIcon';

const IconContainer = ({selectImage}: {selectImage: () => void}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.button}>
        <GalleryIcon size={23} />
      </TouchableOpacity>
    </View>
  );
};

export default IconContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 5,
    // backgroundColor: 'blue',
  },
});
