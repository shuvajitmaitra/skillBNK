import React, {createContext, useContext, useState, ReactNode} from 'react';
import axiosInstance, {configureAxiosHeader} from '../utility/axiosInstance';
import store from '../store';
import {
  setAccessToken,
  setAppLoading,
  setEnrollment,
  setMyEnrollments,
  setSelectedOrganization,
  setUser,
} from '../store/reducer/authReducer';
import {userOrganizationInfo} from '../actions/apiCall';
import {resetApp} from '../store/action';
import {storage} from '../utility/mmkvInstance';
import {
  activeProgram,
  getActiveProgram,
  setOrganization,
} from '../utility/mmkvHelpers';
import {mStore} from '../utility/mmkvStoreName';
import {showToast} from '../components/HelperFunction';

interface MainContextType {
  handleVerify2: () => Promise<void>;
  handleVerify: (shouldLoad?: boolean) => Promise<void>;
  isLoading: boolean;
}

const MainContext = createContext<MainContextType | null>(null);

interface MainProviderProps {
  children: ReactNode;
}

export const MainProvider: React.FC<MainProviderProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVerify = async (shouldLoad?: boolean): Promise<void> => {
    try {
      await configureAxiosHeader();
      if (shouldLoad) {
        store.dispatch(setAppLoading(true));
        setIsLoading(true);
      }
      axiosInstance
        .post('/user/verify', {})
        .then(async res => {
          console.log('Handle verify called');
          if (res.data.success) {
            store.dispatch(setUser(res.data.user));
            store.dispatch(setMyEnrollments(res.data.enrollments));
            const value = storage?.getString(mStore.USER_TOKEN);
            if (value) {
              store.dispatch(setAccessToken(value));
            } else {
              return;
            }
            await userOrganizationInfo();
            const selectedProgram = getActiveProgram();
            if (!selectedProgram) {
              const active =
                res.data.enrollments.find(
                  (item: any) =>
                    (item.status === 'approved' || item.status === 'trial') &&
                    item.program.type === 'program',
                ) ||
                res.data.enrollments.find(
                  (item: any) =>
                    (item.status === 'approved' || item.status === 'trial') &&
                    item.program.type === 'course',
                ) ||
                res.data.enrollments.find(
                  (item: any) =>
                    item.status === 'approved' || item.status === 'trial',
                );
              if (!active?._id) {
                return;
              }
              store.dispatch(setSelectedOrganization(active.organization));
              setOrganization(active.organization);
              store.dispatch(setEnrollment(active));

              activeProgram({
                _id: active._id,
                programName: active?.program?.title
                  ? active?.program.title
                  : '',
                type: active?.program?.type,
                slug: active?.program?.slug,
              });
            }
          }
          store.dispatch(setAppLoading(false));
        })
        .catch(err => {
          console.log('Error from app.js', err.response.data);
          showToast({
            message: err.response.data.message || 'Something went wrong',
            background: 'red',
          });
          setIsLoading(false);
          resetApp();
          storage?.clearAll();
          store.dispatch(setAppLoading(false));
        });
    } catch (error: any) {
      console.log(
        'To Verify user',
        JSON.stringify(error.response?.data, null, 1),
      );
      store.dispatch(setAppLoading(false));
    }
  };

  const handleVerify2 = async (): Promise<void> => {
    try {
      await configureAxiosHeader();
      const response = await axiosInstance.post('/user/verify', {});
      if (response.data.success) {
        store.dispatch(setUser(response.data.user));
        store.dispatch(setMyEnrollments(response.data.enrollments));
        console.log('Handle verify2 successfully');
      }
    } catch (error: any) {
      resetApp();
      storage?.clearAll();
      console.log(
        'To verify user 2',
        JSON.stringify(error.response?.data.error, null, 1),
      );
    }
  };

  const value: MainContextType = {
    handleVerify2,
    handleVerify,
    isLoading,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainContext = (): MainContextType => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within a MainProvider');
  }
  return context;
};
