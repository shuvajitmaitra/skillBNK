import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {TColors} from '../../../types';

type aiTopSectionProps = {
  setIsDrawerVisible: () => void;
  preVisible: boolean;
  setPreVisible: React.Dispatch<React.SetStateAction<boolean>>;
  previousResult: string;
};

const IIcon = Ionicons as any;
const AiTopSection = ({
  setIsDrawerVisible,
  preVisible,
  setPreVisible,
  previousResult,
}: aiTopSectionProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.topContainer}>
      <TouchableOpacity
        onPress={() => {
          setIsDrawerVisible();
        }}
        style={styles.drawerContainer}>
        <IIcon name="menu" size={30} color={Colors.Heading} />
      </TouchableOpacity>
      {previousResult && (
        <View style={styles.undoContainer}>
          {preVisible ? (
            <TouchableOpacity
              onPress={() => setPreVisible(false)}
              style={styles.undoRedoBtnContainer}>
              <IIcon name="arrow-redo" size={24} color={Colors.Primary} />
              <Text style={styles.buttonText}>Redo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setPreVisible(true)}
              style={[
                styles.undoRedoBtnContainer,
                {backgroundColor: Colors.LightRed},
              ]}>
              <IIcon name="arrow-undo" size={24} color={Colors.Red} />
              <Text style={[styles.buttonText, {color: Colors.Red}]}>Undo</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default AiTopSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    undoRedoBtnContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 4,
    },

    topContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: responsiveScreenWidth(4),
    },
    drawerContainer: {
      zIndex: 1,
    },
    undoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.HR,
      color: Colors.Primary,
    },
  });
