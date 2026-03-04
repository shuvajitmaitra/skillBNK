import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import UpArrowIcon from '../../assets/Icons/UpArrowIcon';
import DownArrowIcon from '../../assets/Icons/DownArrowIcon';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {TColors} from '../../types';
import {showToast} from '../HelperFunction';

// Define an interface for each option item.
export interface OptionItem {
  type: string;
  data: string;
}

// Define the component props.
interface CustomMultiSelectDropDownProps {
  options: OptionItem[];
  initialSelections?: OptionItem[];
  setState: (newState: any) => void;
  data?: {
    message?: string;
    placeholder?: string;
  };
}

export const CustomMultiSelectDropDown: React.FC<
  CustomMultiSelectDropDownProps
> = ({options, initialSelections = [], setState, data}) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] =
    useState<OptionItem[]>(initialSelections);

  useEffect(() => {
    setSelectedItems(initialSelections);
  }, [initialSelections]);

  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);

  const toggleSelection = (item: OptionItem): void => {
    let updatedSelections: OptionItem[];

    if (selectedItems.some(i => i.type === item.type)) {
      // if (selectedItems.length === 1) {
      //   showToast({
      //     background: Colors.Red,
      //     message: 'Please select at least one option.',
      //   });
      //   return;
      // }
      updatedSelections = selectedItems.filter(i => i.type !== item.type);
    } else {
      if (selectedItems.length >= 3) {
        showToast({
          background: Colors.Red,
          message:
            data?.message || 'You cannot select more than three options.',
        });
        return;
      }
      updatedSelections = [...selectedItems, item];
    }
    setSelectedItems(updatedSelections);
    setState(updatedSelections);
  };

  // const selectedTypes = selectedItems.map((item) => item.type);

  const handleOutsidePress = (): void => {
    if (clicked) {
      setClicked(false);
      Keyboard.dismiss(); // Dismiss keyboard if open
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={[
            styles.inputField,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            {borderBottomLeftRadius: clicked ? 0 : 10},
            {borderBottomRightRadius: clicked ? 0 : 10},
          ]}
          onPress={() => setClicked(prev => !prev)}>
          <View
            style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5, flex: 0.9}}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item)}
                  style={styles.selectedItemsContainer}
                  key={index}>
                  <Text
                    style={{
                      paddingVertical: responsiveScreenHeight(0.5),
                      color: Colors.BodyText,
                    }}>
                    {item.type}
                  </Text>
                  <View style={styles.crossContainer}>
                    <CrossCircle size={15} color={Colors.Red} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{color: Colors.BodyText}}>
                {data?.placeholder || 'Select Options'}
              </Text>
            )}
          </View>

          <View>{clicked ? <UpArrowIcon /> : <DownArrowIcon />}</View>
        </TouchableOpacity>

        {clicked && (
          <View style={styles.dropdownOptions}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{paddingRight: responsiveScreenWidth(2)}}
                onPress={() => toggleSelection(item)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.Text,
                      selectedItems.some(i => i.type === item.type) &&
                        styles.selectedText,
                    ]}>
                    {item.type}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.crossContainer,
                      selectedItems.some(i => i.type === item.type) && {
                        backgroundColor: Colors.LightRed,
                      },
                    ]}
                    onPress={() => toggleSelection(item)}>
                    <CrossCircle
                      size={15}
                      color={
                        selectedItems.some(i => i.type === item.type)
                          ? Colors.Red
                          : undefined
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderBottomWidth: options.length === index + 1 ? 0 : 0.5,
                    borderBottomColor: Colors.BorderColor,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomMultiSelectDropDown;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    selectedItemsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: responsiveScreenWidth(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 4,
    },
    crossContainer: {
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownOptions: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    Text: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
    },
    selectedText: {
      color: Colors.Primary,
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
    },
  });
