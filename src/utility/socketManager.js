import { io } from 'socket.io-client';
import environment from '../constants/environment';
import setupSocketListeners from './socketHandler';
import store from '../store';
import { setSocketStatus } from '../store/reducer/chatReducer';
import { storage } from './mmkvInstance';
import { mStore } from './mmkvStoreName';

let socketUrl = environment.production
  ? 'https://api.skillbnk.com'
  : 'https://staging-api.skillbnk.com';

export let socket;
let cleanUpListeners;

export const connectSocket = async () => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  // Retrieve connection parameters
  const value = storage?.getString(mStore.USER_TOKEN);
  const orgJSON = storage?.getString(mStore.ORGANIZATION);
  const organization = JSON.parse(orgJSON)?._id;
  const proJSON = storage?.getString(mStore.ACTIVE_ENROLLMENT);
  const enrollment = JSON.parse(proJSON)?._id;

  // Configure socket options
  const options = {
    transports: ['websocket', 'polling'],
    upgrade: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: {
      token: value,
      enrollment,
      organization,
    },
  };

  try {
    if (!socket) {
      socket = io(socketUrl, options);

      // Add error listeners
      socket.on('connect_error', error => {
        console.log('Socket connection error:', error);
        store.dispatch(setSocketStatus(false));
      });

      socket.on('reconnect_attempt', () => {
        console.log('Attempting to reconnect...');
      });
    }

    if (!socket.connected) {
      socket.connect();
    }

    // Set up connect listener once
    if (!socket._hasConnectListener) {
      console.log('Try to connect socket -----------------');
      socket.on('connect', () => {
        console.log('Socket connected successfully');
        store.dispatch(setSocketStatus(true));
        cleanUpListeners = setupSocketListeners(socket);
      });
      socket._hasConnectListener = true;
    }
  } catch (error) {
    console.error('Socket connection failed:', error);
    store.dispatch(setSocketStatus(false));
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.off('connect'); // Remove connect listener
    if (cleanUpListeners) cleanUpListeners();
    socket.disconnect();
    console.log('Socket disconnected and cleaned up');
    socket = null;
  }
};
