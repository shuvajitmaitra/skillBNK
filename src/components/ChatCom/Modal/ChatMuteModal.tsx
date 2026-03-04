import {View, StyleSheet, TextInput, Text} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ModalCustomButton from './ModalCustomButton';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import moment from 'moment';
import {TColors} from '../../../types';
import {theme} from '../../../utility/commonFunction';

type ChatMuteModalProps = {
  fullName: string;
  onSave: (data: {
    actionType: string;
    date: Date | null;
    note: string;
    selectedOption: string | number;
  }) => void;
  onCancel: () => void;
  mute: {
    isMuted: boolean;
    date: Date | null;
  };
};

export default function ChatMuteModal({
  fullName,
  onSave,
  onCancel,
  mute,
}: ChatMuteModalProps) {
  // const [value, setValue] = React.useState(1);
  const [muteMessage, setMuteMessage] = useState('');
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [value, setValue] = useState<string | number>(1);
  const radioOptions = [
    {value: 1, label: 'For 1 hour'},
    {value: 2, label: 'For 1 day'},
    {value: 3, label: 'Mute until I turn back on'},
  ];

  return (
    <>
      {mute.isMuted ? (
        <View style={styles.modalHeading}>
          <Text style={styles.modalHeadingText}>
            <Text style={{color: Colors.Red}}>{fullName} </Text>
            {mute.date
              ? `will unmuted ${moment(mute.date).fromNow()}`
              : 'muted for until you turn it back'}
          </Text>
          <ModalCustomButton
            toggleModal={() =>
              onSave({
                actionType: 'unmute',
                date: null,
                note: muteMessage,
                selectedOption: value,
              })
            }
            textColor={Colors.PrimaryButtonTextColor}
            backgroundColor={Colors.PrimaryButtonBackgroundColor}
            buttonText="Unmute"
          />
        </View>
      ) : (
        <View style={styles.modalChild}>
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>
              Mute Options for {fullName}
            </Text>
          </View>

          {/* --------------------- */}
          {/* Modal Descriptions */}
          {/* --------------------- */}

          <View style={styles.modalDescription}>
            <Text style={styles.modalDescriptionText}>
              Muted members can&apos;t send message in this channel but he/she
              can read message
            </Text>
          </View>

          {/* --------------------- */}
          {/* Modal radio button */}
          {/* --------------------- */}

          <View style={styles.buttonGroup}>
            <GlobalRadioGroup
              options={radioOptions}
              selectedValue={value}
              onSelect={(val: string | number) => setValue(val)}
            />
          </View>

          {/* -------------------------- */}
          {/* ------- Add note Box ------- */}
          {/* --------------------------- */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>Add a note (optional)</Text>
            <TextInput
              keyboardAppearance={theme()}
              onChangeText={text => setMuteMessage(text)}
              placeholder="Describe the reason"
              placeholderTextColor={Colors.BodyText}
              style={styles.noteTextArea}
            />
          </View>
          {/* --------------------- */}
          {/* Modal Button Container */}
          {/* --------------------- */}

          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={onCancel}
              textColor={Colors.SecondaryButtonTextColor}
              backgroundColor={Colors.SecondaryButtonBackgroundColor}
              buttonText="Cancel"
              customContainerStyle={{
                borderWidth: 1,
                borderColor: Colors.BorderColor,
              }}
            />
            <ModalCustomButton
              toggleModal={() =>
                onSave({
                  actionType: 'mute',
                  date: null,
                  note: muteMessage,
                  selectedOption: value,
                })
              }
              textColor={Colors.PrimaryButtonTextColor}
              backgroundColor={Colors.PrimaryButtonBackgroundColor}
              buttonText="Save"
            />
          </View>
        </View>
      )}
    </>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modalChild: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      maxHeight: responsiveScreenHeight(80),
    },
    modalHeading: {
      // flexDirection: "row",
      justifyContent: 'flex-start',
      // alignItems: "center",
      paddingTop: responsiveScreenHeight(1.7),
      // gap: responsiveScreenWidth(2),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: 'rgba(71, 71, 72, 1)',
    },
    modalHeadingText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      marginBottom: 20,
    },
    //  -------------------------------------------------------------
    // Modal description
    // -------------------------------------------------------------
    modalDescription: {},

    modalDescriptionText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1.5),
    },

    //  -------------------------------------------------------------
    // Modal radio button
    // -------------------------------------------------------------
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonGroup: {
      marginHorizontal: responsiveScreenWidth(-1),
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
    },

    //  -------------------------------------------------------------
    // Modal Note area
    // -------------------------------------------------------------
    noteContainer: {},
    noteTitle: {
      fontSize: responsiveScreenFontSize(1.9),
      paddingVertical: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    noteTextArea: {
      backgroundColor: Colors.ModalBoxColor,
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(0.6),
      paddingBottom: responsiveScreenHeight(7),
      marginBottom: responsiveScreenHeight(1.4),
      borderRadius: responsiveScreenWidth(3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      fontSize: responsiveScreenFontSize(1.9),
    },
    //  -------------------------------------------------------------
    // Modal Button area
    // -------------------------------------------------------------
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingTop: responsiveScreenHeight(2.5),
    },
  });
