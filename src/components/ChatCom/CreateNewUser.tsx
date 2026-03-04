import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TextInput} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handleError} from '../../actions/chat-noti';
import axiosInstance from '../../utility/axiosInstance';
import OnlineUsersItem from './OnlineUsersItem';
import Divider from '../SharedComponent/Divider';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {useNavigation} from '@react-navigation/native';
import {RegularFonts} from '../../constants/Fonts';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import debounce from 'lodash.debounce'; // Install lodash.debounce
import {TColors} from '../../types';
import {filterDuplicateUsers} from '../../utility/commonFunction';
export interface PhoneDetails {
  isVerified: boolean;
  number: string;
  countryCode: string;
}

// Define the user interface. Note that phone can either be a PhoneDetails object or a string.
export interface INewUser {
  phone: PhoneDetails | string;
  profilePicture: string;
  lastName: string;
  _id: string;
  email: string;
  firstName: string;
  createdAt: string; // ISO date string
  lastActive: string; // ISO date string
  fullName: string;
}

const CreateNewUser = () => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [AllUsers, setAllUsers] = useState<INewUser[] | null>(null);
  const navigation = useNavigation();

  // API Call for searching users
  const searchAllUser = useCallback((searchText: string) => {
    axiosInstance
      .get(`/chat/searchuser?query=${searchText}`)
      .then(res => {
        setAllUsers(filterDuplicateUsers(res.data.users));
      })
      .catch(error => {
        handleError(error, {from: 'chat/searchuser?query'});
      });
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (text: string) => {
      debounce(() => {
        searchAllUser(text);
      }, 500)();
    },
    [searchAllUser],
  );

  // Handle search text change
  const handleSearchChange = (text: string) => {
    debouncedSearch(text); // Trigger debounced search
  };

  useEffect(() => {
    searchAllUser('');
  }, [searchAllUser]);
  const itemSeparator = () => (
    <Divider marginTop={0.000001} marginBottom={0.00001} />
  );

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>
        <View style={styles.searchFieldContainer}>
          <TextInput
            onChangeText={handleSearchChange} // Attach the handler here
            placeholder="Search new user..."
            placeholderTextColor={Colors.BodyText}
            style={styles.searchUserField}
          />
        </View>
      </View>

      <FlatList
        data={AllUsers}
        renderItem={({item}: {item: INewUser}) => (
          <OnlineUsersItem item={item} />
        )}
        keyExtractor={(item: INewUser) => item?._id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        ItemSeparatorComponent={itemSeparator}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <NoDataAvailable />
          </View>
        }
      />
    </View>
  );
};

export default CreateNewUser;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    topContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'center',
    },
    noDataContainer: {
      height: responsiveScreenHeight(80),
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      padding: 10,
      borderRadius: 100,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    searchFieldContainer: {
      width: responsiveScreenWidth(80),
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.ScreenBoxColor,
      paddingHorizontal: 10,
      borderRadius: 7,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      alignSelf: 'center',
    },
    searchUserField: {
      flex: 1,
      height: 40,
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
  });
