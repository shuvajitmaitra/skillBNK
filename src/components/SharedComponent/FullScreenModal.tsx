import {StatusBar} from 'react-native';
import React, {ReactNode} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {theme} from '../../utility/commonFunction';

const FullScreenModal = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: ReactNode;
}) => {
  const Colors = useTheme();
  return (
    <ReactNativeModal
      isVisible={isVisible}
      // backdropColor={Colors.Red}
      backdropOpacity={1}
      style={{
        margin: 0,
      }}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />

      {children}
      {/* <View
        style={{
          backgroundColor: "green",
        }}
      >
      </View> */}
    </ReactNativeModal>
  );
};

export default FullScreenModal;
