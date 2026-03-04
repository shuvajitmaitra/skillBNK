import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import SendIcon from '../../../assets/Icons/SendIcon';
import {View} from 'react-native';
import AiIcon2 from '../../../assets/Icons/AiIcon2';
import {useTheme} from '../../../context/ThemeContext';

const SendContainer = ({
  sendMessage,
  onAiPress,
}: {
  sendMessage: () => void;
  onAiPress: () => void;
}) => {
  const Colors = useTheme();
  return (
    <View>
      <TouchableOpacity onPress={onAiPress} style={styles.container}>
        <AiIcon2 size={30} color={Colors.Primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.container} onPress={sendMessage}>
        <SendIcon size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default SendContainer;

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    minWidth: 40,
    alignItems: 'center',
    zIndex: 100,
  },
});
