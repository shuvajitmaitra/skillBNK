import React, {useEffect, useState, useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import SearchIcon from '../../../assets/Icons/SearchIcon';
import CircleIcon from '../../../assets/Icons/CircleIcon';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateChats,
  updateSingleChatMemberCount,
} from '../../../store/reducer/chatReducer';
import Loading from '../../SharedComponent/Loading';
import Images from '../../../constants/Images';
import {updateCrowdMembers} from '../../../store/reducer/chatSlice';
import debounce from 'lodash.debounce'; // Import lodash.debounce
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import {showToast} from '../../HelperFunction';
import {RootState} from '../../../types/redux/root';
import {INewUser} from '../CreateNewUser';
import {TColors} from '../../../types';
import {loadCrowdMember} from '../../../actions/apiCall';
import {TUserProfile} from '../../MockInterviewCom/ShareInterviewModal';
import {filterDuplicateUsers, theme} from '../../../utility/commonFunction';

type AddMembersProps = {
  isAddMembersModalVisible: boolean;
  toggleAddMembersModal: () => void;
};

const AddMembers = ({
  isAddMembersModalVisible,
  toggleAddMembersModal,
}: AddMembersProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {singleChat: chat} = useSelector((state: RootState) => state.chat);
  const [users, setUsers] = useState<INewUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();

  // API Call for searching users
  const searchUsers = useCallback((text: string) => {
    axiosInstance
      .get(`/chat/searchuser?query=${text}`)
      .then(res => {
        setUsers(filterDuplicateUsers(res.data.users));
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    searchUsers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced version of the searchUsers function
  const debouncedSearchUsers = useCallback(
    (text: string) => {
      debounce(() => {
        searchUsers(text);
      }, 500)();
    },
    [searchUsers],
  );

  // const debouncedSearch = useCallback(
  //   (text: string) => {
  //     debounce(() => { searchAllUser(text);}, 500)();
  //   },
  //   [searchAllUser],
  // );

  // Handle input change and trigger debounced search
  const handleInputChange = (text: string) => {
    setInputText(text);
    debouncedSearchUsers(text);
  };

  const handleAddUser = (usr: TUserProfile) => {
    setLoading(true);
    axiosInstance
      .patch(`/chat/channel/adduser/${chat?._id}`, {
        user: usr._id,
      })
      .then(res => {
        if (res.data.success) {
          dispatch(
            updateChats({...chat, membersCount: chat?.membersCount + 1}),
          );
          showToast({
            message: `${usr.fullName} added successfully`,
            // background: Colors.Primary,
            // color: Colors.PureWhite,
          });

          dispatch(updateSingleChatMemberCount('add'));
          dispatch(
            updateCrowdMembers({
              _id: Math.random().toString(),
              mute: {
                isMuted: false,
              },
              isBlocked: false,
              isFavourite: false,
              role: 'member',
              chat: chat?._id,
              user: usr,
              __v: 0,
            }),
          );
          setUsers((prev: INewUser[]) =>
            prev?.filter((item: INewUser) => item._id !== usr._id),
          );
          // toggleAddMembersModal()
          loadCrowdMember(chat?._id);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('err', err.response?.data);
        showToast({
          message: err.response?.data?.error,
          background: Colors.Primary,
          color: Colors.PureWhite,
        });
        // showAlertModal({
        //   title: 'Error!',
        //   type: 'warning',
        //   message: err.response?.data?.error || 'Something went wrong.',
        // });
      });
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isAddMembersModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          <ModalBackAndCrossButton toggleModal={toggleAddMembersModal} />
          <Text style={styles.checkedHeading}>Add Members</Text>
          <Text style={styles.addMemberDescription}>
            If you wish to add a member, kindly search and click add button.
          </Text>
          <View style={styles.topContainer}>
            <View style={styles.inputField}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={Colors.BodyText}
                onChangeText={handleInputChange} // Handle input changes here
                value={inputText}
              />
              <SearchIcon />
            </View>
          </View>
          <View>
            <Text style={styles.allContact}>All Contact</Text>
          </View>
          {loading ? (
            <Loading />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                {users?.map((usr, index) => (
                  <View style={styles.imageContainer} key={index}>
                    <View style={styles.profileContainer}>
                      <View style={{position: 'relative'}}>
                        <Image
                          style={styles.user}
                          source={
                            usr?.profilePicture
                              ? {
                                  uri: usr?.profilePicture,
                                }
                              : Images.DEFAULT_IMAGE
                          }
                        />
                        <View style={styles.smallCircle}>
                          <CircleIcon />
                        </View>
                      </View>
                      <Text style={styles.userName}>
                        {usr?.fullName.split(' ')?.length > 3
                          ? `${usr?.fullName.split(' ')[0]} ${
                              usr?.fullName.split(' ')[1]
                            }`
                          : `${usr?.fullName}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      onPress={() => handleAddUser(usr)}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default AddMembers;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    addMemberDescription: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      width: '85%',
      paddingTop: responsiveScreenHeight(1),
    },
    addButtonText: {
      padding: 10,
      backgroundColor: Colors.Primary,
      paddingHorizontal: responsiveScreenWidth(7),
      paddingVertical: responsiveScreenHeight(1),
      fontFamily: CustomFonts.REGULAR,
      color: '#ffffff',
      borderRadius: 7,
    },
    checkedText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.5),
    },
    checkedHeading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(2),
    },
    checkedImage: {
      width: responsiveScreenWidth(13),
      height: responsiveScreenWidth(13),
      marginBottom: responsiveScreenHeight(1),
      borderRadius: 100,
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    modalContainer: {
      marginTop: responsiveScreenHeight(6),
      maxHeight: responsiveScreenHeight(80),
    },
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(69.5),
    },

    btn: {
      backgroundColor: '#27ac1f',
      marginBottom: responsiveScreenHeight(3),
    },
    text: {
      alignSelf: 'center',
      paddingTop: responsiveScreenHeight(1),
      color: '#fff',
    },

    inputField: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.ModalBoxColor,

      padding: responsiveScreenWidth(1.9),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
      height: responsiveScreenHeight(5.8),
    },

    textInput: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      flex: 1,
    },

    topContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
      paddingTop: responsiveScreenHeight(1.5),
    },
    allContact: {
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1.8),
      fontFamily: CustomFonts.MEDIUM,
      fontWeight: '500',
      fontSize: responsiveScreenFontSize(2),
      marginBottom: responsiveScreenHeight(1),
    },
    userList: {
      marginTop: responsiveScreenHeight(1),
    },
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: responsiveScreenWidth(2),
      justifyContent: 'space-between',
    },
    user: {
      width: responsiveScreenWidth(6.5),
      height: responsiveScreenWidth(6.7),
      backgroundColor: Colors.LightGreen,
      resizeMode: 'cover',
      borderRadius: 100,
    },
    userName: {
      fontSize: responsiveScreenFontSize(1.9),
      fontFamily: CustomFonts.MEDIUM,
      fontWeight: '500',
      color: Colors.BodyText,
    },
    smallCircle: {
      position: 'absolute',
      right: responsiveScreenWidth(-1),
      top: responsiveScreenHeight(1.8),
      padding: 1,
    },
    profileContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      alignItems: 'center',
    },
  });
