import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import ModalCustomButton from './ModalCustomButton';
import CustomDropDown from '../../SharedComponent/CustomDropDown';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateChats,
  updateSingleChatProfile,
} from '../../../store/reducer/chatReducer';
import {showToast} from '../../HelperFunction';
import axiosInstance from '../../../utility/axiosInstance';
import RequireFieldStar from '../../../constants/RequireFieldStar';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import SaveConfirmationModal from '../../SharedComponent/SaveConfirmationModal';
import {theme} from '../../../utility/commonFunction';

type TUpdateCrowdModal = {
  isUpdateCrowdModalVisible: boolean;
  toggleUpdateCrowdModal: () => void;
};

const UpdateCrowdModal = ({
  isUpdateCrowdModalVisible,
  toggleUpdateCrowdModal,
}: TUpdateCrowdModal) => {
  const {singleChat: chat} = useSelector((state: RootState) => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const options = [
    {type: 'Public', data: 'Public'},
    {type: 'Private', data: 'Private'},
  ];
  const modeOption = [
    {type: 'Yes', data: 'Yes'},
    {type: 'No', data: 'No'},
  ];
  const [chatName, setChatName] = useState(chat?.name);
  const [chatDescription, setChatDescription] = useState(chat?.description);
  const [isReadOnly, setIsReadOnly] = useState(chat?.isReadOnly);
  const [isPublic, setIsPublic] = useState(chat?.isPublic);
  const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setChatName(chat?.name);
    setChatDescription(chat?.description);
    setSaveModalVisible(false);
    setIsReadOnly(chat?.isReadOnly);
    setIsReadOnly(chat?.isPublic);
    return () => {
      setChatName('');
      setChatDescription('');
      setSaveModalVisible(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateCrowd = () => {
    if (!chatName) {
      return;
    }
    axiosInstance
      .patch(`/chat/channel/update/${chat?._id}`, {
        name: emptyName ? chat.name : chatName.trim(),
        description: chatDescription?.trim() || '',
        isReadOnly: isReadOnly === 'Yes' ? true : false,
        isPublic: isPublic === 'Public' ? true : false,
      })
      .then(res => {
        if (res.data.success) {
          dispatch(updateChats(res?.data?.channel));
          dispatch(updateSingleChatProfile(res?.data?.channel));
          toggleUpdateCrowdModal();
          showToast({message: 'Crowd updated successfully...'});
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const emptyName = chatName?.trim().length === 0;
  const noChange =
    JSON.stringify({
      chatName: chat?.name,
      chatDescription: chat?.description,
      isReadOnly: chat?.isReadOnly,
      isPublic: chat?.isPublic,
    }) === JSON.stringify({chatName, chatDescription, isReadOnly, isPublic});
  return (
    <ReactNativeModal
      isVisible={isUpdateCrowdModalVisible}
      avoidKeyboard={true}>
      <View style={styles.container}>
        <ModalBackAndCrossButton
          toggleModal={
            noChange ? toggleUpdateCrowdModal : () => setSaveModalVisible(true)
          }
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <CrowdIcon />
            <Text style={styles.headerText}>Update Crowd</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.Text}>
              Crowd Name
              <RequireFieldStar />
            </Text>
            <TextInput
              keyboardAppearance={theme()}
              placeholderTextColor={Colors.BodyText}
              style={styles.inputField}
              value={chatName}
              placeholder={chat?.name}
              onChangeText={text => setChatName(text)}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.Text}>Crowd Description</Text>
            <View style={[styles.inputContainer, {height: 'auto'}]}>
              <TextInput
                keyboardAppearance={theme()}
                style={[styles.textAreaInput]}
                multiline={true}
                value={chatDescription}
                onChangeText={setChatDescription}
                placeholderTextColor={Colors.BodyText}
                placeholder={'Write crowd description'}
              />
            </View>
          </View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.Text}>Crowd Type</Text>
            <CustomDropDown
              options={options}
              type={chat?.isPublic ? 'Public' : 'Private'}
              setState={setIsPublic}
            />
          </View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.Text}>Read Only</Text>
            <CustomDropDown
              options={modeOption}
              type={chat?.isReadOnly ? 'Yes' : 'No'}
              setState={setIsReadOnly}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <ModalCustomButton
            toggleModal={
              noChange
                ? toggleUpdateCrowdModal
                : () => setSaveModalVisible(true)
            }
            textColor={Colors.Primary}
            backgroundColor={Colors.PrimaryOpacityColor}
            buttonText="Cancel"
          />
          <ModalCustomButton
            toggleModal={handleUpdateCrowd}
            textColor={
              emptyName
                ? Colors.DisablePrimaryButtonTextColor
                : Colors.PrimaryButtonTextColor
            }
            backgroundColor={
              emptyName
                ? Colors.DisablePrimaryBackgroundColor
                : Colors.PrimaryButtonBackgroundColor
            }
            buttonText="Update"
            disable={emptyName}
          />
        </View>
      </View>
      {saveModalVisible && (
        <SaveConfirmationModal
          isVisible={saveModalVisible}
          tittle="Unsave changes"
          description="You have unsaved changes. Do you want to continue?"
          onExitPress={() => {
            setSaveModalVisible(false);
            toggleUpdateCrowdModal();
          }}
          onContinuePress={() => {
            setSaveModalVisible(false);
          }}
        />
      )}
    </ReactNativeModal>
  );
};

export default UpdateCrowdModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingTop: 10,
    },
    fieldContainer: {
      // marginBottom: responsiveScreenHeight(2),
      // backgroundColor: 'red',
    },
    inputFieldContainer: {
      marginBottom: responsiveScreenHeight(1),
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      // width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(6),
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      flexDirection: 'row',
      backgroundColor: Colors.ModalBoxColor,
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
      marginBottom: responsiveScreenWidth(3),
    },
    textAreaInput: {
      width: '100%',
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      // backgroundColor: "red",
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(10),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      color: Colors.Heading,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(1.5),
      height: 50,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(2),
      maxHeight: responsiveScreenHeight(80),
      marginTop: 30,
    },
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
    },

    modalArrowIcon: {
      paddingBottom: responsiveScreenHeight(0.8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      color: Colors.BodyText,
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    cancelButton: {
      backgroundColor: Colors.PrimaryOpacityColor,
      padding: responsiveScreenWidth(2.5),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
