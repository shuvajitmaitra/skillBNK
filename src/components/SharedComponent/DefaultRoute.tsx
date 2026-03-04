import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CodingIcon from '../../assets/Icons/CodingIcon';
import {TColors} from '../../types';
import {} from '@react-navigation/stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import ScreenHeader from './ScreenHeader';

type DefaultRouteProps = NativeStackScreenProps<
  RootStackParamList,
  'DefaultRoute'
>;

const DefaultRoute: React.FC<DefaultRouteProps> = ({route}) => {
  const {title, description} = route.params;
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        flex: 1,
        paddingTop: top / 1.5,
      }}>
      <ScreenHeader />
      <View style={styles.mainContainer}>
        <CodingIcon />
        <Text style={styles.headingText}>{title}</Text>
        <View style={styles.bodyText}>
          <Text style={styles.bodyText}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

export default DefaultRoute;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      backgroundColor: Colors.Primary,
      width: responsiveWidth(50),
      alignSelf: 'center',
      height: 40,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
      marginHorizontal: responsiveScreenWidth(4),
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.8),
      color: Colors.Heading,
    },
    bodyText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.BodyText,
      textAlign: 'center',
      marginHorizontal: responsiveScreenWidth(4),
      lineHeight: responsiveScreenHeight(3),
    },
    buttonText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      textAlign: 'center',
    },
  });
