import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {TColors} from '../../types';
import {showToast} from '../HelperFunction';
import ReactNativeModal from 'react-native-modal';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../constants/ToastConfig';
import {theme} from '../../utility/commonFunction';

// Define an interface for each option item.
export interface OptionItem {
  type: string;
  data: string;
}

// Define the component props.
interface CrowdSelectModalProps {
  options: OptionItem[];
  initialSelections?: OptionItem[];
  setState: (newState: any) => void;
  data?: {
    message?: string;
    placeholder?: string;
  };
  isVisible: boolean;
  onCancelPress: () => void;
}

export const CrowdSelectModal: React.FC<CrowdSelectModalProps> = ({
  options,
  initialSelections = [],
  setState,
  data,
  isVisible,
  onCancelPress,
}) => {
  const [selectedItems, setSelectedItems] =
    useState<OptionItem[]>(initialSelections);

  useEffect(() => {
    setSelectedItems(initialSelections);
  }, [initialSelections]);

  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const [inputText, setInputText] = useState('');

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
  function searchInArray(searchText: string, array: OptionItem[]) {
    // Handle empty or invalid inputs
    if (!searchText || !Array.isArray(array)) {
      return array;
    }

    // Convert search text to lowercase for case-insensitive search
    const searchLower = searchText.toLowerCase();

    // Filter array based on search text matching the 'data' property
    return array.filter(item => {
      // Ensure item and item.data exist and item.data is a string
      if (item && typeof item.type === 'string') {
        return item.type.toLowerCase().includes(searchLower);
      }
      return false;
    });
  }

  const searchResult = searchInArray(inputText, options);
  return (
    <ReactNativeModal
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={onCancelPress}
      isVisible={isVisible}
      avoidKeyboard={true}>
      <View
        style={{
          padding: gGap(15),
          borderTopRightRadius: gGap(20),
          borderTopLeftRadius: gGap(20),
          // borderWidth: 1,
          // borderColor: Colors.BorderColor,
          backgroundColor: Colors.Background_color,
        }}>
        <Text
          style={{
            fontSize: fontSizes.subHeading,
            color: Colors.Heading,
            fontWeight: '600',
            marginTop: gGap(10),
            marginBottom: gGap(5),
          }}>
          Search Crowds
        </Text>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
          }}>
          <TextInput
            keyboardAppearance={theme()}
            placeholder="Search Crowd..."
            placeholderTextColor={Colors.BodyText}
            style={styles.inputField}
            onChangeText={t => {
              setInputText(t);
            }}
            value={inputText}
          />
          {inputText && (
            <Pressable
              onPress={(e: any) => {
                e.stopPropagation();
                setInputText('');
              }}
              style={[
                styles.crossContainer,
                {position: 'absolute', right: gGap(10)},
              ]}>
              <CrossCircle size={25} color={Colors.BodyText} />
            </Pressable>
          )}
        </View>
        {selectedItems.length > 0 && (
          <Text
            style={{
              fontSize: fontSizes.subHeading,
              color: Colors.Heading,
              fontWeight: '600',
              marginTop: gGap(10),
              marginBottom: gGap(5),
            }}>
            Selected Crowds
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 5,
          }}>
          {selectedItems.length > 0 &&
            selectedItems.map((item, index) => (
              <TouchableOpacity
                onPress={() => toggleSelection(item)}
                style={styles.selectedItemsContainer}
                key={index}>
                <Text
                  numberOfLines={1}
                  style={{
                    paddingVertical: responsiveScreenHeight(0.5),
                    color: Colors.BodyText,
                    fontSize: fontSizes.body,
                    flexBasis: '93%',
                  }}>
                  {item.type}
                </Text>
                <View style={styles.crossContainer}>
                  <CrossCircle size={22} color={Colors.Red} />
                </View>
              </TouchableOpacity>
            ))}
        </View>
        <View
          style={{
            marginTop: gGap(10),
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: fontSizes.subHeading,
              color: Colors.Heading,
              fontWeight: '600',
            }}>
            Total Crowds{' '}
          </Text>
          <Text
            style={{
              fontSize: fontSizes.body,
              color: Colors.BodyText,
            }}>
            ({data?.message})
          </Text>
        </View>
        <View
          style={[
            styles.dropdownOptions,
            searchResult.length === 0 && {
              backgroundColor: Colors.Red + '30',
              borderColor: Colors.Red + '40',
            },
          ]}>
          <ScrollView contentContainerStyle={{gap: gGap(4)}}>
            {searchResult.length > 0 ? (
              searchResult.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  // style={{paddingRight: responsiveScreenWidth(2)}}
                  onPress={() => toggleSelection(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.Text,
                        selectedItems.some(i => i.type === item.type) &&
                          styles.selectedText,
                        {
                          flexBasis: '92%',
                        },
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
                        size={22}
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
                      marginTop: gGap(5),
                    }}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={{
                  fontSize: fontSizes.subHeading,
                  color: Colors.Heading,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                No crowd found
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default CrowdSelectModal;

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
      maxHeight: gGap(200),
      borderWidth: 1,
      padding: gGap(10),
      marginTop: gGap(5),
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.default,
    },
    Text: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      color: Colors.BodyText,
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
      color: Colors.BodyText,
    },
  });
