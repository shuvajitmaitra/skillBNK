import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Popover, {Rect} from 'react-native-popover-view';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import UserIcon from '../../../assets/Icons/UserIcon';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../types/navigation';
import {TColors} from '../../../types';
type CreateChatPopup = {
  position: {x: number; y: number} | null;
  setPosition: (position: {x: number; y: number} | null) => void;
  toggleCreateCrowdModal: () => void;
};

const CreateChatPopup = ({
  position,
  setPosition,
  toggleCreateCrowdModal,
}: CreateChatPopup) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Popover
      backgroundStyle={{backgroundColor: Colors.BackDropColor}}
      popoverStyle={styles.popoverStyle}
      from={new Rect(position?.x ?? 0, position?.y ?? 0, 0, 0)}
      isVisible={Boolean(position)}
      onRequestClose={() => setPosition(null)}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => {
            setPosition(null);
            navigation.navigate('CreateNewUser');
          }}
          style={styles.buttonContainer}>
          <UserIcon color={Colors.BodyText} />
          <Text style={styles.text}>Create Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setPosition(null);
            toggleCreateCrowdModal();
          }}
          style={styles.buttonContainer}>
          <CrowdIcon color={Colors.BodyText} />
          <Text style={styles.text}>Create Crowd</Text>
        </TouchableOpacity>
      </View>
    </Popover>
  );
};

export default CreateChatPopup;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      paddingVertical: 10,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 10,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    popoverStyle: {
      backgroundColor: Colors.Foreground,
    },
    content: {
      borderRadius: 5,
      gap: 10,
      backgroundColor: Colors.Foreground,
      padding: 10,
      width: 200,
    },
    text: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
  });
