import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';

type buttonContainerProps = {
  generatePrompt: () => void;
  onApplyPress: () => void;
  handleCancelButton: () => void;
  onResetPress: () => void;
  resetVisible: boolean;
};

const AiButtonContainer = ({
  generatePrompt,
  onApplyPress,
  handleCancelButton,
  onResetPress,
  resetVisible,
}: buttonContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={{flexDirection: 'row', gap: 10, width: '95%'}}>
      <TouchableOpacity
        onPress={() => {
          generatePrompt();
        }}
        style={[
          styles.buttonContainer,
          {backgroundColor: Colors.PrimaryOpacityColor},
        ]}>
        <Text style={[styles.buttonText, {color: Colors.Primary}]}>
          Generate
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // onCancelPress();
          handleCancelButton();
        }}
        style={[styles.buttonContainer, {backgroundColor: Colors.LightRed}]}>
        <Text style={[styles.buttonText, {color: Colors.Red}]}>Cancel</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => {}} style={[styles.buttonContainer, { backgroundColor: Colors.LightRed }]}>
        <Text style={[styles.buttonText, { color: Colors.Red }]}>Undo</Text>
      </TouchableOpacity> */}
      {resetVisible && (
        <TouchableOpacity
          onPress={() => {
            onResetPress();
          }}
          style={[
            styles.buttonContainer,
            {backgroundColor: Colors.CyanOpacity},
          ]}>
          <Text style={[styles.buttonText, {color: Colors.PureCyan}]}>
            Reset
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          onApplyPress();
        }}
        style={[styles.buttonContainer, {backgroundColor: Colors.Primary}]}>
        <Text style={[styles.buttonText, {color: Colors.PureWhite}]}>
          Apply
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AiButtonContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      flex: 1,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7,
      backgroundColor: Colors.Primary,
    },
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
      color: Colors.PureWhite,
    },
  });
