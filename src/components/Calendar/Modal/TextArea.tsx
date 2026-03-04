import {TextInput, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {theme} from '../../../utility/commonFunction';
type TextAreaProps = {
  placeholderText?: string;
  setState?: any;
  state?: any;
  readOnly?: boolean;
  height?: number;
  marginTop?: number;
  style?: {};
};

const TextArea = ({
  placeholderText,
  setState,
  state,
  readOnly = false,
  height,
  marginTop,
  style,
}: TextAreaProps) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <View
      style={[
        {
          height: 'auto',
          marginTop: responsiveScreenHeight(marginTop || 1),
          width: '100%',
          backgroundColor: Colors.ModalBoxColor,
          borderRadius: 10,
          borderWidth: 1,
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: responsiveScreenWidth(2),
          borderColor: Colors.BorderColor,
        },
        {...style},
      ]}>
      <TextInput
        keyboardAppearance={theme()}
        readOnly={readOnly}
        style={[
          {
            minHeight: responsiveScreenHeight(height || 10),
            width: '100%',
            marginHorizontal: responsiveScreenWidth(1),
            paddingRight: responsiveScreenWidth(1),
            marginVertical: responsiveScreenHeight(0.5),
            fontSize: responsiveScreenFontSize(1.8),
            color: Colors.Heading,

            fontFamily: CustomFonts.REGULAR,
            // textAlign: "justify",
            paddingVertical: responsiveScreenHeight(0.5),
            textAlignVertical: 'top',
          },
        ]}
        multiline={true}
        onChangeText={text => setState(text)}
        placeholderTextColor={Colors.BodyText}
        placeholder={placeholderText ? placeholderText : 'Write something...'}
        value={state}
      />
    </View>
  );
};

export default TextArea;
