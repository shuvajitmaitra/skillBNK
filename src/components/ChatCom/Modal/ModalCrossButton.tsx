import {TouchableOpacity} from 'react-native';
import React from 'react';
import CrossCircle from '../../../assets/Icons/CrossCircle';

const ModalCrossButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <CrossCircle size={35} />
    </TouchableOpacity>
  );
};

export default ModalCrossButton;
