import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
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
import CheckIcon from '../../../assets/Icons/CheckIcon';
import UnCheckIcon from '../../../assets/Icons/UnCheckIcon';
import CircleIcon from '../../../assets/Icons/CircleIcon';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import CustomFonts from '../../../constants/CustomFonts';
import BlackCrossIcon from '../../../assets/Icons/BlackCrossIcon';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import Images from '../../../constants/Images';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import {TColors} from '../../../types';
import {filterDuplicateUsers, theme} from '../../../utility/commonFunction';
import {gGap} from '../../../constants/Sizes';
type User = {
  _id: string;
  profilePicture?: string;
  checked?: boolean;
  fullName?: string;
};
type CreateCrowdAddMemberProps = {
  isAddMembersModalVisible: boolean;
  toggleAddMembersModal: () => void;
  checked: User[];
  setChecked: Dispatch<SetStateAction<User[]>>;
};

const CreateCrowdAddMember = ({
  isAddMembersModalVisible,
  toggleAddMembersModal,
  checked,
  setChecked,
}: CreateCrowdAddMemberProps) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [users, setUsers] = useState<User[]>([]);

  const [inputText, setInputText] = useState('');
  // useEffect(() => {
  //   setChatInfo(prev => ({
  //     ...prev,
  //     users: checked.map(item => item._id),
  //   }));
  //   return () => {
  //     setChecked([]);
  //   };
  // }, [checked]);

  const handleCheckboxToggle = (userId: string) => {
    setUsers(
      users.map(user =>
        user?._id === userId ? {...user, checked: !user.checked} : user,
      ),
    );

    const userInValidUsers = checked.find(item => item._id === userId);

    if (userInValidUsers) {
      const newValidUsers = checked?.filter(item => item._id !== userId);
      setChecked(newValidUsers);
    } else {
      const userInUsers = users.find(item => item._id === userId);
      if (userInUsers) {
        setChecked(prevValidUsers => [...prevValidUsers, userInUsers]);
      }
    }
  };

  const handleUncheck = (id: string) => {
    const newValidUsers = checked?.filter(item => item._id !== id);
    setChecked(newValidUsers);
  };

  useEffect(() => {
    axiosInstance
      .get(`/chat/searchuser?query=${inputText}`)
      .then(res => {
        setUsers(filterDuplicateUsers(res?.data?.users));
      })
      .then(err => {
        console.log(err);
      });
  }, [inputText]);

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isAddMembersModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          <ModalBackAndCrossButton
            toggleModal={() => toggleAddMembersModal()}
          />
          <Text style={styles.checkedHeading}>Add Members</Text>
          <Text style={styles.Description}>
            If you wish to add member, kindly search and make selection.
          </Text>

          <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              padding: gGap(10),
              paddingVertical: gGap(2),
              backgroundColor: Colors.Foreground,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
              borderRadius: gGap(8),
              marginTop: gGap(10),
            }}>
            <TextInput
              keyboardAppearance={theme()}
              style={styles.textInput}
              placeholder="Search..."
              placeholderTextColor={Colors.BodyText}
              onChangeText={text => setInputText(text)}
              value={inputText}
            />
            <View style={{position: 'absolute', right: gGap(10)}}>
              <SearchIcon />
            </View>
          </View>
          <View style={styles.topContainer}>
            {/* search */}

            {checked?.length > 0 && (
              <>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      marginTop: responsiveScreenHeight(1),
                    }}>
                    {checked?.map((item, index) => (
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
                          <Image
                            source={
                              item?.profilePicture
                                ? {
                                    uri: item?.profilePicture,
                                  }
                                : Images.DEFAULT_IMAGE
                            }
                            style={styles.checkedImage}
                          />
                          <TouchableOpacity
                            onPress={() => handleUncheck(item?._id)}
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
                          {item?.fullName &&
                          item?.fullName?.split(' ')?.length > 2
                            ? `${item?.fullName.split(' ')[0]}`
                            : `${item?.fullName}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
                <TouchableOpacity
                  activeOpacity={0.3}
                  disabled={checked.length <= 1}
                  onPress={() => toggleAddMembersModal()}>
                  <Text
                    style={[
                      styles.addButtonText,
                      checked.length <= 1 && {
                        backgroundColor: Colors.DisablePrimaryBackgroundColor,
                        color: Colors.DisablePrimaryButtonTextColor,
                      },
                    ]}>
                    Next
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {users.length ? (
            <View>
              <Text style={styles.allContact}>All Contacts</Text>
            </View>
          ) : (
            <NoDataAvailable />
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {/* Show User List*/}
              {users?.map((user, index) => {
                return (
                  <View style={styles.imageContainer} key={index}>
                    <View style={styles.profileContainer}>
                      <View style={{position: 'relative'}}>
                        <Image
                          style={styles.user}
                          source={
                            user?.profilePicture
                              ? {
                                  uri: user?.profilePicture,
                                }
                              : Images.DEFAULT_IMAGE
                          }
                        />
                        <View style={styles.smallCircle}>
                          <CircleIcon />
                        </View>
                      </View>
                      <Text style={styles.userName}>
                        {user?.fullName &&
                        user?.fullName?.split(' ')?.length > 3
                          ? `${user?.fullName.split(' ')[0]}  ${
                              user?.fullName.split(' ')[1]
                            }`
                          : `${user?.fullName}`}
                      </Text>
                    </View>
                    {/* Show Check box icon by help of svg */}
                    <TouchableOpacity
                      onPress={() => handleCheckboxToggle(user?._id)}>
                      {checked.find(item => item._id === user._id) ? (
                        <CheckIcon color={Colors.Primary} />
                      ) : (
                        <UnCheckIcon color={Colors.Primary} />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default CreateCrowdAddMember;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    Description: {
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
      backgroundColor: Colors.Background_color,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
    },
    modalContainer: {
      // marginTop: responsiveScreenHeight(6),
    },
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
      padding: responsiveScreenWidth(1.9),
      marginTop: responsiveScreenHeight(1),

      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(5.8),
      marginBottom: responsiveScreenHeight(3),
    },

    textInput: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
    },

    topContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
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
