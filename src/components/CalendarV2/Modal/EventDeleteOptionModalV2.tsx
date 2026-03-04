import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {RootState} from '../../../store/reducer/combineReducer';
import {useSelector} from 'react-redux';
import {
  fontSizes,
  gBorderRadius,
  gMargin,
  gPadding,
} from '../../../constants/Sizes';
import {TColors} from '../../../types';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import store from '../../../store';
import {updateCalInfo} from '../../../store/reducer/calendarReducerV2';
type EventDeleteProps = {
  onCancel?: () => void;
  onRemove: (option: string) => void;
};
const EventDeleteOptionModalV2 = ({
  onCancel = () => {},
  onRemove,
}: EventDeleteProps) => {
  const {calendarInfo} = useSelector((state: RootState) => state.calendarV2);
  const [selectedOption, setSelectedOption] = useState('thisEvent');

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <ReactNativeModal
      isVisible={calendarInfo.isEventDeleteOptionVisible}
      style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Manage recurring event</Text>
          <Text style={styles.subtitle}>
            Select events to manage from the series.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleOptionSelect('thisEvent')}>
            <View style={styles.radioContainer}>
              {selectedOption === 'thisEvent' ? (
                <View style={styles.radioSelected}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radioUnselected} />
              )}
            </View>
            <Text style={styles.optionText}>This event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleOptionSelect('thisAndFollowing')}>
            <View style={styles.radioContainer}>
              {selectedOption === 'thisAndFollowing' ? (
                <View style={styles.radioSelected}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radioUnselected} />
              )}
            </View>
            <Text style={styles.optionText}>
              This Event and Following Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleOptionSelect('allEvents')}>
            <View style={styles.radioContainer}>
              {selectedOption === 'allEvents' ? (
                <View style={styles.radioSelected}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radioUnselected} />
              )}
            </View>
            <Text style={styles.optionText}>All events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              onCancel();
              store.dispatch(
                updateCalInfo({isEventDeleteOptionVisible: false}),
              );
            }}>
            <View style={styles.cancelIconContainer}>
              <Text style={styles.cancelIcon}>✕</Text>
            </View>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              onRemove(selectedOption);
              store.dispatch(
                updateCalInfo({isEventDeleteOptionVisible: false}),
              );
            }}>
            <View style={styles.bookmarkIconContainer}>
              <Text style={styles.bookmarkIcon}>⊂⊃</Text>
            </View>
            <Text style={styles.removeText}>Confirm & Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default EventDeleteOptionModalV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: Colors.Foreground,
      borderRadius: 8,
      padding: gPadding(10),
      paddingTop: gPadding(5),
    },
    headerContainer: {
      marginBottom: gMargin(10),
    },
    title: {
      fontSize: fontSizes.subHeading,
      fontWeight: 'bold',
      color: Colors.Heading,
    },
    subtitle: {
      fontSize: fontSizes.small,
      color: Colors.BodyText,
    },
    optionsContainer: {
      //   marginBottom: 20,
      gap: gPadding(5),
      marginBottom: gPadding(10),
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: gPadding(8),
      paddingHorizontal: 10,
      borderRadius: gBorderRadius(5),
      backgroundColor: Colors.Background_color,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    radioContainer: {
      marginRight: 12,
    },
    radioUnselected: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ccc',
    },
    radioSelected: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#4a6ad5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#4a6ad5',
    },
    optionText: {
      fontSize: fontSizes.body,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      //   backgroundColor: 'blue',
      gap: 10,
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: gPadding(5),
      borderRadius: 4,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
    },
    cancelIconContainer: {
      marginRight: 8,
    },
    cancelIcon: {
      fontWeight: 'bold',
      color: Colors.SecondaryButtonTextColor,
    },
    cancelText: {
      fontWeight: '500',
      color: Colors.SecondaryButtonTextColor,
    },
    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      //   paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 4,
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
    },
    bookmarkIconContainer: {
      marginRight: 8,
    },
    bookmarkIcon: {
      color: Colors.PrimaryButtonTextColor,
      fontWeight: 'bold',
    },
    removeText: {
      color: Colors.PrimaryButtonTextColor,
      fontWeight: '500',
    },
  });
