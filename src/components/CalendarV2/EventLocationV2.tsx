import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {FontAwesome5Icon, FontAwesomeIcon} from '../../constants/Icons';
import GoogleMeetIcon from '../../assets/Icons/GoogleMeetIcon';
import {gPadding} from '../../constants/Sizes';
import {TextInput} from 'react-native-gesture-handler';
import {theme} from '../../utility/commonFunction';

type LocationType = string | null;

interface EventLocationV2Props {
  onSelect: (type: LocationType) => void;
  setMeetingLink: (link: string) => void;
  selected: LocationType;
  link?: string;
}

const EventLocationV2 = ({
  onSelect,
  selected,
  setMeetingLink,
  link = '',
}: EventLocationV2Props) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const options = {
    meet: <GoogleMeetIcon />,
    zoom: (
      <FontAwesomeIcon name="video-camera" size={30} color={Colors.Primary} />
    ),
    call: <FontAwesome5Icon name="phone" size={30} color={Colors.BodyText} />,
    custom: (
      <FontAwesome5Icon name="pencil-ruler" size={30} color={Colors.BodyText} />
    ),
  };

  const handleSelect = (type: LocationType) => {
    onSelect(type);
    // Clear link when switching types, except for custom
    if (type !== 'custom' && link) {
      setMeetingLink('');
    }
  };

  const handleLinkChange = (text: string) => {
    // Only allow link input for appropriate types
    if (selected && ['meet', 'zoom', 'custom', 'call'].includes(selected)) {
      setMeetingLink(text);
    }
  };

  const getPlaceholder = () => {
    switch (selected) {
      case 'meet':
        return 'Enter Google Meet link';
      case 'zoom':
        return 'Enter Zoom link';
      case 'custom':
        return 'Enter location or link';
      case 'call':
        return 'Enter phone number';
      default:
        return 'Select a location type first';
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: gPadding(10),
        }}>
        {Object.entries(options).map(([key, icon]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.buttonContainer,
              selected === key && styles.selectedButton,
            ]}
            onPress={() => handleSelect(key as LocationType)}>
            {icon}
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        keyboardAppearance={theme()}
        style={[styles.textInput, !selected && styles.disabledInput]}
        onChangeText={handleLinkChange}
        placeholder={getPlaceholder()}
        value={link}
        editable={!!selected}
        keyboardType={selected === 'call' ? 'decimal-pad' : 'url'}
        placeholderTextColor={Colors.BodyText}
        secureTextEntry={false}
      />
    </View>
  );
};

export default EventLocationV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
    },
    buttonContainer: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      padding: gPadding(15),
      height: 70,
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
    },
    selectedButton: {
      borderColor: Colors.Primary,
      borderWidth: 2,
    },
    textInput: {
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      padding: gPadding(10),
      marginTop: gPadding(10),
      borderRadius: 5,
      color: Colors.BodyText,
    },
    disabledInput: {
      backgroundColor: Colors.DisableSecondaryBackgroundColor,
      opacity: 0.7,
    },
  });
