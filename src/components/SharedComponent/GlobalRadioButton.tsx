// RadioGroup.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {TColors} from '../../types';
type TOptions = {
  label: string;
  value: string | number;
}[];

const GlobalRadioGroup = ({
  options,
  onSelect,
  selectedValue,
  customStyle,
}: {
  options: TOptions;
  onSelect?: (value: string | number) => void;
  selectedValue?: string | number;
  customStyle?: ViewStyle;
}) => {
  const [selected, setSelected] = useState(selectedValue);

  const handleSelect = (value: string | number) => {
    setSelected(value);
    if (onSelect) {
      onSelect(value);
    }
  };
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={customStyle}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioButtonContainer}
          onPress={() => handleSelect(option.value)}>
          <View
            style={[
              styles.radioCircle,
              {
                borderColor:
                  selected === option.value ? Colors.Primary : Colors.BodyText,
              },
            ]}>
            {selected === option.value && <View style={styles.selectedRb} />}
          </View>
          <Text
            style={[
              styles.radioText,
              {
                color:
                  selected === option.value ? Colors.Primary : Colors.BodyText,
              },
            ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    radioButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    selectedRb: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.Primary,
    },
    radioText: {
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.REGULAR,
    },
  });

export default GlobalRadioGroup;
