import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {RootState} from '../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedCategory} from '../../store/reducer/programReducer';

const ProgramTabBar = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {categories, selectedCategory} = useSelector(
    (state: RootState) => state.program,
  );
  const dispatch = useDispatch();
  return (
    <View style={styles.tabContainerOuter}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContainer}>
        {categories &&
          categories.map(route => {
            return (
              <TouchableOpacity
                key={route._id}
                onPress={() => {
                  dispatch(setSelectedCategory(route));
                }}
                style={[
                  styles.tabItemContainer,
                  selectedCategory?._id === route._id &&
                    styles.activeTabContainer,
                ]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.tabText,
                    selectedCategory?._id === route._id && styles.activeTabText,
                  ]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default ProgramTabBar;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    tabContainerOuter: {
      backgroundColor: Colors.Foreground, // Active tab background color
      marginHorizontal: responsiveScreenWidth(4),
      borderRadius: 100,
    },
    tabBarContainer: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
    },
    tabItemContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 50,
    },
    activeTabContainer: {
      backgroundColor: Colors.Primary, // Active tab background color
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabText: {
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.BodyText, // Inactive tab text color
      fontFamily: CustomFonts.SEMI_BOLD,
      textAlign: 'center',
    },
    activeTabText: {
      color: Colors.PureWhite, // Active tab text color
    },
  });
