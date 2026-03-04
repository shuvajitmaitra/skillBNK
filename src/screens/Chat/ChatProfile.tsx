import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import ImageViewing from 'react-native-image-viewing';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {
  updateChats,
  updateSingleChatProfile,
} from '../../store/reducer/chatReducer';
import ModalNameStatus from '../../components/ChatCom/Modal/ModalNameStatus';
import MembersIcon from '../../assets/Icons/MembersIcon';
import PlusCircle from '../../assets/Icons/PlusCircle';
import AddMembers from '../../components/ChatCom/Modal/AddMembers';
import LeaveCrowdModal from '../../components/ChatCom/Modal/LeaveCrowdModal';
import CustomFonts from '../../constants/CustomFonts';
import CameraIcon from '../../assets/Icons/CameraIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GlobalBackButton from '../../components/SharedComponent/GlobalBackButton';
import {
  setCrowdMembers,
  setNMData,
  updateCMedia,
  updateMQ,
} from '../../store/reducer/chatSlice';
import BlockIcon from '../../assets/Icons/BlockIcon';
import BinIcon from '../../assets/Icons/BinIcon';
import MemberManageSheet from '../../components/ChatCom/Sheet/MemberManageSheet';
import {fetchMembers, handleArchive} from '../../actions/apiCall';
import {
  ImageLibraryOptions,
  Asset,
  launchImageLibrary,
} from 'react-native-image-picker';
import GroupModalTabView from '../../components/ChatCom/Modal/GroupModalTabView';
import CrowdIcon from '../../assets/Icons/CrowedIcon';
import AiBotIcon from '../../assets/Icons/AiBotIcon';
import UserIcon from '../../assets/Icons/UserIcon';
import AddUsers from '../../assets/Icons/AddUser';
import VolumeMute from '../../assets/Icons/VolumeMute';
import EditIcon from '../../assets/Icons/EditIcon';
import UpdateCrowdModal from '../../components/ChatCom/Modal/UpdateCrowdModal';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '../../types/redux/root';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {TColors} from '../../types';
import NotifyBell from '../../assets/Icons/NotifyBell';
// import BellOffIcon from '../../assets/Icons/BellOffIcon';
import NotificationModal from '../../components/ChatCom/Modal/NotificationModal';
import {openConfirmModal, theme} from '../../utility/commonFunction';
import Divider2 from '../../components/SharedComponent/Divider2';
import {showToast} from '../../components/HelperFunction';
import AnimatedSwitchV1 from '../../components/SharedComponent/AnimatedSwitchV1';

const FIcon = Feather as any;
const AIcon = AntDesign as any;

const ChatProfile = () => {
  const {top} = useSafeAreaInsets();
  const {singleChat: chat} = useSelector((state: RootState) => state.chat);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {selectedMember, NMData, crowdMembers} = useSelector(
    (state: RootState) => state.chatSlice,
  );
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [ImageView, setImageView] = useState<{uri: string}[] | null>(null);
  const [blockConfirm, setBlockConfirm] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [roleClicked, setRoleClicked] = useState(false);
  const [muteClicked, setMuteClicked] = useState(false);

  const [isUpdateCrowdModalVisible, setUpdateCrowdModalVisible] =
    useState(false);

  const toggleUpdateCrowdModal = () => {
    setUpdateCrowdModalVisible(!isUpdateCrowdModalVisible);
  };

  const [isLeaveCrowdModalVisible, setLeaveCrowdModalVisible] = useState(false);
  const toggleLeaveCrowdModal = () => {
    setLeaveCrowdModalVisible(!isLeaveCrowdModalVisible);
  };

  const [isAddMembersModalVisible, setAddMembersModalVisible] = useState(false);
  const toggleAddMembersModal = () => {
    setAddMembersModalVisible(!isAddMembersModalVisible);
  };

  // --------------------------
  // ----------- Report Modal Function -----------
  // --------------------------
  // const [isReportMembersModalVisible, setReportMembersModalVisible] =
  //   useState(false);
  // const toggleReportMembersModal = () => {
  //   setReportMembersModalVisible(!isReportMembersModalVisible);
  // };
  useEffect(() => {
    chat.isChannel && fetchMembers({chatId: chat?._id, limit: 5, page: 1});
    return () => {
      console.log('State Clear');

      dispatch(setCrowdMembers([]));
      dispatch(updateCMedia(null));
      dispatch(updateMQ(null));
    };
  }, [chat?._id, chat?.isChannel, dispatch]);

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 700,
      maxHeight: 700,
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        uploadImagesAndSend(response?.assets || []);
      }
    });
  };

  const uploadImagesAndSend = async (selectedImages: Asset[]) => {
    setIsLoading(true);
    try {
      const uploadedFiles = await Promise.all(
        selectedImages.map(async item => {
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.fileName || 'uploaded_image',
            type: item.type,
          });

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        }),
      );

      updateChannelImage(uploadedFiles[0].location);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to upload images.');
    }
  };
  const updateChannelImage = async (avatar: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        `chat/channel/update/${chat?._id}`,
        {avatar},
      );
      if (res.data.success) {
        showToast({
          message: 'Crowd profile image updated.',
        });
      }
      dispatch(updateChats(res?.data?.channel));
      dispatch(updateSingleChatProfile(res?.data?.channel));
    } catch (error: any) {
      console.log(
        'Error updating channel image:',
        JSON.stringify(error.response.data, null, 1),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator color={Colors.Primary} size={40} />
  //     </View>
  //   );
  // }

  const option = [
    {
      label: 'Role',
      icon: <AddUsers size={23} />,
      function: () => setRoleClicked(true),
    },
    {
      label: selectedMember?.mute?.isMuted ? 'Unmute user' : 'Mute user',
      icon: <VolumeMute />,
      function: () => setMuteClicked(true),
    },
    {
      label: selectedMember?.isBlocked ? 'Unblock user' : 'Block user',
      icon: <BlockIcon />,
      function: () => setBlockConfirm(true),
    },
    {
      label: 'Remove user',
      icon: <BinIcon />,
      function: () => setRemoveConfirm(true),
    },
  ];

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <GlobalBackButton />

      <MemberManageSheet
        option={option}
        blockConfirm={blockConfirm}
        setBlockConfirm={setBlockConfirm}
        setRemoveConfirm={setRemoveConfirm}
        removeConfirm={removeConfirm}
        roleClicked={roleClicked}
        setRoleClicked={setRoleClicked}
        role={selectedMember?.role}
        muteClicked={muteClicked}
        setMuteClicked={setMuteClicked}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
              if (!chat?.avatar && !chat?.otherUser?.profilePicture) {
                return showToast({message: 'No profile image uploaded yet.'});
              }
              setImageView([
                {
                  uri: chat?.avatar || chat?.otherUser?.profilePicture,
                },
              ]);
            }}>
            {chat?.isChannel && chat?.avatar ? (
              <>
                {isLoading ? (
                  <View
                    style={[styles.profileImage, {justifyContent: 'center'}]}>
                    <ActivityIndicator color={Colors.Primary} size={40} />
                  </View>
                ) : (
                  <Image
                    style={styles.profileImage}
                    source={{uri: chat?.avatar}}
                  />
                )}
              </>
            ) : chat?.isChannel && !chat?.avatar ? (
              <View style={styles.iconContainer}>
                <CrowdIcon color={Colors.BodyTextOpacity} size={200} />
              </View>
            ) : chat?.otherUser?.type === 'bot' ? (
              <View style={styles.iconContainer}>
                <AiBotIcon color={Colors.BodyTextOpacity} size={200} />
              </View>
            ) : !chat?.isChannel && chat?.otherUser?.profilePicture ? (
              <Image
                style={styles.profileImage}
                source={
                  chat?.otherUser?.profilePicture
                    ? {uri: chat?.otherUser.profilePicture}
                    : require('../../assets/Images/user.png')
                }
              />
            ) : (
              <View style={styles.iconContainer}>
                <UserIcon color={Colors.BodyTextOpacity} size={200} />
              </View>
            )}
          </TouchableOpacity>
          {chat?.isChannel &&
            (chat?.myData?.role === 'owner' ||
              chat?.myData?.role === 'admin' ||
              chat?.myData?.role === 'moderator') && (
              <TouchableOpacity
                onPress={() => {
                  selectImage();
                }}
                style={styles.cameraIcon}>
                <CameraIcon size={23} color={Colors.PureWhite} />
              </TouchableOpacity>
            )}
          {chat?.isChannel &&
            (chat?.myData?.role === 'owner' ||
              chat?.myData?.role === 'admin' ||
              chat?.myData?.role === 'moderator') && (
              <TouchableOpacity
                onPress={() => {
                  toggleUpdateCrowdModal();
                }}
                style={styles.EditProfileContainer}>
                <EditIcon />
              </TouchableOpacity>
            )}
        </View>

        {/* Name and Status */}
        <ModalNameStatus />

        {/* Member Section */}
        {chat?.isChannel && (
          <View style={styles.memberContainer}>
            <View style={styles.memberNumberContainer}>
              <MembersIcon />
              <Text style={styles.memberNumberText}>
                {chat?.membersCount || crowdMembers?.length || 0} Members
              </Text>
            </View>
            {(chat?.myData?.role === 'owner' ||
              chat?.myData?.role === 'admin') && (
              <TouchableOpacity
                onPress={toggleAddMembersModal}
                style={styles.addMemberContainer}>
                <PlusCircle />
                <Text style={styles.addMemberText}>Add member</Text>
              </TouchableOpacity>
            )}
            {isAddMembersModalVisible && (
              <AddMembers
                toggleAddMembersModal={toggleAddMembersModal}
                isAddMembersModalVisible={isAddMembersModalVisible}
              />
            )}
          </View>
        )}
        <View style={styles.notificationContainer}>
          <View style={styles.notificationSubContainer}>
            <NotifyBell />
            <Text style={styles.notificationText}>Notification</Text>
          </View>
          {/* <Switch
            trackColor={{false: '#767577', true: Colors.Primary}}
            // thumbColor={
            //   !chat?.myData?.notification?.isOn ? Colors.Primary : '#f4f3f4'
            // }

            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              dispatch(setNMData({chatId: chat?._id, ...chat?.myData}));
            }}
            value={chat?.myData?.notification?.isOn}
            style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}], marginTop: -5}} // Size modification
          /> */}
          <AnimatedSwitchV1
            onValueChange={() => {
              dispatch(setNMData({chatId: chat?._id, ...chat?.myData}));
            }}
            value={chat?.myData?.notification?.isOn}
            activeColor={Colors.Primary}
          />
        </View>

        {chat?.isChannel && (
          <>
            <Text style={styles.descriptionTitle}>Crowds Description</Text>
            <Text style={styles.descriptionText}>
              {chat?.description?.trim() || 'No description added yet...'}
            </Text>
          </>
        )}
        <Divider2 />

        <GroupModalTabView />

        {/* Action Buttons */}
        {chat?.isChannel && (
          <View style={styles.actionButtonsContainer}>
            {/* Report Button */}
            {/* <TouchableOpacity
              onPress={toggleReportMembersModal}
              style={styles.blockContainer}>
              <Feather
              name="alert-triangle"
              size={responsiveScreenFontSize(2.5)}
              color={Colors.BodyText}
            />
              <Text style={styles.containerText}>Report</Text>
            </TouchableOpacity> */}
            {/* <ReportModal
            toggleReportMembersModal={toggleReportMembersModal}
            isReportMembersModalVisible={isReportMembersModalVisible}
          /> */}

            {/* Archive Chat Button */}
            {chat?.memberScope === 'custom' && (
              <>
                {(chat?.myData?.role === 'owner' ||
                  chat?.myData?.role === 'admin' ||
                  chat?.myData?.role === 'moderator') && (
                  <TouchableOpacity
                    onPress={() =>
                      openConfirmModal({
                        title: !chat.isArchived
                          ? 'Archive Crowd!'
                          : 'Unarchive Crowd!',
                        des: `Do you want to ${
                          !chat.isArchived ? 'archive' : 'unarchive'
                        } this crowd?`,
                        func: () => {
                          handleArchive({
                            chatId: chat?._id,
                            archived: !chat?.isArchived,
                          });
                          navigation.pop(2);
                        },
                      })
                    }
                    style={styles.blockContainer}>
                    <FIcon
                      name="archive"
                      size={responsiveScreenFontSize(2.5)}
                      color={Colors.BodyText}
                    />
                    <Text style={styles.containerText}>
                      {chat?.isArchived ? 'Unarchive Crowd' : 'Archive Crowd'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Leave Chat Button */}
                <TouchableOpacity
                  onPress={toggleLeaveCrowdModal}
                  style={styles.blockContainer}>
                  <AIcon name="delete" size={25} color="rgba(244, 42, 65, 1)" />
                  <Text
                    style={[
                      styles.containerText,
                      {color: 'rgba(244, 42, 65, 1)'},
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Leave Crowd
                  </Text>
                </TouchableOpacity>
                <LeaveCrowdModal
                  toggleLeaveCrowdModal={toggleLeaveCrowdModal}
                  isLeaveCrowdModalVisible={isLeaveCrowdModalVisible}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>

      <UpdateCrowdModal
        isUpdateCrowdModalVisible={isUpdateCrowdModalVisible}
        toggleUpdateCrowdModal={toggleUpdateCrowdModal}
      />

      <ImageViewing
        images={ImageView || []} // Array of images
        imageIndex={0} // Initial image index
        visible={Boolean(ImageView)} // Visibility state
        onRequestClose={() => setImageView(null)} // Close handler
      />
      {NMData && <NotificationModal />}
    </View>
  );
};

export default ChatProfile;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    notiMainCon: {
      backgroundColor: Colors.Foreground,
      marginBottom: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    notiContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    notiText: {
      fontSize: responsiveScreenFontSize(1.9),
      fontWeight: 'bold',
      color: Colors.Heading,
    },
    listText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
    },
    header: {
      // flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.Red,
    },

    headerTitle: {
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.BOLD,
      color: Colors.Heading,
    },
    scrollContent: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(2.5),
    },
    profileImageContainer: {
      position: 'relative',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 10,
    },
    iconContainer: {
      // backgroundColor: 'red',
      height: 250,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImage: {
      height: responsiveScreenHeight(30),
      width: responsiveScreenWidth(90),
      resizeMode: 'cover',
      borderRadius: responsiveScreenHeight(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    cameraIcon: {
      position: 'absolute',
      bottom: responsiveScreenHeight(1),
      right: responsiveScreenWidth(3),
      backgroundColor: Colors.Primary,
      padding: 10,
      borderRadius: 100,
    },
    EditProfileContainer: {
      position: 'absolute',
      top: responsiveScreenHeight(1),
      right: responsiveScreenWidth(3),
      backgroundColor: Colors.Primary,
      padding: 10,
      borderRadius: 100,
    },
    notificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      // backgroundColor: 'red',
    },
    notificationSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    notificationText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
    },
    descriptionContainer: {},
    descriptionTitle: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      paddingBottom: 5,
      color: Colors.Heading,
    },
    descriptionText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      paddingBottom: 10,
    },
    separator: {
      borderBottomWidth: 0.8,
      borderColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(2.7),
      marginBottom: responsiveScreenHeight(1.5),
    },
    memberContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    memberNumberContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    memberNumberText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
    addMemberContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
    },
    addMemberText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Primary,
    },
    invitationLinkText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: '#17855F',
    },
    invitationLinkContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(2),
      // backgroundColor: 'red',
    },
    actionButtonsContainer: {
      // marginTop: responsiveScreenHeight(2),
    },
    blockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginVertical: responsiveScreenHeight(1),
    },
    containerText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
  });
