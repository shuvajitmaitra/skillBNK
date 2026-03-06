import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { useTheme } from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import ScreenHeader from '../../components/SharedComponent/ScreenHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalRadioGroup from '../../components/SharedComponent/GlobalRadioButton';
import { RegularFonts } from '../../constants/Fonts';
import { TColors } from '../../types';
import { storage } from '../../utility/mmkvInstance';
import { theme } from '../../utility/commonFunction';
type DisplayMode = 'dark' | 'default' | 'light';

const DisplaySettingsScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const colorScheme = useColorScheme();
  const [checked, setChecked] = useState<string | number>(
    storage?.getString('displayMode') || 'default',
  );
  const options = [
    { value: 'default', label: 'Default' },
    { value: 'dark', label: 'Dark' },
  ];
  useEffect(() => {
    if (storage?.getString('displayMode')) {
      setChecked(storage?.getString('displayMode') as DisplayMode);
    }
  }, []);
  const storeDisplayMode = async (mode: string) => {
    storage?.set('displayMode', mode);
  };

  const handleRadioChecked = (sts: string | number) => {
    setChecked(sts);
    if (sts === 'default') {
      storeDisplayMode(sts);
    } else if (sts === 'dark') {
      storeDisplayMode(sts);
    } else if (colorScheme === 'dark') {
      storeDisplayMode('dark');
    } else if (colorScheme === 'light') {
      storeDisplayMode('default');
    }
  };
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Foreground}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <ScreenHeader />
      <Text style={styles.headingText}>Display settings</Text>
      <Text style={styles.description}>Choose your display color</Text>
      <View style={styles.themeContainer}>
        <GlobalRadioGroup
          options={options}
          onSelect={(status: string | number) => handleRadioChecked(status)}
          selectedValue={checked}
          customStyle={styles.customStyle}
        />
      </View>
    </View>
  );
};

export default DisplaySettingsScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    customStyle: {
      flexDirection: 'row',
      gap: 30,
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      width: responsiveScreenWidth(40),
      paddingRight: responsiveScreenWidth(2),
      borderRadius: 10,
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Heading,
    },
    themeContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.Background_color,
      justifyContent: 'space-between',
      borderRadius: 10,
      paddingVertical: responsiveScreenHeight(3),
      paddingHorizontal: responsiveScreenHeight(2),
      marginVertical: responsiveScreenHeight(2),
    },
    description: {
      color: Colors.BodyText,
      // paddingTop: responsiveScreenHeight(0.5),
      fontFamily: CustomFonts.REGULAR,
    },
    headingText: {
      color: Colors.Heading,
      fontSize: RegularFonts.HL,
      fontFamily: CustomFonts.LATO_BOLD,
      marginTop: 10,
    },
    container: {
      flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      paddingVertical: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.Foreground,
      minHeight: responsiveScreenHeight(10),
    },
  });
