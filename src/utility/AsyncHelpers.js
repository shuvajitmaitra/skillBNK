import AsyncStorage from '@react-native-async-storage/async-storage';

const ALL_MESSAGES_KEY = 'allMessages';

export const getAllMessages = async () => {
  try {
    const pre = await AsyncStorage.getItem(ALL_MESSAGES_KEY);
    return pre ? JSON.parse(pre) : {};
  } catch (error) {
    console.error('Error fetching all messages:', error);
    return {};
  }
};

export const setAllMessages = async (chatId, messages) => {
  try {
    const allMessages = await getAllMessages();
    console.log('messages,,,,,,,,,,', JSON.stringify(messages, null, 1));
    const updatedAllMessages = {
      ...allMessages,
      [chatId]: [...(allMessages[chatId] || []), ...messages],
    };
    await AsyncStorage.setItem(
      ALL_MESSAGES_KEY,
      JSON.stringify(updatedAllMessages),
    );
  } catch (error) {
    console.error('Error setting all messages:', error);
  }
};

export const addNewMessage = async (chatId, message) => {
  try {
    const allMessages = await getAllMessages();
    const updatedAllMessages = {
      ...allMessages,
      [chatId]: [message, ...(allMessages[chatId] || [])],
    };
    await AsyncStorage.setItem(
      ALL_MESSAGES_KEY,
      JSON.stringify(updatedAllMessages),
    );
  } catch (error) {
    console.error('Error adding new message:', error);
  }
};
