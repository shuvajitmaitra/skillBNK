import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {gGap} from '../../constants/Sizes';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';

interface RNModalProps {
  isVisible: boolean;
  onClose?: () => void;
  children: ReactNode;
  style?: ViewStyle;
  modalType?: 'center' | 'bottom' | 'fullScreen';
  disableBackdropPress?: boolean;
  borderRadius?: number;
}

const RNModal: React.FC<RNModalProps> = ({
  isVisible,
  onClose,
  children,
  style,
  modalType = 'center',
  disableBackdropPress = false,
  borderRadius = 12,
}) => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(top);
  if (!isVisible) {
    return;
  }
  const modalStyle = [
    styles.modalContent,

    modalType === 'bottom' && styles.bottomSheet,
    modalType === 'fullScreen' && styles.fullScreen,
    {
      borderTopLeftRadius: modalType === 'bottom' ? borderRadius : 0,
      borderTopRightRadius: modalType === 'bottom' ? borderRadius : 0,
      backgroundColor: Colors.Background_color,
    },
    style,
  ];

  const handleClose = () => {
    if (onClose) {
      return onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType={modalType === 'center' ? 'fade' : 'slide'}
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={[styles.backdrop]}>
          {!disableBackdropPress && (
            <TouchableOpacity
              style={styles.backdropTouchable}
              onPress={handleClose}
              activeOpacity={0}
            />
          )}
        </View>
        <View style={modalStyle}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getStyles = (top: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000000' + '80',
    },
    backdropTouchable: {
      flex: 1,
    },
    modalContent: {
      width: '90%',
      padding: gGap(10),
    },
    bottomSheet: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
    fullScreen: {
      width: '100%',
      flex: 1,
      paddingTop: top,
    },
  });

export default RNModal;
