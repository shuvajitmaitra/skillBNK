import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {TextInput} from 'react-native';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import {useTheme} from '../../context/ThemeContext';
import SearchIcon from '../../assets/Icons/SearchIcon';
import MyButton from '../AuthenticationCom/MyButton';
import CustomFonts from '../../constants/CustomFonts';
import PlusCircleIcon from '../../assets/Icons/PlusCircleIcon';
import CalenderIcon from '../../assets/Icons/CalenderIcon';
import moment from 'moment';
import axiosInstance from '../../utility/axiosInstance';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import {useDispatch, useSelector} from 'react-redux';
import FileUploader from '../SharedComponent/FileUploder';
import CrossCircle from '../../assets/Icons/CrossCircle';
import CustomTimePicker from '../SharedComponent/CustomTimePicker';
import UpdateEventNotificationContainer from '../Calendar/UpdateEventNotificationContainer';
import {showToast} from '../HelperFunction';
import {setAddShowNTell} from '../../store/reducer/showNTellReducer';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import Images from '../../constants/Images';
import {showAlertModal, theme} from '../../utility/commonFunction';
import RedCrossIcon from '../../assets/Icons/RedCrossIcon';
import RequireFieldStar from '../../constants/RequireFieldStar';
import SaveConfirmationModal from '../SharedComponent/SaveConfirmationModal';
// import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';

export default function SntModal({
  setIsSntModalVisible,
  isSntModalVisible,
  toggleSntModal,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state?.auth);
  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);
  const {eventNotification} = useSelector(state => state.calendar);
  const notifications = !eventNotification?.length
    ? [
        {
          timeBefore: 5,
          methods: ['push'],
          chatGroups: [],
        },
      ]
    : eventNotification;
  const [allUser, setAllUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); // Store the selected date
  const [selectedCustomTime, setSelectedCustomTime] = useState(''); // Store the selected time
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const clearState = () => {
    setTitle('');
    setSelectedUsers([]);
    setAgenda('');
    setAttachments([]);
    setSelectedDate('');
    setSelectedCustomTime('');
  };
  const [sntData, setSntData] = useState({});
  const [initialState, setInitialState] = useState({});

  useEffect(() => {
    setSntData({
      title,
      agenda,
      attachments,
      selectedUsers,
      selectedDate,
      selectedCustomTime,
    });
    return () => {
      setInitialState({});
      setSntData({});
    };
  }, [
    agenda,
    attachments,
    selectedCustomTime,
    selectedDate,
    selectedUsers,
    title,
  ]);
  console.log('sntData', JSON.stringify(sntData, null, 2));

  function checkChanges() {
    if (
      title.length > 0 ||
      agenda.length > 0 ||
      attachments.length > 0 ||
      selectedUsers.length > 0 ||
      selectedDate.length > 0 ||
      selectedCustomTime.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  // data = {
  //   agenda: 'dddd',
  //   attachments: [],
  //   title: 'dllldld',
  //   date: 'Sat Sep 21 2024 13:52:03 GMT+0600',
  //   notifications: [
  //     {
  //       timeBefore: '15',
  //       methods: ['inbox'],
  //       chatGroups: [],
  //     },
  //   ],
  //   users: ['662882ef82d3120019fade53', '662776ef82d3120019fa94ec'],
  // };
  function formatDate(dateStr, timeStr) {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    let date = new Date(dateStr);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date.toString();
  }
  const handleSubmit = () => {
    if (!title) {
      return showAlertModal({
        title: 'Empty Title',
        type: 'warning',
        message: 'Title field is required',
      });
    }

    if (!agenda) {
      return showAlertModal({
        title: 'Empty Agenda',
        type: 'warning',
        message: 'Agenda field is required',
      });
    }

    if (!selectedDate || !selectedCustomTime) {
      return showAlertModal({
        title: 'Empty Date/Time',
        type: 'warning',
        message: 'Date and time are required',
      });
    }
    const date = formatDate(selectedDate, selectedCustomTime);
    setIsLoading(true);
    const data = {
      title,
      agenda,
      date,
      attachments,
      users: selectedUsers.map(user => user._id),
      creator: user._id,
      reviewDetails: {mark: 0, answer: ''},
      notifications,
    };
    axiosInstance
      .post('/show-tell/add', data)
      .then(res => {
        setIsSntModalVisible(false);
        if (res.data.success) {
          dispatch(setAddShowNTell(res.data.item || {}));
          // console.log("resp", JSON.stringify(res?.data, null, 1));
          showToast({message: 'Show n Tell created successfully!'});
          clearState();
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error submitting Show n Tell', error);
        setIsLoading(false);
        showToast({message: 'Failed to create Show n Tell. Please try again.'});
      });
  };

  useEffect(() => {
    axiosInstance
      .post('/user/filter', {query: ''})
      .then(res => {
        setUsers(res.data.users);
        setAllUser(res.data.users);
      })
      .catch(error => {
        console.log('error snt modal', JSON.stringify(error, null, 1));
      });
  }, []);

  const handleUserSearch = text => {
    setUsers(allUser?.filter(item => item?.fullName?.includes(text)));
  };

  return (
    <Modal isVisible={isSntModalVisible}>
      {saveConfirmVisible && (
        <SaveConfirmationModal
          isVisible={saveConfirmVisible}
          tittle="Unsave changes"
          description="You have unsaved changes. Do you want to continue?"
          onExitPress={() => {
            setSaveConfirmVisible(false);
            toggleSntModal();
          }}
          onContinuePress={() => {
            setSaveConfirmVisible(false);
          }}
        />
      )}

      {isLoading ? (
        <LoadingSmall />
      ) : (
        <View style={styles.modalContainer}>
          <View style={styles.modalTop}>
            <ModalBackAndCrossButton
              toggleModal={() => {
                checkChanges()
                  ? setSaveConfirmVisible(pre => !pre)
                  : toggleSntModal();
              }}
            />
          </View>
          <ScrollView>
            <Text style={styles.modalHeading}>Create Show N Tell</Text>
            <Text style={styles.modalSubHeading}>
              Complete the form to add ShowNTell.
            </Text>

            <View>
              <Text style={styles.title}>
                Title
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.input}
                placeholderTextColor={Colors.BodyText}
                multiline={true}
                placeholder="Enter title"
                onChangeText={setTitle}
                value={title}
              />
            </View>
            <View>
              <Text style={styles.title}>
                Agenda
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.agendaInput}
                placeholderTextColor={Colors.BodyText}
                multiline={true}
                placeholder="Enter agenda"
                onChangeText={setAgenda}
                value={agenda}
              />
            </View>
            <View>
              <Text style={styles.title}>
                Date
                <RequireFieldStar />
              </Text>

              <TouchableOpacity
                onPress={() => setIsPickerVisible(true)}
                style={[
                  styles.input,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}>
                {/* <Text
              style={{
                paddingVertical: responsiveScreenHeight(0.5),
                fontFamily: CustomFonts.REGULAR,
                color: Colors.Heading,
              }}
            >
              {combinedDateTime
                ? moment(combinedDateTime).format("MMM DD, YYYY h:mm A")
                : "Pick a Date"}
            </Text>
            <TouchableOpacity onPress={() => showCalendar()}>
              <CalenderIcon size={18} color={Colors.BodyText} />
            </TouchableOpacity> */}
                <Text
                  style={{
                    paddingVertical: responsiveScreenHeight(0.5),
                    fontFamily: CustomFonts.REGULAR,
                    color: Colors.BodyText,
                  }}>
                  {selectedDate && selectedCustomTime
                    ? `${moment(selectedDate).format(
                        'MMM DD, YYYY',
                      )} ${selectedCustomTime}`
                    : 'Pick a date'}
                </Text>
                <View>
                  <CalenderIcon size={18} color={Colors.BodyText} />
                </View>
              </TouchableOpacity>
            </View>
            <FileUploader
              setAttachments={setAttachments}
              attachments={attachments}
            />

            <View style={styles.searchContainer}>
              <View style={styles.search}>
                <SearchIcon></SearchIcon>
                <TextInput
                  keyboardAppearance={theme()}
                  numberOfLines={1}
                  style={[styles.modalSubHeading, {width: '90%'}]}
                  placeholderTextColor={Colors.BodyText}
                  placeholder="Search for users to share"
                  onChangeText={text => handleUserSearch(text)}
                />
              </View>
              <View>
                {selectedUsers?.length > 0 && (
                  <>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View
                        // style={{
                        //   flexDirection: "row",
                        //   gap: 10,
                        //   marginTop: responsiveScreenHeight(1),
                        // }}
                        style={styles.addedContainer}>
                        {selectedUsers?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                alignItems: 'center',
                                position: 'relative',
                              }}>
                              {/* <Image
                              source={
                                item?.profilePicture
                                  ? {
                                    uri: item?.profilePicture,
                                  }
                                  // : Images.DEFAULT_IMAGE
                                 
                              }
                              style={styles.checkedImage}
                            /> */}
                              <View>
                                {item.profilePicture ? (
                                  <Image
                                    source={{uri: item.profilePicture}}
                                    style={styles.checkedImage}
                                  />
                                ) : (
                                  <UserIconTwo
                                    style={styles.checkedImage}
                                    size={50}
                                  />
                                )}
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedUsers(
                                    selectedUsers?.filter(
                                      i => i._id !== item._id,
                                    ),
                                  );
                                }}
                                activeOpacity={0.5}
                                style={{
                                  position: 'absolute',
                                  bottom: responsiveScreenHeight(1),
                                  right: responsiveScreenWidth(0),
                                }}>
                                <RedCrossIcon />
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
                  </>
                )}
              </View>
              <ScrollView nestedScrollEnabled={true}>
                {users?.length > 0 ? (
                  users?.map((item, index) => (
                    <View key={index} style={styles.userContainer}>
                      <View style={styles.user}>
                        <View>
                          {item.profilePicture ? (
                            <Image
                              source={{uri: item.profilePicture}}
                              style={styles.img}
                            />
                          ) : (
                            <UserIconTwo size={50} />
                          )}
                        </View>
                        <View style={{flexBasis: '50%'}}>
                          <Text numberOfLines={1} style={styles.name}>
                            {item?.fullName}
                          </Text>
                          <Text style={styles.id}>ID: #{item.id}</Text>
                        </View>
                      </View>
                      <View>
                        {selectedUsers.find(_ => _.id === item.id) ? (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedUsers(
                                selectedUsers?.filter(i => i._id !== item._id),
                              );
                            }}
                            style={[
                              styles.addBtn,
                              {backgroundColor: Colors.LightRed},
                            ]}>
                            <CrossCircle size={15} color={Colors.Red} />
                            <Text
                              style={[styles.addBtnText, {color: Colors.Red}]}>
                              Remove
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedUsers(pre => [...pre, item]);
                            }}
                            style={[
                              styles.addBtn,
                              {
                                backgroundColor: item?.added
                                  ? Colors.DisablePrimaryBackgroundColor
                                  : Colors.Primary,
                              },
                            ]}>
                            <PlusCircleIcon />
                            <Text style={styles.addBtnText}>Add</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text
                    style={[
                      styles.id,
                      {
                        textAlign: 'center',
                        marginTop: responsiveScreenHeight(1),
                      },
                    ]}>
                    Searched user not found.
                  </Text>
                )}
              </ScrollView>
            </View>

            <View>
              <Text style={styles.title}>Add Notification (Optional)</Text>
            </View>
            {/* <View style={styles.notification}>
          <CustomDropDown
            options={timeOptions}
            type="Select time"
            setState={setSelectedTime}
          />
          <CustomMultiSelectDropDown
            options={methodOptions}
            type="Select Method (max: 3)"
            initialSelections={selectedMethod}
            setState={setSelectedMethod}
          />
        </View> */}
            <UpdateEventNotificationContainer />
            <View style={styles.btnArea}>
              <MyButton
                onPress={() => {
                  checkChanges()
                    ? setSaveConfirmVisible(pre => !pre)
                    : toggleSntModal();
                }}
                title={'Cancel'}
                bg={Colors.SecondaryButtonBackgroundColor}
                colour={Colors.SecondaryButtonTextColor}
              />
              <MyButton
                onPress={handleSubmit}
                title={'Add'}
                bg={Colors.Primary}
                colour={Colors.PureWhite}
              />
            </View>
          </ScrollView>
        </View>
      )}
      {/* <GlobalAlertModal /> */}
      {isPickerVisible && (
        <CustomTimePicker
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
          setDate={setSelectedDate}
          setTime={setSelectedCustomTime}
          time={moment().format('hh:mm A')}
          mode={'dateTime'}
        />
      )}
    </Modal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

    modalContainer: {
      flex: 1,
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(3),
      paddingBottom: responsiveScreenHeight(1.5),
      maxHeight: responsiveScreenHeight(80),
    },
    modalBody: {
      alignSelf: 'center',
      width: responsiveScreenWidth(80),
    },
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      width: '100%',
      overflow: 'scroll',
      marginRight: responsiveScreenHeight(2),
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      marginTop: responsiveScreenWidth(3),
    },
    agendaInput: {
      color: Colors.Heading,
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      fontSize: responsiveScreenFontSize(1.8),
      borderRadius: responsiveScreenWidth(3),
      fontFamily: CustomFonts.REGULAR,
      height: responsiveScreenHeight(15),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
      textAlignVertical: 'top',
    },
    input: {
      color: Colors.Heading,
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
    },
    attachment: {
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(1),
      borderStyle: 'dashed',
      borderColor: Colors.Primary,
      borderWidth: 1.5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    attachmentText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    docPreview: {
      width: '100%',
      // backgroundColor: "red",
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexBasis: 99,
      gap: 10,
    },
    CrossCircle: {
      backgroundColor: Colors.Primary,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20,
      borderRadius: 100,
      position: 'absolute',
      top: -10,
      right: -10,
    },
    searchContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenWidth(1),
      maxHeight: responsiveScreenHeight(40),
      // height: responsiveScreenHeight(40)
    },
    search: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      paddingBottom: responsiveScreenWidth(3),
      borderBottomWidth: 1,
      borderColor: Colors.LineColor,
    },
    addedContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
      // backgroundColor: Colors.Foreground,
      marginVertical: responsiveScreenHeight(1),
    },
    checkedImage: {
      width: responsiveScreenWidth(13),
      height: responsiveScreenWidth(13),
      marginBottom: responsiveScreenHeight(1),
      borderRadius: 100,
    },
    checkedText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.5),
    },

    userContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: responsiveScreenWidth(3),
      marginBottom: responsiveScreenWidth(3),
      // maxHeight: responsiveScreenHeight(40)
      // backgroundColor: Colors.Primary,
      // marginHorizontal: 5,
    },
    user: {
      flexDirection: 'row',
      gap: 10,
    },
    img: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    name: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      flexBasis: '30%',
    },
    id: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.REGULAR,
    },
    addBtnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    addBtn: {
      paddingHorizontal: responsiveScreenWidth(1.5),
      paddingVertical: 5,
      borderRadius: 4,
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      justifyContent: 'center',
    },
    notification: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor3,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenWidth(1),
      flexDirection: 'column',
      gap: 10,
      zIndex: 3,
    },
    btnArea: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: responsiveScreenHeight(2),
      gap: 20,
    },
  });
