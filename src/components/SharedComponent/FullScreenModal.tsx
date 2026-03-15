import React, {ReactNode} from 'react';
import ReactNativeModal from 'react-native-modal';
import GlobalStatusBar from './GlobalStatusBar';

const FullScreenModal = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: ReactNode;
}) => {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      // backdropColor={Colors.Red}
      backdropOpacity={1}
      style={{
        margin: 0,
      }}>
      <GlobalStatusBar />

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
