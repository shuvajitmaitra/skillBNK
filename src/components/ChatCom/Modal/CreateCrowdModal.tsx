import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import ModalCustomButton from './ModalCustomButton';
import CustomDropDown from '../../SharedComponent/CustomDropDown';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import CreateCrowdAddMember from './CreateCrowdAddMember';
import RequireFieldStar from '../../../constants/RequireFieldStar';
import {TColors} from '../../../types';
import axiosInstance from '../../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {setSingleChat, updateChats} from '../../../store/reducer/chatReducer';
import {RootState} from '../../../types/redux/root';
import {showToast} from '../../HelperFunction';
import {loadChats} from '../../../actions/chat-noti';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TUserProfile} from '../../MockInterviewCom/ShareInterviewModal';
import Images from '../../../constants/Images';
import BinIcon from '../../../assets/Icons/BinIcon';
import {theme} from '../../../utility/commonFunction';
type chatInfoProps = {
  name: string;
  description: string;
  isPublic: boolean;
  isReadOnly: boolean;
  users: TUserProfile[];
};
type User = {
  _id: string;
  profilePicture?: string;
  checked?: boolean;
  fullName?: string;
};
type CreateCrowdModalProps = {
  isCreateCrowdModalVisible: boolean;
  toggleCreateCrowdModal: () => void;
};

const CreateCrowdModal = ({
  isCreateCrowdModalVisible,
  toggleCreateCrowdModal,
}: CreateCrowdModalProps) => {
  const [chatInfo, setChatInfo] = useState<chatInfoProps | null>(null);
  const [checked, setChecked] = useState<User[]>([]);
  const {user} = useSelector((state: RootState) => state.auth);

  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  const [isAddMembersModalVisible, setIsAddMembersModalVisible] =
    useState(false);
  const toggleAddMembersModal = () => {
    setIsAddMembersModalVisible(pre => !pre);
  };

  const handleCreateCrowd = async () => {
    if (checked.length <= 1) {
      return showToast({
        message: 'Please add more than 1 members',
      });
    }
    if (!chatInfo?.name) {
      return showToast({
        message: 'Please add a Crowd Name',
      });
    }

    await axiosInstance
      .post('/chat/channel/create', {
        ...chatInfo,
        users: checked.map(i => i._id),
      })
      .then(async res => {
        if (res.data.success) {
          dispatch(updateChats(res?.data?.chat));

          dispatch(
            setSingleChat({
              ...res?.data?.chat,
              membersCount: checked.length,
              unreadCount: 0,
              myData: {
                user: user?._id,
                isFavourite: false,
                isBlocked: false,
                role: 'owner',
                mute: {
                  isMuted: false,
                },
              },
            }),
          );
          setChatInfo(null);
          navigation.navigate('MessageScreen', {animationEnabled: false});
          toggleAddMembersModal();
          toggleCreateCrowdModal();
          loadChats();
        }
      })
      .catch((err: any) => {
        console.log(err.response.data);
        // if (err.response && err.response.data) {
        //   // showAlert({
        //   //   title: 'Error',
        //   //   type: 'error',
        //   //   message: err?.response?.data?.error,
        //   // });
        // } else {
        //   // showAlert({
        //   //   title: 'Error',
        //   //   type: 'error',
        //   //   message: 'An unexpected error occurred. Please try again.',
        //   // });
        // }
      });
  };
  const renderItem = ({item}: {item: User}) => {
    return (
      <View style={styles.invitedMemberContainer} key={item._id}>
        <View style={styles.nameProfile}>
          <Image
            source={
              item?.profilePicture
                ? {uri: item.profilePicture}
                : Images.DEFAULT_IMAGE
            }
            style={styles.checkedImage}
          />
          <Text numberOfLines={1} style={styles.profileNameText}>
            {item?.fullName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setChecked(pre => [...pre.filter(i => i._id !== item._id)]);
          }}>
          <BinIcon color={Colors.Red} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Modal
      avoidKeyboard={true}
      isVisible={isCreateCrowdModalVisible}
      style={{paddingTop: top / 2}}>
      <View style={styles.container}>
        <ModalBackAndCrossButton
          toggleModal={() => {
            toggleCreateCrowdModal();
            setChatInfo(null);
          }}
        />
        {!isAddMembersModalVisible && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.subContainer}>
              <View style={styles.headerContainer}>
                <CrowdIcon />
                <Text style={styles.headerText}>Create Crowd</Text>
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
                  placeholder={'Write crowd name'}
                  value={chatInfo?.name}
                  onChangeText={text =>
                    setChatInfo(pre => ({...pre!, name: text}))
                  }
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Crowd Description</Text>
                <TextInput
                  keyboardAppearance={theme()}
                  style={[styles.textAreaInput]}
                  multiline={true}
                  onChangeText={text =>
                    setChatInfo(pre => ({...pre!, description: text}))
                  }
                  value={chatInfo?.description}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={'Write crowd description'}
                />
              </View>
              <TouchableOpacity
                onPress={toggleAddMembersModal}
                style={styles.selectMemberContainer}>
                <Text style={styles.selectMemberBtnText}>
                  {(checked?.length ?? 0) > 0
                    ? 'Change Selection'
                    : 'Select Members'}
                </Text>
              </TouchableOpacity>
              <FlatList
                data={checked}
                renderItem={renderItem}
                nestedScrollEnabled
                contentContainerStyle={{marginBottom: checked.length ? 10 : 0}}
              />
              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Crowd Type</Text>
                <CustomDropDown
                  options={options}
                  type={'Private'}
                  setState={value => {
                    setChatInfo(pre => ({
                      ...pre!,
                      isPublic: value === 'Public' ? true : false,
                    }));
                  }}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Read Only</Text>
                <CustomDropDown
                  options={modeOption}
                  type={'No'}
                  setState={value => {
                    setChatInfo(pre => ({
                      ...pre!,
                      isReadOnly: value === 'Yes' ? true : false,
                    }));
                  }}
                />
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  marginBottom: responsiveScreenHeight(2),
                  borderBottomColor: Colors.BorderColor,
                }}
              />
              <View style={styles.buttonContainer}>
                <ModalCustomButton
                  toggleModal={toggleCreateCrowdModal}
                  textColor={Colors.Primary}
                  backgroundColor={Colors.PrimaryOpacityColor}
                  buttonText="Cancel"
                />
                <ModalCustomButton
                  toggleModal={() => {
                    handleCreateCrowd();
                  }}
                  textColor={
                    !chatInfo?.name?.trim() || !checked.length
                      ? Colors.DisablePrimaryButtonTextColor
                      : Colors.PrimaryButtonTextColor
                  }
                  backgroundColor={
                    !chatInfo?.name?.trim() || !checked.length
                      ? Colors.DisablePrimaryBackgroundColor
                      : Colors.PrimaryButtonBackgroundColor
                  }
                  buttonText="Next"
                  disable={!chatInfo?.name?.trim() || !checked.length}
                />
              </View>
            </View>
          </ScrollView>
        )}
        {isAddMembersModalVisible && (
          <CreateCrowdAddMember
            toggleAddMembersModal={() => toggleAddMembersModal()}
            isAddMembersModalVisible={isAddMembersModalVisible}
            checked={checked}
            setChecked={setChecked}
          />
        )}
      </View>
    </Modal>
  );
};

export default memo(CreateCrowdModal);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    invitedMemberContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    nameProfile: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    checkedImage: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: 100,
      backgroundColor: Colors.Primary,
    },
    profileNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      flexBasis: '75%',
    },
    selectMemberBtnText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
    },
    selectMemberContainer: {
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      borderWidth: 2,
      borderColor: Colors.Primary,
      borderRadius: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      // paddingVertical: responsiveScreenHeight(2.5),
    },
    // bottomBorder: {
    //   borderBottomWidth: 0.5,
    //   borderBottomColor: "rgba(0, 0, 0, 0.3)",
    // },
    // --------------------------
    // ----------- Crowd Name Container -----------
    // --------------------------
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
    },
    inputFieldContainer: {
      // marginBottom: responsiveScreenHeight(1),
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      flexDirection: 'row',
      backgroundColor: Colors.ModalBoxColor,
      alignItems: 'center',
      borderColor: Colors.BorderColor,
    },
    textAreaInput: {
      width: '100%',
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      fontFamily: CustomFonts.REGULAR,
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(10),
      paddingHorizontal: 15,
      maxHeight: 200,
      paddingVertical: 10,
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
      height: 50,
    },
    // --------------------------
    // ----------- Header Container -----------
    // --------------------------
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    // --------------------------
    // ----------- Main Container -----------
    // --------------------------
    container: {
      // paddingTop: responsiveScreenHeight(2),
      // paddingHorizontal: responsiveScreenWidth(4.5),
      // paddingVertical: responsiveScreenWidth(4.5),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      // maxHeight: responsiveScreenHeight(90),
      padding: 15,
    },
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
    },
    subContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: responsiveScreenWidth(80),
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
