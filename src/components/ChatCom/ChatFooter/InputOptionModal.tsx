import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {RootState} from '../../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {updateChatFooterInfo} from '../../../store/reducer/chatFooterReducer';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {fontSizes, gGap} from '../../../constants/Sizes';
import {
  AntDesignIcon,
  FeatherIcon,
  MaterialCommunityIcon,
  MaterialIcon,
} from '../../../constants/Icons';
import Divider from '../../SharedComponent/Divider';
import {setNewEventData} from '../../../store/reducer/calendarReducerV2';
type InputOptionProps = {
  onSendImage: () => void;
  onRecordAudio: () => void;
};

const InputOptionModal = ({onSendImage, onRecordAudio}: InputOptionProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {chatFooterInfo} = useSelector((state: RootState) => state.chatFooter);
  return (
    <ReactNativeModal
      onBackdropPress={() => {
        dispatch(updateChatFooterInfo({inputOptionModal: false}));
      }}
      backdropOpacity={0.1}
      isVisible={chatFooterInfo?.inputOptionModal}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            onSendImage();
          }}
          style={styles.optionContainer}>
          <MaterialCommunityIcon
            name="image-plus"
            size={22}
            color={Colors.BodyText}
          />
          <Text style={styles.itemText}>Send images</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={onRecordAudio}
          style={styles.optionContainer}>
          <FeatherIcon name="mic" size={22} color={Colors.BodyText} />
          <Text style={styles.itemText}>Record an audio clip</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.optionContainer}>
          <AntDesignIcon name="addfile" size={22} color={Colors.BodyText} />
          <Text style={styles.itemText}>Upload a file</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            dispatch(updateChatFooterInfo({inputOptionModal: false}));

            dispatch(
              setNewEventData({isModalVisible: true, eventType: 'event'}),
            );
          }}
          style={styles.optionContainer}>
          <MaterialIcon name="event" size={25} color={Colors.BodyText} />
          <Text style={styles.itemText}>Create a event</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            dispatch(updateChatFooterInfo({inputOptionModal: false}));

            dispatch(
              setNewEventData({isModalVisible: true, eventType: 'task'}),
            );
          }}
          style={styles.optionContainer}>
          <MaterialIcon name="add-task" size={25} color={Colors.BodyText} />
          <Text style={styles.itemText}>Upload a task</Text>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
};

export default InputOptionModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      borderTopRightRadius: gGap(16),
      borderTopLeftRadius: gGap(16),
      padding: gGap(16),
      gap: gGap(10),
      paddingBottom: gGap(30),
    },
    optionContainer: {
      flexDirection: 'row',
      gap: gGap(10),
      alignItems: 'center',
    },
    itemText: {
      fontSize: fontSizes.body,
      fontWeight: '500',
      color: Colors.BodyText,
    },
  });
