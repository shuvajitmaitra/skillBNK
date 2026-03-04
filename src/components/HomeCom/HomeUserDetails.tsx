import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import ClockIcon from '../../assets/Icons/ClockIcon';
import {RegularFonts} from '../../constants/Fonts';
import Divider from '../SharedComponent/Divider';
import EmojiIcon from '../../assets/Icons/EmojiIcon';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import {showAlertModal, theme} from '../../utility/commonFunction';
import useUserStatusData from '../../constants/UserStatusData';
import {setUserStatus} from '../../store/reducer/userStatusReducer';
import axiosInstance from '../../utility/axiosInstance';
import {setUser} from '../../store/reducer/authReducer';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {RootState} from '../../types/redux/root';
import {HomeStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TColors} from '../../types';
import {showToast} from '../HelperFunction';
const FAICon = FontAwesome6 as any;
type HomeUserDetailsProps = {
  statusSectionVisible: boolean;
  setStatusSectionVisible: Dispatch<SetStateAction<boolean>>;
};
type TStatus = {
  icon: ReactNode;
  label: string;
  value: string;
};
const HomeUserDetails = ({
  statusSectionVisible,
  setStatusSectionVisible,
}: HomeUserDetailsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const {status} = useSelector((state: RootState) => state.userStatus);
  const [statusText, setStatusText] = useState('');
  const userStatusData = useUserStatusData();
  const profileStatus = useUserStatusData(16);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleTextChange = (text: string) => {
    const lines = text.split('\n');
    // Ensure the number of lines does not exceed 4
    if (lines.length <= 4) {
      setStatusText(text);
    } else {
      // Limit to 4 lines if exceeded
      setStatusText(lines.slice(0, 4).join('\n'));
    }
  };

  // console.log("user", JSON.stringify(user, null, 1));

  const handleKeyPress = ({nativeEvent}: {nativeEvent: any}) => {
    if (nativeEvent.key === 'Enter') {
      const lines = statusText.split('\n');
      // Prevent adding a new line if the field is empty or already at 4 lines
      if (statusText.trim() === '' || lines.length >= 4) {
        return; // Do nothing, stopping Enter from adding a line
      }
    }
  };

  const toggleStatusSection = () => {
    // Configure the next layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStatusSectionVisible(!statusSectionVisible);
  };

  const handleSetStatus = (item: string) => {
    // console.log("item", JSON.stringify(userStatusData, null, 1));
    dispatch(setUserStatus(item));
    handleSetStatusText(item);
    toggleStatusSection();
  };

  //    "profileStatus": {
  //   "recurring": {
  //    "isDailyRecurring": false,
  //    "fromTime": null,
  //    "toTime": null
  //   },
  //   "currentStatus": "Available"
  //  },
  const handleSetStatusText = (item: string) => {
    // console.log("statusText", JSON.stringify(status, null, 1));
    if (!item.trim()) {
      return showToast({message: 'Field cannot be empty'});
    }
    axiosInstance
      .patch('/user/updateuser', {
        profileStatus: {
          currentStatus: item,
          recurring: {
            isDailyRecurring: true,
            fromTime: '09:00 AM',
            toTime: '05:00 PM',
          },
        },
      })
      .then(async res => {
        // // showAlert({

        // //   title: "Done!",
        // //   type: "success",
        // //   message: "Profile status has been updated successfully!!",
        // // });
        setStatusText('');
        showToast({message: 'Status added successfully'});
        dispatch(setUser(res.data.user));
      })
      .catch(err => {
        console.log('update Status', err);
      });
  };
  // console.log("user", JSON.stringify(user, null, 1));
  useFocusEffect(
    React.useCallback(() => {
      setStatusSectionVisible(false);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  const renderItem = ({item}: {item: TStatus}) => {
    return (
      <TouchableOpacity
        onPress={() => handleSetStatus(item.value)}
        style={styles.statusContainer}>
        {item.icon}
        <Text
          style={[
            styles.statusText,
            item.value === status && {color: Colors.Primary},
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItemSeparator = () => {
    return <Divider marginTop={1} marginBottom={1} />;
  };
  return (
    <View
      style={[
        styles.profileDetailsContainer,
        {backgroundColor: Colors.Foreground},
      ]}>
      <View style={styles.userDetails}>
        <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
          <Image
            source={
              user?.profilePicture
                ? {
                    uri: user?.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.image}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -5,
              right: -3,
              backgroundColor: Colors.Foreground,
              borderRadius: 100,
              padding: 2,
            }}>
            {profileStatus?.find(item => item.value === status)?.icon}
          </View>
        </TouchableOpacity>
        {/* <View style={styles.activeDot}></View> */}
        {/* {isEventNear && (
            <View style={{ position: "absolute", bottom: 0, right: 0 }}>
              <WaveThingy />
            </View>
          )} */}

        <TouchableOpacity onPress={toggleStatusSection}>
          <Text style={[styles.title, {color: Colors.Heading}]}>
            {user?.fullName}
          </Text>
          <Text style={[styles.details, {color: Colors.BodyText}]}>
            {user?.email}
          </Text>
          <Text style={[styles.details, {color: Colors.BodyText}]}>
            ID: {user?.id}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Status section */}
      {statusSectionVisible && (
        <View style={styles.statusSection}>
          <View style={styles.customStatusContainer}>
            <TouchableOpacity
              onPress={() =>
                showAlertModal({
                  type: 'warning',
                  title: 'Coming soon...',
                  message: 'Available in future updates.',
                })
              }
              style={{marginTop: 10}}>
              <EmojiIcon />
            </TouchableOpacity>
            <View style={styles.statusTextStyle}>
              <TextInput
                placeholder="Your status? (40 character max)"
                placeholderTextColor="gray" // Ensure it contrasts well with your background
                maxLength={40}
                style={styles.customStatus}
                multiline
                value={statusText}
                onChangeText={handleTextChange}
                onKeyPress={handleKeyPress}
                keyboardAppearance={theme()}
              />
              <TouchableOpacity onPress={() => handleSetStatusText(statusText)}>
                <FAICon name="check" size={24} color={Colors.SuccessColor} />
              </TouchableOpacity>
            </View>
          </View>
          <Divider marginTop={1} marginBottom={1} />
          <TouchableOpacity
            onPress={() =>
              showAlertModal({
                type: 'warning',
                title: 'Coming soon...',
                message: 'Available in future updates.',
              })
            }
            style={styles.clearAfterButton}>
            <ClockIcon size={20} />
            <View style={styles.clearAfterSection}>
              <Text style={styles.clearAfterText}>Clear after</Text>
              <Text style={styles.clearTimeText}>Tomorrow 12:30 pm</Text>
            </View>
          </TouchableOpacity>
          <Divider marginTop={1} marginBottom={1} />
          <FlatList
            data={userStatusData}
            renderItem={renderItem}
            keyExtractor={item => item.value}
            ItemSeparatorComponent={renderItemSeparator}
          />
        </View>
      )}
      <GlobalAlertModal />
    </View>

    // <TouchableOpacity activeOpacity={0.8} onPress={handleProfileNavigation}>
    // </TouchableOpacity>
  );
};

export default HomeUserDetails;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    clearTimeText: {
      color: Colors.BodyText,
    },
    clearAfterSection: {
      gap: 5,
    },
    clearAfterText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    clearAfterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      color: Colors.BodyText,
      gap: 10,
      paddingLeft: 10,
    },
    customStatusContainer: {
      flexDirection: 'row',

      alignItems: 'flex-start',
      // paddingTop: 0,
      gap: 10,
      paddingLeft: 10,
    },
    customStatus: {
      minWidth: 100,
      flex: 0.9,
      // backgroundColor: "red",
      minHeight: 35,
      // marginBottom: 5,
      fontSize: RegularFonts.BR,
      color: Colors.BodyText,
      marginRight: 20,
      width: '88%',
      paddingTop: 10,
    },
    statusText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
    },
    userDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      // backgroundColor: "green",
    },
    profileDetailsContainer: {
      marginTop: responsiveScreenHeight(1.5),
      borderBottomLeftRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      marginHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    profileImageContainer: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      marginRight: responsiveScreenWidth(3),
      marginLeft: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(0.3),
    },
    image: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      position: 'relative',
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    activeDot: {
      backgroundColor: Colors.Primary,
      height: 12,
      width: 12,
      borderRadius: 100,
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      width: responsiveScreenWidth(68),
    },
    details: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginTop: responsiveScreenHeight(0.25),
    },
    statusSection: {
      overflow: 'hidden',
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
    },
    statusTextStyle: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  });
