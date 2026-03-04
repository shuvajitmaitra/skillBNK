// BottomNavigationContainer.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import MyButton from '../../AuthenticationCom/MyButton';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../types/navigation';

const BottomNavigationContainer = () => {
  const Colors = useTheme();
  const styles = getStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <MyButton
          onPress={() =>
            navigation.navigate('ProgramStack', {
              screen: 'TechnicalTestScreen',
            })
          }
          title="Technical Test"
          fontSize={responsiveScreenFontSize(1.8)}
          height={responsiveScreenHeight(4)}
          bg={Colors.Primary}
          colour={Colors.PureWhite}
          flex={0.4}
        />
        {/* Example Button for Mock Interview */}
        <MyButton
          onPress={() =>
            navigation.navigate('ProgramStack', {screen: 'MockInterview'})
          }
          title="Mock Interview"
          fontSize={responsiveScreenFontSize(1.8)}
          height={responsiveScreenHeight(4)}
          bg={Colors.Primary}
          colour={Colors.PureWhite}
          flex={0.4}
        />
      </View>
    </View>
  );
};

export default BottomNavigationContainer;
const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      // 'gap' is available in newer React Native versions; otherwise, you might need to use margin
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(1),
    },
    mainContainer: {
      marginHorizontal: responsiveScreenWidth(2),
      alignItems: 'center',
    },
  });
