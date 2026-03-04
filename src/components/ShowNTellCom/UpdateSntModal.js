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
import {setUpdateShowNTell} from '../../store/reducer/showNTellReducer';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import Images from '../../constants/Images';
import {formattingDate, theme} from '../../utility/commonFunction';
import RedCrossIcon from '../../assets/Icons/RedCrossIcon';
import RequireFieldStar from '../../constants/RequireFieldStar';
import SaveConfirmationModal from '../SharedComponent/SaveConfirmationModal';

export default function UpdateSntModal({
  setIsUpdateSntModalVisible,
  isSntUpdateModalVisible,
  toggleUpdateSntModal,
  item,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {eventNotification} = useSelector(state => state.calendar);
  const notifications = !eventNotification?.length
    ? [
        {
          timeBefore: 5,
          methods: ['push'],
          crowds: [],
        },
      ]
    : eventNotification;
  const [allUser, setAllUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState(item?.title);
  const [agenda, setAgenda] = useState(item?.agenda);
  const [attachments, setAttachments] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(item.users);
  const [selectedDate, setSelectedDate] = useState(item?.date); // Store the selected date
  const [selectedCustomTime, setSelectedCustomTime] = useState(
    moment(item?.date).format('hh:mm A'),
  ); // Store the selected time
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
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

  const [sntData, setSntData] = useState({});
  useEffect(() => {
    setSntData(pre => ({
      ...pre,
      title,
      agenda,
      date: formatDate(selectedDate, selectedCustomTime),
      users: selectedUsers.map(item => item._id),
    }));

    return () => {
      setSntData({});
    };
  }, [
    item?._id,
    title,
    agenda,
    selectedUsers,
    selectedDate,
    selectedCustomTime,
  ]);

  useEffect(() => {
    axiosInstance
      .post('user/filter', {query: ''})
      .then(res => {
        setUsers(
          res.data.users.filter(
            item => !selectedUsers.map(i => i._id)?.includes(item._id),
          ),
        );
        setAllUser(res.data.users);
      })
      .catch(error => {
        console.log('error snt modal', JSON.stringify(error, null, 1));
      });
  }, []);

  const handleUserSearch = text => {
    setUsers(allUser?.filter(item => item?.fullName?.includes(text)));
  };

  const [updating, setUpdating] = useState(false);
  const handleUpdateSnt = () => {
    setUpdating(true);

    axiosInstance
      .patch(`/show-tell/update/${item._id}`, {...sntData, notifications})
      .then(res => {
        // console.log("res.data", JSON.stringify(res.data, null, 1));
        dispatch(setUpdateShowNTell(res.data.item));
        toggleUpdateSntModal();
        showToast({message: 'ShowNTell updated successfully'});
      })
      .catch(error => {
        console.log(
          'To update snt',
          JSON.stringify(error.response.data, null, 1),
        );
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);

  return (
    <Modal isVisible={isSntUpdateModalVisible}>
      {saveConfirmVisible && (
        <SaveConfirmationModal
          isVisible={saveConfirmVisible}
          tittle="Unsave changes"
          description="You have unsaved changes. Do you want to continue?"
          onExitPress={() => {
            setSaveConfirmVisible(false);
            toggleUpdateSntModal();
          }}
          onContinuePress={() => {
            setSaveConfirmVisible(false);
          }}
        />
      )}
      {updating ? (
        <LoadingSmall />
      ) : (
        <View style={styles.modalContainer}>
          <View style={styles.modalTop}>
            <ModalBackAndCrossButton
              toggleModal={() => setSaveConfirmVisible(pre => !pre)}
            />
          </View>
          <ScrollView>
            <Text style={styles.modalHeading}>Update Show N Tell</Text>
            <Text style={styles.modalSubHeading}>
              Please fill out the form to update a Show and Tell.
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
                    ? `${formattingDate(selectedDate)} ${selectedCustomTime}`
                    : 'Pick a date'}
                  {/* {selectedDate && selectedCustomTime
                    ? `${moment(selectedDate).format(
                        "MMM DD, YYYY"
                      )} ${selectedCustomTime}`
                    : "Pick a date"} */}
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
                <SearchIcon />
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
                  users?.map((user, index) => (
                    <View key={index} style={styles.userContainer}>
                      <View style={styles.user}>
                        <View>
                          {user.profilePicture ? (
                            <Image
                              source={{uri: user.profilePicture}}
                              style={styles.img}
                            />
                          ) : (
                            <UserIconTwo size={50} />
                          )}
                        </View>
                        <View style={{flexBasis: '50%'}}>
                          <Text numberOfLines={1} style={styles.name}>
                            {user?.fullName}
                          </Text>
                          <Text style={styles.id}>ID: #{user.id}</Text>
                        </View>
                      </View>
                      <View>
                        {selectedUsers.find(_ => _.id === user.id) ? (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedUsers(
                                selectedUsers?.filter(i => i._id !== user._id),
                              );
                            }}
                            style={[
                              // styles.addBtn,
                              {
                                backgroundColor: Colors.LightRed,
                                borderRadius: 100,
                              },
                            ]}>
                            <CrossCircle size={30} color={Colors.Red} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedUsers(pre => [...pre, user]);
                            }}
                            style={[
                              styles.addBtn,
                              {
                                backgroundColor: Colors.PrimaryOpacityColor,
                              },
                            ]}>
                            <PlusCircleIcon size={20} color={Colors.Primary} />
                            {/* <Text style={styles.addBtnText}>Add</Text> */}
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
            <View style={{zIndex: 1}}>
              <UpdateEventNotificationContainer />
            </View>
            <View style={styles.btnArea}>
              <MyButton
                onPress={() => {
                  setSaveConfirmVisible(pre => !pre);
                }}
                title={'Cancel'}
                bg={Colors.SecondaryButtonBackgroundColor}
                colour={Colors.SecondaryButtonTextColor}
              />
              <MyButton
                onPress={handleUpdateSnt}
                title={'Update'}
                bg={Colors.PrimaryButtonBackgroundColor}
                colour={Colors.PrimaryButtonTextColor}
              />
            </View>
          </ScrollView>
        </View>
      )}

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
    },
    user: {
      flexDirection: 'row',
      gap: 20,
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
      borderRadius: 30,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
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
