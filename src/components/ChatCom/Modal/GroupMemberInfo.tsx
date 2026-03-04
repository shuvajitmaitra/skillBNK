import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import moment from 'moment';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import ThreeDotGrayIcon from '../../../assets/Icons/ThreeDotGrayIcon';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedMembers} from '../../../store/reducer/chatSlice';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import UserIconTwo from '../../../assets/Icons/UserIconTwo';
export default function GroupMemberInfo({item, index}: any) {
  const dispatch = useDispatch();
  const {
    singleChat: chat,
    onlineUsersObj,
    offlineUsersObj,
  } = useSelector((state: RootState) => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  // console.log('onlineUsersObj', JSON.stringify(onlineUsersObj, null, 2));
  const name =
    item.user.fullName && item.user.fullName.split(' ')?.length > 3
      ? `${item.user.fullName.split(' ')[0]}  ${
          item.user.fullName.split(' ')[1]
        }`
      : `${item.user.fullName}`;
  const roleValid =
    chat?.myData?.user !== item?.user?._id &&
    (chat?.myData?.role === 'admin' || chat?.myData?.role === 'owner')
      ? true
      : false;
  const active = onlineUsersObj?.[item.user._id];

  const offline = offlineUsersObj?.[item.user._id];

  return (
    <TouchableOpacity
      onPress={() => {
        roleValid && dispatch(setSelectedMembers(item));
      }}
      style={[
        styles.container,
        {borderTopColor: index ? Colors.BorderColor : Colors.Background_color},
      ]}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          {item?.user?.profilePicture ? (
            <Image
              style={styles.profileImage}
              source={
                {uri: item?.user?.profilePicture}
                // : require("../../../assets/Images/user.png")
              }
            />
          ) : (
            <UserIconTwo size={40} color={Colors.BodyText} />
          )}
        </View>
        <View>
          <View style={styles.MemberNameContainer}>
            <Text style={[styles.profileName]}>{name}</Text>
            {item?.role !== 'member' && (
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor: Colors.PrimaryOpacityColor,
                    borderColor: Colors.Primary,
                  },
                ]}>
                <Text style={styles.roleText}>{item.role}</Text>
              </View>
            )}
            {item?.isBlocked ? (
              <View style={styles.statusContainer}>
                <Text style={styles.blockText}>Blocked</Text>
              </View>
            ) : null}
            {item?.mute?.isMuted ? (
              <View style={styles.statusContainer}>
                <Text style={styles.blockText}>Muted</Text>
              </View>
            ) : null}
          </View>
          {active?._id ? (
            <Text
              style={[
                styles.status,
                {
                  color: Colors.Primary,
                },
              ]}>
              Active Now
            </Text>
          ) : offline?._id ? (
            <Text
              style={[
                styles.status,
                {
                  color: Colors.BodyText,
                },
              ]}>
              {moment(offline.offlineAt).fromNow()}
            </Text>
          ) : (
            <Text
              style={[
                styles.status,
                {
                  color: Colors.BodyText,
                },
              ]}>
              {item?.user?.lastActive
                ? moment(item?.user?.lastActive).fromNow()
                : 'N/A'}
            </Text>
          )}
        </View>
      </View>

      {roleValid && (
        <TouchableOpacity
          style={styles.threeDotIcon}
          onPress={() => {
            dispatch(setSelectedMembers(item));
          }}
          activeOpacity={0.5}>
          <View
            style={{
              paddingHorizontal: 1,
              borderRadius: 100,
            }}>
            <ThreeDotGrayIcon />
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    MemberNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'flex-start',
    },
    statusContainer: {
      backgroundColor: Colors.LightRed,
      paddingHorizontal: 5,
      borderWidth: 1,
      borderColor: Colors.Red,
      borderRadius: 3,
    },
    roleText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    blockText: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1),
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor,
    },
    profileImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
      flex: 1,
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.Foreground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileName: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    status: {
      color: 'rgba(11, 42, 70, 1)',
      fontSize: responsiveScreenFontSize(1.8),
      paddingVertical: responsiveScreenHeight(0.2),
      fontFamily: CustomFonts.REGULAR,
    },
    commentsTime: {
      color: 'rgba(111, 116, 124, 1)',
      fontSize: responsiveScreenFontSize(1.9),
    },
    // --------------------------
    // ----------- Popup modal -----------
    // --------------------------
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    iconAndTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    buttonContainer: {
      paddingVertical: responsiveScreenHeight(1.2),
      paddingHorizontal: responsiveScreenWidth(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },

    content: {
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
      backgroundColor: Colors.Foreground,
    },
    arrow: {
      borderTopColor: Colors.Foreground,
      marginTop: responsiveScreenHeight(9),
    },
  });
