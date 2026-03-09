// InviteMemberModalV2.tsx
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import CustomFonts from '../../../constants/CustomFonts';
import BlackCrossIcon from '../../../assets/Icons/BlackCrossIcon';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {useSelector} from 'react-redux';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import Images from '../../../constants/Images';
import {RootState} from '../../../types/redux/root';
import {IEventUser, ISchedule} from '../../../types/calendar/event';
import {IAvailability} from '../../../types/calendar/availabilities';
import {filterDuplicateUsers, theme} from '../../../utility/commonFunction';
import {IInvitation} from '../AddNewEventModalV2';
import {TColors} from '../../../types';
import FindTimeModalV2 from './FindTimeModalV2';
import {gGap} from '../../../constants/Sizes';

interface InviteMemberModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  date: string; // Expected to be a day string (e.g. "Monday")
  setInvitations: Dispatch<SetStateAction<any>>;
  invitations: any;
  handleUncheck: (id: string, action?: string) => void;
  from?: string;
}

const InviteMemberModalV2: React.FC<InviteMemberModalProps> = ({
  isModalVisible,
  toggleModal,
  date,
  setInvitations,
  invitations = [],
  handleUncheck,
  from,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [users, setUsers] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [schedule, setSchedule] = useState<ISchedule>();
  const {onlineUsersObj} = useSelector((state: RootState) => state.chat);
  const [availabilityData, setAvailabilityData] = useState<
    IAvailability[] | null
  >(null);

  const {event} = useSelector((state: RootState) => state.calendar); // Adjust type if available
  const [findTimeModalVisible, setFindTimeModalVisible] =
    useState<boolean>(false);
  const handleCheckboxToggle = (userId: string, action?: string) => {
    if (from === 'add') {
      setUsers(prev =>
        prev.map(item =>
          item?._id === userId
            ? {...item, invitations: !item?.invitations}
            : item,
        ),
      );

      const userInInvitations = invitations.find(
        (item: IInvitation) => item?._id === userId,
      );

      if (userInInvitations) {
        const newInvitations = invitations.filter(
          (item: IInvitation) => item?._id !== userId,
        );
        setInvitations(newInvitations);
      } else {
        const userInUsers = users.find(item => item?._id === userId);
        if (userInUsers) {
          setInvitations((prev: IEventUser[]) => {
            return [...(prev || []), userInUsers as IEventUser];
          });
        } else {
          console.error('User not found in users list');
        }
      }
      return;
    }
    axiosInstance
      .patch(`/calendar/event/invitation/${event._id}`, {action, user: userId})
      .then(res => {
        if (res.data.success) {
          setUsers(prev =>
            prev.map(item =>
              item?._id === userId
                ? {...item, invitations: !item?.invitations}
                : item,
            ),
          );

          const userInInvitations = invitations.find(
            (item: IInvitation) => item?._id === userId,
          );
          if (userInInvitations) {
            const newInvitations = invitations.filter(
              (item: IInvitation) => item._id !== userId,
            );
            setInvitations(newInvitations);
          } else {
            const userInUsers = users.find(item => item._id === userId);
            if (userInUsers) {
              setInvitations((prev: IEventUser[]) => {
                return [...(prev || []), userInUsers as IEventUser];
              });
            }
          }
        }
      })
      .catch(error => {
        console.log(
          'error from calendar event invitation',
          JSON.stringify(error, null, 1),
        );
      });
  };

  useEffect(() => {
    axiosInstance
      .get(`/chat/searchuser?query=${inputText}`)
      .then(res => {
        setUsers(filterDuplicateUsers(res?.data?.users));
      })
      .catch(err => {
        console.log('err from searchuser?query', JSON.stringify(err, null, 1));
      });
  }, [inputText]);

  const handleFindTime = useCallback(
    (userId: string) => {
      axiosInstance
        .get(`calendar/schedule/find/${userId}`)
        .then(res => {
          if (res.data.success) {
            setAvailabilityData(res.data.schedule.availability);
            setSchedule({
              data: res?.data?.schedule?.availability?.find(
                (item: IAvailability) => item.wday === date.toLowerCase(),
              ),
              userId,
            });
          }
        })
        .catch(error => {
          console.log('error.....', JSON.stringify(error, null, 1));
          setSchedule(undefined);
        });
      setFindTimeModalVisible(true);
    },
    [date],
  );

  const handleInviteButton = () => {
    setInvitations(invitations);
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}
      statusBarTranslucent>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          {/* Back and Cross Button */}
          <ModalBackAndCrossButton toggleModal={toggleModal} />
          <Text style={styles.checkedHeading}>Invitations</Text>
          <Text style={styles.Description}>
            If you wish to invite someone, kindly search and make selection.
          </Text>
          <View style={styles.inputField}>
            <TextInput
              keyboardAppearance={theme()}
              style={styles.textInput}
              placeholder="Search"
              placeholderTextColor={Colors.BodyText}
              onChangeText={text => setInputText(text)}
              value={inputText}
              autoCorrect={false}
              autoComplete={'name'}
            />
            <SearchIcon />
          </View>
          <View style={styles.topContainer}>
            {invitations?.length > 0 && (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      marginTop: responsiveScreenHeight(1),
                    }}>
                    {invitations?.map((item: IInvitation, index: number) => (
                      <View key={index} style={{alignItems: 'center'}}>
                        <View
                          style={{alignItems: 'center', position: 'relative'}}>
                          <Image
                            source={
                              item?.profilePicture
                                ? {uri: item?.profilePicture}
                                : Images.DEFAULT_IMAGE
                            }
                            style={styles.checkedImage}
                          />
                          <TouchableOpacity
                            onPress={() => handleUncheck(item?._id, 'remove')}
                            activeOpacity={0.5}
                            style={{
                              position: 'absolute',
                              bottom: responsiveScreenHeight(1),
                              right: responsiveScreenWidth(0),
                            }}>
                            <BlackCrossIcon />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.checkedText}>
                          {item?.fullName?.split(' ')?.length > 2
                            ? `${item?.fullName.split(' ')[0]}`
                            : `${item?.fullName}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={() => {
                    toggleModal();
                    if (from === 'add') {
                      handleInviteButton();
                    }
                  }}
                  style={{
                    borderRadius: 4,
                    padding: 10,
                    backgroundColor: Colors.Primary,
                    paddingHorizontal: responsiveScreenWidth(7),
                    paddingVertical: responsiveScreenHeight(1),
                  }}>
                  <Text style={styles.addButtonText}>Invite</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.allContact}>All Contact</Text>
          <ScrollView showsHorizontalScrollIndicator={false}>
            {users.length ? (
              users.map((user, index) => (
                <View style={styles.imageContainer} key={index}>
                  <View style={styles.profileContainer}>
                    <View style={{position: 'relative'}}>
                      <Image
                        style={styles.user}
                        source={
                          user?.profilePicture
                            ? {uri: user?.profilePicture}
                            : Images.DEFAULT_IMAGE
                        }
                      />
                      <View
                        style={[
                          styles.smallCircle,
                          {
                            backgroundColor: onlineUsersObj[user._id]
                              ? Colors.SuccessColor
                              : Colors.Gray2,
                          },
                        ]}
                      />
                    </View>
                    <Text numberOfLines={1} style={styles.userName}>
                      {user?.fullName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => handleFindTime(user._id)}
                      style={styles.findButtonContainer}>
                      <Text style={styles.findButtonText}>Find Time</Text>
                    </TouchableOpacity>
                    {invitations?.find(
                      (item: IInvitation) => item._id === user._id,
                    ) ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleCheckboxToggle(user?._id, 'remove')
                        }
                        style={styles.removeButton}>
                        <Text style={styles.findButtonText}>Remove</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleCheckboxToggle(user?._id, 'add')}
                        style={styles.findButtonContainer}>
                        <Text style={styles.findButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <NoDataAvailable />
            )}
          </ScrollView>
        </View>
        <FindTimeModalV2
          handleCheckboxToggle={handleCheckboxToggle}
          isModalVisible={findTimeModalVisible}
          schedule={schedule}
          toggleModal={setFindTimeModalVisible}
          availabilityData={availabilityData}
        />
      </View>
    </ReactNativeModal>
  );
};

export default InviteMemberModalV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    findButtonText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.3),
      color: Colors.PureWhite,
    },
    findButtonContainer: {
      backgroundColor: Colors.Primary,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 4,
    },
    removeButton: {
      backgroundColor: Colors.Red,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 4,
    },
    Description: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      width: '85%',
      paddingTop: responsiveScreenHeight(1),
    },
    addButtonText: {
      fontFamily: CustomFonts.REGULAR,
      color: '#ffffff',
    },
    checkedText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
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
      backgroundColor: Colors.Background_color,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    modalContainer: {},
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(80),
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
      backgroundColor: Colors.ScreenBoxColor,
      marginTop: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(1),
    },
    textInput: {
      paddingVertical: responsiveScreenWidth(1.9),
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      flex: 1,
    },
    topContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
    },
    allContact: {
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1),
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
      flex: 1,
      gap: gGap(5),
    },
    user: {
      width: responsiveScreenWidth(6.5),
      height: responsiveScreenWidth(6.7),
      backgroundColor: Colors.LightGreen,
      resizeMode: 'cover',
      borderRadius: 100,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    userName: {
      fontSize: responsiveScreenFontSize(1.9),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      textTransform: 'capitalize',
      flex: 1,
    },
    smallCircle: {
      position: 'absolute',
      right: responsiveScreenWidth(-1),
      top: responsiveScreenHeight(1.8),
      padding: 1,
      borderRadius: 100,
      height: 10,
      width: 10,
    },
    profileContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      alignItems: 'center',
      flex: 1,
    },
  });
