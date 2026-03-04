import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import UpDownIcon from '../../assets/Icons/UpDownIcon';
import CheckMarkIcon from '../../assets/Icons/CheckMarkIcon';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';

// Define the props for CustomDropDownThree
interface CustomDropDownThreeProps {
  containerStyle?: StyleProp<ViewStyle>;
  dropDownTextStyle?: StyleProp<TextStyle>;
  data: string[];
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const CustomDropDownThree: React.FC<CustomDropDownThreeProps> = ({
  containerStyle = {},
  data,
  state,
  setState,
  dropDownTextStyle = {},
}) => {
  // Import theme colors using the context hook.
  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const [itemVisible, setItemVisible] = useState<boolean>(false);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => setItemVisible(prev => !prev)}
        style={[styles.container, containerStyle]}>
        <Text style={[styles.dropDownText, dropDownTextStyle]}>{state}</Text>
        <UpDownIcon size={15} />
      </TouchableOpacity>

      {itemVisible && (
        <View style={styles.itemContainer}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setState(item);
                setItemVisible(prev => !prev);
              }}
              style={
                state === item ? styles.activeText : styles.itemDropDownText
              }>
              {state === item ? <CheckMarkIcon /> : null}
              <Text
                style={{
                  fontFamily: CustomFonts.REGULAR,
                  color: state === item ? Colors.PureWhite : Colors.BodyText,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomDropDownThree;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    activeText: {
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      minWidth: 100,
      paddingHorizontal: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(0.5),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    } as ViewStyle, // Type assertion for view style properties if needed
    mainContainer: {
      position: 'relative',
      zIndex: 100,
    } as ViewStyle,
    dropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveFontSize(1.8),
      paddingVertical: responsiveScreenHeight(0.7),
    } as TextStyle,
    itemDropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(0.3),
    } as TextStyle,
    container: {
      minWidth: 120,
      minHeight: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenWidth(1.5),
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    } as ViewStyle,
    itemContainer: {
      position: 'absolute',
      top: responsiveScreenHeight(4),
      marginTop: responsiveScreenHeight(1.5),
      minWidth: responsiveScreenWidth(73),
      minHeight: responsiveScreenHeight(2),
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      justifyContent: 'space-between',
    } as ViewStyle,
  });
