import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import CloseIcon from '../../assets/Icons/CloseIcon';
import {gGap} from '../../constants/Sizes';

const ModalCloseButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <CloseIcon size={30} />
    </TouchableOpacity>
  );
};

export default ModalCloseButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f56565',
    borderRadius: gGap(100),
    position: 'absolute',
    top: gGap(10),
    right: gGap(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
