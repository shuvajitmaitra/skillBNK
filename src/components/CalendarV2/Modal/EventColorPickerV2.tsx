import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import {fontSizes, gPadding} from '../../../constants/Sizes';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import {FeatherIcon} from '../../../constants/Icons';
import ColorPicker from '../ColorPicker';

const EventColorPickerV2 = ({
  activeColor,
  onCancelPress,
  onSelect,
}: {
  activeColor: string;
  onCancelPress: () => void;
  onSelect: (arg0: string) => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  return (
    <>
      <View style={styles.fieldContainer}>
        <Text style={styles.Text}>Color</Text>
        <TouchableOpacity
          onPress={() => setIsPickerVisible(!isPickerVisible)}
          style={{
            backgroundColor: Colors.Background_color,
            borderWidth: 1,
            overflow: 'hidden',
            borderColor: Colors.BorderColor,
            borderRadius: 10,
            paddingHorizontal: gPadding(10),
            minHeight: responsiveScreenHeight(5),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: gPadding(10),
            }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                backgroundColor: activeColor || Colors.Primary,
              }}
            />
            <Text
              style={{
                color: Colors.Heading,
                fontSize: fontSizes.body,
                fontFamily: CustomFonts.MEDIUM,
              }}>
              {activeColor !== Colors.Primary ? activeColor : 'Default Color'}
            </Text>
            {
              <FeatherIcon
                name={isPickerVisible ? 'chevron-down' : 'chevron-right'}
                size={25}
                color={Colors.BodyText}
                style={{marginLeft: -10}}
              />
            }
          </View>
          {activeColor !== Colors.Primary && (
            <TouchableOpacity
              onPress={() => {
                onCancelPress();
                setIsPickerVisible(!isPickerVisible);
              }}>
              <CrossCircle color={Colors.Heading} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {isPickerVisible && (
          <View>
            <ColorPicker
              active={
                activeColor !== Colors.Primary ? activeColor : Colors.Primary
              }
              onSelect={onSelect}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default EventColorPickerV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    fieldContainer: {
      marginBottom: 10,
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(0.5),
      color: Colors.Heading,
    },
  });
