import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import {useGlobalAlert} from '../../components/SharedComponent/GlobalAlertContext';
import axiosInstance from '../../utility/axiosInstance';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';
import MyButton from '../../components/AuthenticationCom/MyButton';
import PasswordField from '../../components/PasswordField';
import {handleSignOut} from '../../utility/commonFunction';

export default function ChangePasswordScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const {showAlert} = useGlobalAlert();
  const [currentPassError, setCurrentPassError] = useState('');
  const [newPassError, setNewPassError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  const [data, setData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const handleCurrentPasswordChange = (val: string) => {
    setCurrentPassError('');
    setData({
      ...data,
      currentPassword: val,
    });
  };

  const handlePasswordChange = (val: string) => {
    setNewPassError('');
    setData({
      ...data,
      password: val,
    });
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassError('');
    setData({
      ...data,
      confirmPassword: val,
    });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!data.currentPassword) {
      setCurrentPassError('Please enter your current password');
      isValid = false;
    } else if (data.currentPassword.length < 8) {
      setCurrentPassError('Password must be at least 8 characters');
      isValid = false;
    }

    if (!data.password) {
      setNewPassError('Please enter your new password');
      isValid = false;
    } else if (data.password.length < 8) {
      setNewPassError('Password must be at least 8 characters');
      isValid = false;
    }

    if (!data.confirmPassword) {
      setConfirmPassError('Please confirm your new password');
      isValid = false;
    } else if (data.password !== data.confirmPassword) {
      setConfirmPassError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handlePasswordSave = async () => {
    if (!validateInputs()) return;

    try {
      await axiosInstance.patch('/user/changepassword', {
        currentPassword: data.currentPassword,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });

      showAlert({
        title: 'Success',
        type: 'success',
        message: 'Password changed successfully. Please login again.',
      });

      // Sign out the user
      handleSignOut();
    } catch (error) {
      console.log('Change password error:', error);
      setCurrentPassError('Incorrect current password');
    }
  };

  // const dismissKeyboard = () => {
  //   Keyboard.dismiss();
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
      style={{
        flex: 1,
        backgroundColor: Colors.Background_color,
        paddingHorizontal: 10,
        paddingTop: Platform.OS === 'android' ? 10 : null,
      }}>
      <View style={{flex: 1}}>
        <Text style={styles.heading}>Update your password</Text>
        <Text style={styles.subheading}>
          Create a new, strong password that you don't use for other accounts
        </Text>
        <ScrollView>
          <PasswordField
            title="Current Password"
            setText={handleCurrentPasswordChange}
            placeholder="Enter current password"
            bottomDetails="Enter your current password"
            errorText={currentPassError}
            isRequire={true}
            value={data.currentPassword}
          />

          <PasswordField
            title="New Password"
            setText={handlePasswordChange}
            placeholder="Enter new password"
            bottomDetails="Must be at least 8 characters"
            errorText={newPassError}
            isRequire={true}
            value={data.password}
          />

          <PasswordField
            title="Confirm Password"
            setText={handleConfirmPasswordChange}
            placeholder="Confirm new password"
            bottomDetails="Must match your new password"
            errorText={confirmPassError}
            isRequire={true}
            value={data.confirmPassword}
          />
        </ScrollView>
        <View style={styles.btnArea}>
          <MyButton
            onPress={() => navigation.goBack()}
            title={'Cancel'}
            bg={Colors.SecondaryButtonBackgroundColor}
            colour={Colors.SecondaryButtonTextColor}
          />
          <MyButton
            onPress={handlePasswordSave}
            title={'Update'}
            bg={Colors.Primary}
            colour={Colors.PureWhite}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 10,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    innerContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: responsiveScreenWidth(5),
      paddingTop: responsiveScreenHeight(2),
    },
    heading: {
      fontSize: responsiveScreenFontSize(2.4),
      fontFamily: CustomFonts.BOLD,
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(1),
    },
    subheading: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    formContainer: {
      gap: responsiveScreenHeight(2),
    },
    buttonContainer: {
      width: '100%',
      backgroundColor: Colors.Background_color,
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor,
    },
    btnArea: {
      flexDirection: 'row',

      gap: 10,
      marginTop: 10,
      marginBottom: 10,
    },
  });
