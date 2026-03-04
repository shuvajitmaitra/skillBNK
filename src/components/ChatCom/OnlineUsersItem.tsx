import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GoToChatIcon from '../../assets/Icons/GoToChatIcon';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch} from 'react-redux';
import {setSingleChat} from '../../store/reducer/chatReducer';
import {setCurrentRoute} from '../../store/reducer/authReducer';
import {RootStackParamList} from '../../types/navigation';
import {TColors} from '../../types';
import PlusCircle from '../../assets/Icons/PlusCircle';
import {loadChats} from '../../actions/chat-noti';

// Define the type for a single online user item.
export interface OnlineUser {
  _id: string;
  profilePicture?: string;
  fullName?: string;
}

interface OnlineUsersItemProps {
  item: OnlineUser;
  from?: string;
}

const OnlineUsersItem: React.FC<OnlineUsersItemProps> = ({item, from = ''}) => {
  const [creating, setCreating] = useState(false);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'MessageScreen'>
    >();

  const handleCreateChat = async (id: string) => {
    if (creating) {
      return;
    }
    setCreating(true);
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/chat/findorcreate/${id}`);
      if (res.data.success) {
        dispatch(setCurrentRoute('MessageScreen'));
        navigation.push('MessageScreen', {animationEnabled: false});
        loadChats();
      }

      dispatch(
        setSingleChat({
          ...res.data.chat,
          otherUser: {
            profilePicture: item?.profilePicture,
            _id: item._id,
            fullName: item?.fullName,
          },
        }),
      );
    } catch (err: any) {
      setLoading(false);
      console.error('Error creating chat:', err?.response?.data);
    } finally {
      setLoading(false);
      setCreating(false);
    }
  };

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <TouchableOpacity
      onPress={() => {
        handleCreateChat(item._id);
      }}
      style={styles.mainContainer}>
      <View style={[styles.container]}>
        <View style={styles.subContainer}>
          <View>
            {item.profilePicture ? (
              <Image
                resizeMode="contain"
                style={styles.profileImage}
                source={{uri: item.profilePicture}}
              />
            ) : (
              <UserIconTwo size={responsiveScreenWidth(10)} />
            )}

            <View
              style={[
                styles.activeDot,
                {
                  backgroundColor: Colors.Primary,
                },
              ]}
            />
          </View>

          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.profileName}>
                {item.fullName ? item.fullName : 'Schools Hub User'}
              </Text>
            </View>
          </View>
        </View>
        {Loading ? (
          <ActivityIndicator
            color={Colors.Primary}
            animating={true}
            size="large"
            style={{marginRight: 5}}
          />
        ) : (
          <>{from === '' ? <PlusCircle size={25} /> : <GoToChatIcon />}</>
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 20,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1.8),
    },
    subContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    sortName: {
      color: Colors.Foreground,
      fontSize: responsiveScreenFontSize(1.8),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.LightGreen,
    },
    activeDot: {
      width: responsiveScreenWidth(2.8),
      height: responsiveScreenWidth(2.8),
      borderRadius: responsiveScreenWidth(100),
      position: 'absolute',
      bottom: responsiveScreenWidth(0.9),
      right: -2,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.Foreground,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      width: responsiveScreenWidth(50),
    },
    messageTime: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: responsiveScreenHeight(1),
      alignItems: 'center',
      justifyContent: 'space-between',
      width: responsiveScreenWidth(70),
    },
    messageNumberContainer: {
      alignItems: 'center',
    },
    messageNumber: {
      paddingHorizontal: responsiveScreenWidth(1.2),
      backgroundColor: Colors.Primary,
      textAlign: 'center',
      color: Colors.PureWhite,
      borderRadius: responsiveScreenWidth(100),
      fontSize: responsiveScreenFontSize(1.3),
    },
  });

export default OnlineUsersItem;
