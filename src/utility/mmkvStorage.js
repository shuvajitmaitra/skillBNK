import {MMKV} from 'react-native-mmkv';

const mmkv = new MMKV();

const mmkvStorage = {
  setItem: async (key, value) => {
    try {
      mmkv.set(key, value);
    } catch (error) {
      console.error('MMKV setItem error:', error);
    }
  },
  getItem: async key => {
    try {
      const value = mmkv.getString(key);
      return value;
    } catch (error) {
      console.error('MMKV getItem error:', error);
      return null;
    }
  },
  removeItem: async key => {
    try {
      mmkv.delete(key);
    } catch (error) {
      console.error('MMKV removeItem error:', error);
    }
  },
};

export default mmkvStorage;
