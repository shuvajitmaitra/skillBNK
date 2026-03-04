import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import UpDownIcon from '../../assets/Icons/UpDownIcon';
import CustomFonts from '../../constants/CustomFonts';
// import CheckMarkIcon from '../../assets/Icons/CheckMarkIcon';
import {TColors} from '../../types';
import {gGap, gWidth} from '../../constants/Sizes';

interface CustomDropDownTwoProps {
  data?: string[];
  state?: string;
  setState: (value: string) => void;
  placeholder?: string;
  flex?: number;
  background?: string;
  containerStyle?: ViewStyle;
  itemContainer?: ViewStyle;
}

const CustomDropDownTwo: React.FC<CustomDropDownTwoProps> = ({
  data = [],
  state = '',
  setState,
  placeholder = 'Select',
  background,
  containerStyle,
  itemContainer,
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [itemVisible, setItemVisible] = useState<boolean>(false);

  return (
    <View style={[styles.mainContainer, {}]}>
      <TouchableOpacity
        onPress={() => setItemVisible(pre => !pre)}
        style={{
          width: gWidth(150),
          paddingHorizontal: gGap(10),
          paddingVertical: gGap(5),
          backgroundColor: background,
          flexDirection: 'row',
          ...containerStyle,
        }}>
        <View style={{width: '90%'}}>
          <Text numberOfLines={1} style={[styles.dropDownText]}>
            {state ? state : placeholder}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '10%',
          }}>
          <UpDownIcon size={20} />
        </View>
      </TouchableOpacity>

      {itemVisible && (
        <View
          style={[
            styles.itemContainer,
            {width: '100%', backgroundColor: background, ...itemContainer},
          ]}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setState(item);
                setItemVisible(pre => !pre);
              }}
              style={[
                state === item ? styles.activeText : styles.itemDropDownText,
              ]}>
              {/* {state === item && <CheckMarkIcon />} */}
              <Text
                style={{
                  fontFamily: CustomFonts.REGULAR,
                  color: state === item ? Colors.PureWhite : Colors.BodyText,
                  fontSize: responsiveScreenFontSize(2),
                  textTransform: 'capitalize',
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

export default CustomDropDownTwo;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    activeText: {
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      minWidth: 100,
      paddingHorizontal: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      textTransform: 'capitalize',
    },
    mainContainer: {
      position: 'relative',
      zIndex: 1,
    },
    dropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      textTransform: 'capitalize',
      fontSize: responsiveScreenFontSize(2),
    },
    itemDropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      textTransform: 'capitalize',
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1),
    },
    container: {
      minHeight: responsiveScreenHeight(2),
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // width: '100%',
      paddingHorizontal: gGap(10),
      paddingVertical: gGap(5),
    },
    itemContainer: {
      position: 'absolute',
      zIndex: 1,
      top: responsiveScreenHeight(5),
      flex: 1,
      minHeight: responsiveScreenHeight(2),
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      justifyContent: 'space-between',
    },
  });
