import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import {useTheme} from '../context/ThemeContext';
import {TColors} from '../types';
import Feather from 'react-native-vector-icons/Feather';
const Icon = Feather as any;

interface PasswordFieldProps {
  title: string;
  setText: (text: string) => void;
  placeholder: string;
  bottomDetails?: string;
  errorText?: string;
  isRequire?: boolean;
  value?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  title,
  setText,
  placeholder,
  bottomDetails,
  errorText,
  isRequire = false,
  value,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {isRequire && <Text style={styles.required}>*</Text>}
      </View>

      <View
        style={[styles.inputContainer, errorText ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.BodyText}
          secureTextEntry={secureTextEntry}
          onChangeText={setText}
          value={value}
        />
        <TouchableOpacity
          onPress={toggleSecureEntry}
          style={styles.iconContainer}>
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color={Colors.BodyText}
          />
        </TouchableOpacity>
      </View>

      {bottomDetails && !errorText && (
        <Text style={styles.bottomDetails}>{bottomDetails}</Text>
      )}

      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      marginTop: 5,
      width: '100%',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    title: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
    },
    required: {
      color: 'red',
      marginLeft: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 8,
      backgroundColor: Colors.ScreenBoxColor,
      paddingHorizontal: 12,
    },
    inputError: {
      borderColor: 'red',
    },
    input: {
      flex: 1,
      height: 48,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    iconContainer: {
      padding: 8,
    },
    bottomDetails: {
      fontSize: responsiveScreenFontSize(1.5),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      marginTop: 4,
    },
    errorText: {
      fontSize: responsiveScreenFontSize(1.5),
      fontFamily: CustomFonts.REGULAR,
      color: 'red',
      marginTop: 4,
    },
  });

export default PasswordField;
