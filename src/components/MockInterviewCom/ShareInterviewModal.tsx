import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import axiosInstance from '../../utility/axiosInstance';
import {showToast} from '../HelperFunction';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import {useTheme} from '../../context/ThemeContext';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import ReactNativeModal from 'react-native-modal';
import Loading from '../SharedComponent/Loading';
// import Divider from '../SharedComponent/Divider';
import SearchIcon from '../../assets/Icons/SearchIcon';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import {TColors} from '../../types';
import MyButton from '../AuthenticationCom/MyButton';
import CustomFonts from '../../constants/CustomFonts';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {toastConfig} from '../../constants/ToastConfig';
import lodash from 'lodash';
import {theme} from '../../utility/commonFunction';
import {borderRadius, gGap} from '../../constants/Sizes';

interface Phone {
  isVerified: boolean;
  number: string;
  countryCode: string;
}

export interface TUserProfile {
  phone: Phone | string;
  profilePicture: string;
  lastName: string;
  _id: string;
  id?: number;
  email: string;
  firstName: string;
  createdAt: string; // Alternatively, Date if you plan to convert it
  lastActive: string; // Alternatively, Date if you plan to convert it
  fullName: string;
  // Use this property to mark the user as added
  canDelete?: boolean;
}

interface ShareInterviewModalProps {
  toggleShareModal?: () => void;
  isShareModalVisible?: boolean;
  interview?: any;
}

export default function ShareInterviewModal({
  toggleShareModal = () => {},
  isShareModalVisible = false,
  interview = null,
}: ShareInterviewModalProps) {
  const [searchName, setSearchName] = useState('');
  const {user} = useSelector((state: RootState) => state.auth);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isUserFetching, setIsUserFetching] = useState(false);
  // Removed addedUsers state
  const [fetchedUsers, setFetchedUsers] = useState<TUserProfile[]>([]);

  // Mark a user as “added” by updating fetchedUsers
  const handleAddUser = (item: TUserProfile) => {
    setFetchedUsers(prev =>
      prev.map(u => (u._id === item._id ? {...u, canDelete: true} : u)),
    );
  };

  // Instead of checking against a separate addedUsers list, check the user’s property
  const isUserAdded = (item: TUserProfile) => {
    return item.canDelete === true;
  };

  // console.log('interview', JSON.stringify(interview, null, 2));

  useEffect(() => {
    const searchParams = {
      program: '',
      session: '',
      query: searchName,
    };

    const fetchUsers = (options: any) => {
      setIsUserFetching(true);
      axiosInstance
        .post('/user/filter', options)
        .then(res => {
          // Filter out the current logged in user
          const uniqueUsers = lodash.uniqWith(res.data.users, lodash.isEqual);
          setFetchedUsers(
            uniqueUsers.filter((item: TUserProfile) => item._id !== user._id) ||
              [],
          );
          setIsUserFetching(false);
        })
        .catch(err => {
          setIsUserFetching(false);
          console.log(err);
        });
    };

    fetchUsers(searchParams);
  }, [searchName, user._id]);

  // Use the marked users from fetchedUsers when sharing
  const handleShare = () => {
    setIsUserFetching(true);
    const data = {
      users: fetchedUsers
        .filter((u: TUserProfile) => u.canDelete)
        .map((u: TUserProfile) => u._id),
    };
    console.log('Handle Search');
    axiosInstance
      .patch(`/interview/share/${interview._id}`, data)
      .then(res => {
        showToast({message: 'Shared successfully'});
        if (res.data.success) {
          toggleShareModal();
        }
        setIsUserFetching(false);
      })
      .catch(err => {
        setIsUserFetching(false);
        console.log(
          'err.response.data',
          JSON.stringify(err.response.data, null, 2),
        );
        showToast({message: err.response.data.error});
      });
  };

  return (
    <ReactNativeModal isVisible={isShareModalVisible}>
      <View style={styles.modalContainer}>
        <ModalBackAndCrossButton toggleModal={toggleShareModal} />
        <Text style={styles.heading}>Share Interview</Text>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardAppearance={theme()}
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={Colors.BodyText}
            value={searchName}
            onChangeText={text => setSearchName(text)}
            autoCorrect={false}
          />
          <SearchIcon />
        </View>
        {/* <Divider marginBottom={0.00001} /> */}
        <View style={styles.searchContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {isUserFetching ? (
              <Loading backgroundColor="transparent" />
            ) : (
              <View>
                {fetchedUsers?.length > 0 ? (
                  fetchedUsers.map((item: TUserProfile, index) => (
                    <View style={styles.userContainer} key={index}>
                      <View style={styles.user}>
                        <View style={{position: 'relative'}}>
                          {item.profilePicture ? (
                            <Image
                              source={{uri: item.profilePicture}}
                              style={styles.img}
                            />
                          ) : (
                            <UserIconTwo size={40} />
                          )}
                        </View>
                        <View>
                          <Text style={styles.name}>{item.fullName}</Text>
                          <Text style={styles.id}>ID: {item.id}</Text>
                        </View>
                      </View>
                      {isUserAdded(item) ? (
                        <TouchableOpacity
                          style={styles.addedBtn}
                          activeOpacity={0.3}
                          disabled={true}>
                          <Text style={styles.addedBtnText}>Added</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.addBtn}
                          activeOpacity={0.3}
                          onPress={() => handleAddUser(item)}>
                          <Text style={styles.addBtnText}>Add</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <NoDataAvailable height={20} />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.btnContainer}>
          <MyButton
            onPress={toggleShareModal}
            title={'Cancel'}
            bg={Colors.PrimaryOpacityColor}
            colour={Colors.Primary}
            flex={0.5}
            height={responsiveScreenHeight(5)}
          />
          <MyButton
            onPress={handleShare}
            title={'Share'}
            bg={Colors.Primary}
            colour={Colors.PureWhite}
            flex={0.5}
            height={responsiveScreenHeight(5)}
          />
        </View>
      </View>
      <GlobalAlertModal />
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    dCenterBet: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
      paddingBottom: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
    },
    modalTop: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: borderRadius.default,
      padding: gGap(10),
      gap: gGap(10),
    },
    heading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    searchContainer: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: gGap(10),
      borderRadius: borderRadius.default,
      height: responsiveScreenHeight(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenHeight(2),
    },
    input: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      minHeight: responsiveScreenHeight(5),
    },
    input2: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      flex: 1,
      zIndex: -2,
    },
    searchBtn: {
      width: responsiveScreenWidth(38.5),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenWidth(1.5),
      borderRadius: responsiveScreenWidth(1.5),
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      zIndex: -3,
    },
    btnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
      textAlign: 'center',
    },
    userContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenWidth(3),
      marginBottom: responsiveScreenWidth(3),
      justifyContent: 'space-between',
    },
    user: {
      flexDirection: 'row',
      gap: 8,
    },
    img: {
      height: 40,
      width: 40,
      borderRadius: 50,
    },
    name: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      width: responsiveScreenWidth(50),
    },
    id: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.REGULAR,
    },
    addBtnText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    addBtn: {
      paddingHorizontal: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      height: responsiveScreenHeight(4),
    },
    addedBtnText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Primary,
    },
    addedBtn: {
      paddingHorizontal: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      height: responsiveScreenHeight(4),
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    noUsersText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textAlign: 'center',
      marginVertical: responsiveScreenHeight(2),
    },
  });
