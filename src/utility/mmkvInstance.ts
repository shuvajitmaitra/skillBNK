import {MMKV} from 'react-native-mmkv';

let storage: MMKV | null;

try {
  storage = new MMKV();
} catch (e) {
  console.log('MMKV unavailable (likely remote debugging).', e);
  storage = null; // fallback: AsyncStorage etc.
}

export {storage};
