import { storage } from './mmkvInstance';
import { mStore } from './mmkvStoreName';
export const getAllMessages = () => {
  const pre = storage?.getString(mStore.ALL_MESSAGES);
  return pre ? JSON.parse(pre) : {};
};

export const setAllMessages = (chatId, messages) => {
  const allMessages = getAllMessages();
  const updatedAllMessages = {
    ...allMessages,
    [chatId]: [...(allMessages[chatId] || []), ...messages],
  };
  storage?.set(mStore.ALL_MESSAGES, JSON.stringify(updatedAllMessages));
};

export const addNewMessage = (chatId, message) => {
  const allMessages = getAllMessages();
  const updatedAllMessages = {
    ...allMessages,
    [chatId]: [message, ...(allMessages[chatId] || [])],
  };
  storage?.set(mStore.ALL_MESSAGES, JSON.stringify(updatedAllMessages));
};
export const setOrganization = org => {
  storage?.set(mStore.ORGANIZATION, JSON.stringify(org));
};
export const activeProgram = enroll => {
  storage?.set(mStore.ACTIVE_ENROLLMENT, JSON.stringify(enroll));
};
export const getActiveProgram = () => {
  const pJSON = storage?.getString(mStore.ACTIVE_ENROLLMENT);
  if (!pJSON || pJSON === 'undefined' || pJSON === 'null') {
    return null; // Or handle the absence of valid data as needed
  }
  try {
    const res = JSON.parse(pJSON);
    return res;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null; // Or handle the error as needed
  }
};
export const setCommunityPostOnLocal = posts => {
  storage?.set(mStore.COMMUNITY_POSTS, JSON.stringify(posts));
};

export const getCommunityPostOnLocal = () => {
  const pre = storage?.getString(mStore.COMMUNITY_POSTS);
  return pre ? JSON.parse(pre) : [];
};

export const saveArrayToLocalStorage = (key, value) => {
  storage?.set(key, JSON.stringify(value));
};
export const getObjectFromLocalStorage = key => {
  const pre = storage?.getString(key);
  return pre ? JSON.parse(pre) : {};
};
export const getArrayFromLocalStorage = key => {
  const pre = storage?.getString(key);
  return pre ? JSON.parse(pre) : [];
};
export const saveObjectToLocalStorage = (key, object) => {
  storage?.set(key, JSON.stringify(object));
};

//------------------------------------------------------------For add new array to the Object
export const addArrayToObject = ({ storeName, key, value }) => {
  const pre = storage?.getString(storeName);
  const obj = pre ? JSON.parse(pre) : {};
  const updatedObj = {
    ...obj,
    [key]: value,
  };
  storage?.set(storeName, JSON.stringify(updatedObj));
};

//------------------------------------------------------------Add Object in the array of object in the Object
export const addObjectInArray = ({ storeName, key, newObj }) => {
  const pre = storage?.getString(storeName);
  const obj = pre ? JSON.parse(pre) : {};
  const updatedObj = {
    ...obj,
    [key]: [newObj, ...obj[key]],
  };
  console.log('updatedObj', JSON.stringify(updatedObj, null, 2));
  // storage?.set(storeName, JSON.stringify(updatedObj));
};

//------------------------------------------------------------For update array of object of object property
//Data format:
/*
{
id1: [{}, {},{}]
id2: [{}, {},{}]
id3: [{}, {},{}]
}
*/
export const updateObjectOfArray = ({
  storageName,
  chatId,
  messageId,
  newData,
}) => {
  // Step 1: Retrieve the existing data
  const jsonData = storage?.getString(storageName);
  let data = jsonData ? JSON.parse(jsonData) : {};

  // Step 2: Check if the parentId exists and is an array
  if (Array.isArray(data[chatId])) {
    const userArray = data[chatId];
    const userIndex = userArray.findIndex(user => user._id === messageId);

    // Step 3: Update the property if the user is found
    if (userIndex !== -1) {
      userArray[userIndex] = { ...userArray[userIndex], ...newData };
      data[chatId] = userArray;
      storage?.set(storageName, JSON.stringify(data)); // Save back to MMKV
    } else {
      // console.log(`User with _id ${messageId} not found under ${chatId}`);
    }
  } else {
    // console.log(`Parent ID ${chatId} not found or not an array`);
  }
};
// Function to save data to MMKV
export const saveToMMKV = (key, value) => {
  try {
    storage?.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to MMKV:', error);
  }
};

// Function to get data from MMKV
export const getFromMMKV = key => {
  try {
    const value = storage?.getString(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving from MMKV:', error);
    return null;
  }
};
