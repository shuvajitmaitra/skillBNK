import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../../context/ThemeContext';
import {RegularFonts} from '../../../constants/Fonts';
import CustomFonts from '../../../constants/CustomFonts';
import TextArea from '../../Calendar/Modal/TextArea';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomeBtn from '../../AuthenticationCom/CustomeBtn';

const FullScreenEditorModal = ({
  isVisible,
  setIsVisible,
  text,
  setText,
  sendMessage,
}) => {
  //   console.log("isVisible", JSON.stringify(isVisible, null, 1));
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  return (
    <ReactNativeModal
      style={{maxHeight: responsiveScreenHeight(90), paddingTop: top}}
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(!isVisible)}>
      <View style={styles.modalContainer}>
        <Text style={styles.textHeading}>Write message</Text>
        <ScrollView>
          <TextArea
            placeholderText={'Message...'}
            setState={setText}
            state={text}
            marginTop={0.00001}
          />
        </ScrollView>
        <CustomeBtn
          title="Send"
          handlePress={() => {
            sendMessage(), setIsVisible(pre => !pre);
          }}
          disable={text.length === 0}
        />
      </View>
    </ReactNativeModal>
  );
};

export default FullScreenEditorModal;

const getStyles = Colors =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: Colors.Foreground,
      padding: 20,
      borderRadius: 10,
    },
    textHeading: {
      color: Colors.Heading,

      paddingBottom: 10,

      fontSize: RegularFonts.HR,

      fontFamily: CustomFonts.SEMI_BOLD,
    },
  });
