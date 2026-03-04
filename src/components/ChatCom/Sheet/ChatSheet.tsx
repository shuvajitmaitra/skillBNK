import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ChatSheet = () => {
  return (
    <View style={styles.container}>
      <Text>ChatSheet</Text>
    </View>
  );
};

export default ChatSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
