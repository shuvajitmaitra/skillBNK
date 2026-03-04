import React, {useState, memo} from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import NewPinIcon from '../../assets/Icons/NewPinIcon';
import MessageIcon from '../../assets/Icons/MessageIcon';
import {RegularFonts} from '../../constants/Fonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import Divider from '../SharedComponent/Divider';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import SearchWhiteIcon from '../../assets/Icons/SearchWhiteIcon';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import ArchiveIcon from '../../assets/Icons/ArchiveIcon';
import ChatIcon2 from '../../assets/Icons/ChatIcon2';
import {TColors} from '../../types';
import {theme} from '../../utility/commonFunction';

type ChatSearchFieldProps = {
  checked: string;
  handleRadioChecked: (value: string) => void;
  handleFilter: (text: string) => void;
};

const ChatSearchField = ({
  checked,
  handleRadioChecked,
  handleFilter,
}: ChatSearchFieldProps) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchText, setSearchText] = useState<string>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const radioOptions = [
    {
      label: 'Chats',
      value: 'chats',
      icon: <ChatIcon2 color={Colors.Heading} />,
    },
    {
      label: 'Archived Chat',
      value: 'archived',
      icon: <ArchiveIcon color={Colors.Heading} />,
    },
    {
      label: 'Favorite Chat',
      value: 'favorites',
      icon: <NewPinIcon color={Colors.Heading} />,
    },
    {
      label: 'Unread Message',
      value: 'unreadMessage',
      icon: <MessageIcon color={Colors.Heading} />,
    },
  ];

  const renderItem = ({
    item,
  }: {
    item: {value: string; label: string; icon: JSX.Element};
  }) => (
    <TouchableOpacity
      onPress={() => {
        setInputFocused(false);
        setIsTyping(true);
        handleRadioChecked(item.value);
        Keyboard.dismiss();
      }}
      style={styles.radioContainer}>
      {item.icon}
      <Text style={styles.radioText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleInputFocus = () => {
    setInputFocused(true);
    setIsTyping(false);
  };

  const handleInputChange = (text: string) => {
    setIsTyping(true);
    handleFilter(text);
    setSearchText(text);
  };

  const renderSeparator = () => <Divider marginTop={1.5} marginBottom={1.5} />;

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.pop()}>
        <ArrowLeft size={20} color={Colors.Heading} />
      </TouchableOpacity>
      <View style={[styles.inputField]}>
        <TextInput
          autoCorrect={false}
          autoCapitalize={'none'}
          keyboardAppearance={theme()}
          value={searchText}
          style={[
            styles.textInput,
            {
              paddingVertical:
                Platform.OS === 'ios'
                  ? responsiveScreenHeight(1.3)
                  : responsiveScreenHeight(1),
            },
          ]}
          placeholder={
            checked === 'search'
              ? 'Search new user...'
              : checked === 'chats'
              ? 'Search chat...'
              : checked === 'unreadMessage'
              ? 'Search unread...'
              : checked === 'mention'
              ? 'Search mention...'
              : checked === 'onlines'
              ? 'Search online users...'
              : checked === 'crowds'
              ? 'Search crowds...'
              : 'Search...'
          }
          placeholderTextColor={Colors.Heading}
          onFocus={handleInputFocus}
          onChangeText={handleInputChange}
        />
        {!isTyping && inputFocused ? (
          <TouchableOpacity
            onPress={() => {
              handleFilter('');
              setSearchText('');
              setInputFocused(false);
              setIsTyping(true);
              Keyboard.dismiss();
            }}>
            <CrossCircle />
          </TouchableOpacity>
        ) : (
          <SearchWhiteIcon /> // <Feather style={styles.inputFieldIcon} name="search" />
        )}
      </View>

      {!isTyping && inputFocused && (
        <View style={styles.bottomContainer}>
          <FlatList
            data={radioOptions}
            renderItem={renderItem}
            keyExtractor={item => item.value}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
      )}
    </View>
  );
};

export default memo(ChatSearchField);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // backgroundColor: 'red',
      gap: 10,
    },
    backArrow: {
      backgroundColor: Colors.Foreground,
      padding: 10,
      borderRadius: 1000,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    topContainer: {
      alignItems: 'center',
      borderRadius: 10,
      // backgroundColor: 'blue',
      marginHorizontal: responsiveScreenWidth(2),
    },
    inputField: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.ScreenBoxColor,
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(2),
      flex: 1,
    },
    textInput: {
      fontSize: responsiveScreenFontSize(1.6),
      minWidth: responsiveScreenWidth(52),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      // backgroundColor: "red",
    },
    inputFieldIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Gray,
    },
    bottomContainer: {
      backgroundColor: Colors.Foreground,
      position: 'absolute',
      top: responsiveScreenHeight(6),
      // left: responsiveScreenWidth(-15),
      right: 0,
      minHeight: 100,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(2),
      width: responsiveScreenWidth(90),
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // paddingVertical: responsiveScreenHeight(1.5),
      gap: 10,
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: RegularFonts.BR,
      color: Colors.Heading,
    },
    itemContainer: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    container: {
      paddingLeft: responsiveScreenWidth(3),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    headingText: {
      color: Colors.Heading,
      fontSize: RegularFonts.HR,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    threeDotContainer: {
      width: responsiveScreenWidth(8),
      //   backgroundColor: "red",
      alignItems: 'center',
      height: 30,
      justifyContent: 'center',
    },
    popupContent: {
      // padding: 16,
      backgroundColor: Colors.Foreground,
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
    },
    popupArrow: {
      borderTopColor: Colors.Foreground,
    },
    popupContryText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      marginVertical: 7,
      fontSize: responsiveScreenFontSize(1.9),
    },
  });
