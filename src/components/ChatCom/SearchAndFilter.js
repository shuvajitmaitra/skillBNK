import React, {useState, useEffect, memo} from 'react';
import {
  Alert,
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
import ChatIconBig from '../../assets/Icons/ChatIconBig';
import DeleteIcon from '../../assets/Icons/DeleteIcon';
import NewPinIcon from '../../assets/Icons/NewPinIcon';
import MessageIcon from '../../assets/Icons/MessageIcon';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import {RegularFonts} from '../../constants/Fonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import Divider from '../SharedComponent/Divider';
import SearchIcon from '../../assets/Icons/SearchIcon';
import ArchiveIcon from '../../assets/Icons/ArchiveIcon';
import {theme} from '../../utility/commonFunction';

const SearchAndFilter = ({checked, handleRadioChecked, handleFilter}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const radioOptions = [
    {
      label: 'Chats',
      value: 'chats',
      icon: <CommentsIcon color={Colors.Heading} />,
    },
    {
      label: 'Archived Chat',
      value: 'archived',
      icon: <ArchiveIcon color={Colors.Heading} />,
    },
    {
      label: 'Pin',
      value: 'favorites',
      icon: <NewPinIcon color={Colors.Heading} />,
    },
    {
      label: 'Unread Message',
      value: 'unreadMessage',
      icon: <MessageIcon color={Colors.Heading} />,
    },
  ];

  const renderItem = ({item}) => (
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

  // useEffect(() => {
  //   const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setInputFocused(false));
  //   return () => {
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

  const handleInputFocus = () => {
    setInputFocused(true);
    setIsTyping(false);
  };

  const handleInputChange = text => {
    setIsTyping(true);
    handleFilter(text);
  };

  return (
    <View style={styles.topContainer}>
      <View style={styles.inputField}>
        <TextInput
          autoCorrect={false}
          autoCapitalize={'none'}
          keyboardAppearance={theme()}
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
              : checked === 'onlines'
              ? 'Search online users...'
              : checked === 'crowds'
              ? 'Search crowds...'
              : 'Search...'
          }
          placeholderTextColor={Colors.BodyText}
          onFocus={handleInputFocus}
          onChangeText={handleInputChange}
        />
        {!isTyping && inputFocused ? (
          <TouchableOpacity
            onPress={() => {
              setInputFocused(false);
              setIsTyping(true);
              Keyboard.dismiss();
            }}>
            <CrossCircle />
          </TouchableOpacity>
        ) : (
          <SearchIcon />
        )}
      </View>

      {!isTyping && inputFocused && (
        <View style={styles.bottomContainer}>
          <FlatList
            data={radioOptions}
            renderItem={renderItem}
            keyExtractor={item => item.value}
            ItemSeparatorComponent={() => (
              <Divider marginTop={1.5} marginBottom={1.5} />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default memo(SearchAndFilter);

const getStyles = Colors =>
  StyleSheet.create({
    topContainer: {
      alignItems: 'center',
      borderRadius: 10,
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
      minWidth: '100%',
    },
    textInput: {
      fontSize: responsiveScreenFontSize(1.6),
      width: responsiveScreenWidth(52),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      overflow: 'hidden',
    },
    inputFieldIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Gray,
    },
    bottomContainer: {
      backgroundColor: Colors.Foreground,
      position: 'absolute',
      top: responsiveScreenHeight(6),
      left: 0,
      right: 0,
      minHeight: 100,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(2),
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
      fontSize: RegularFonts.HR,
      color: Colors.Heading,
    },
  });
