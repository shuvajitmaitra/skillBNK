import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MessageNotificationContainer from '../MessageNotificationContainer';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {TColors} from '../../types';
import {EntypoIcon} from '../../constants/Icons';
import {borderRadius, gGap} from '../../constants/Sizes';

interface HeaderProps {
  navigation: {
    goBack: () => void;
  };
  onFilterPress: ({x, y}: {x: number; y: number}) => void;
}

const TechnicalTestHeader: React.FC<HeaderProps> = ({
  navigation,
  onFilterPress,
}) => {
  const Colors = useTheme();
  const {top} = useSafeAreaInsets();
  const styles = getStyles(Colors);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingHorizontal: responsiveScreenWidth(2),
          paddingBottom: 3,
        },
      ]}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Foreground,
          padding: 10,
          borderRadius: 100,
        }}
        onPress={() => navigation.goBack()}>
        <ArrowLeft />
      </TouchableOpacity>

      <View style={styles.MessageNotificationContainer}>
        <TouchableOpacity
          onPress={(e: any) => {
            onFilterPress({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY});
          }}
          style={{
            backgroundColor: Colors.Foreground,
            width: 50,
            height: 50,
            marginRight: gGap(10),
            borderRadius: borderRadius.circle,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <EntypoIcon name="sound-mix" size={20} color={Colors.BodyText} />
        </TouchableOpacity>
        <MessageNotificationContainer />
      </View>
    </View>
  );
};

export default TechnicalTestHeader;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Background_color,
      alignItems: 'center',
    },
    MessageNotificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
