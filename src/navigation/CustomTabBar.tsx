// src/components/CustomTabBar.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import HomeIcon from '../assets/Icons/HomeIcon';
import ProgramIcon from '../assets/Icons/ProgramIcon';
import CalenderIcon from '../assets/Icons/CalenderIcon';
import CommunityIcon from '../assets/Icons/CommunityIcon';
import {useTheme} from '../context/ThemeContext';
import CustomFonts from '../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {gFontSize, gHeight} from '../constants/Sizes';
import {TColors} from '../types';

// -----------------------------
// Helper Functions for Dynamic Styles
// -----------------------------
const getTabIconContainerStyle = (
  isFocused: boolean,
  Colors: TColors,
): ViewStyle => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isFocused ? Colors.Primary : 'transparent',
  paddingVertical: 2,
  paddingHorizontal: 12,
  borderRadius: 100,
  marginBottom: 4,
});

const getLabelStyle = (isFocused: boolean, Colors: TColors): TextStyle => ({
  color: isFocused ? Colors.Primary : Colors.BodyText,
  fontFamily: isFocused ? CustomFonts.BOLD : CustomFonts.MEDIUM,
  fontSize: responsiveScreenFontSize(1.5),
});

// -----------------------------
// TabBarIcon Component (defined outside CustomTabBar)
// -----------------------------
interface TabBarIconProps {
  routeName: string;
  isFocused: boolean;
  Colors: TColors;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  routeName,
  isFocused,
  Colors,
}) => {
  switch (routeName) {
    case 'HomeStack':
      return (
        <>
          <View style={getTabIconContainerStyle(isFocused, Colors)}>
            <HomeIcon
              size={gFontSize(26)}
              color={isFocused ? Colors.PureWhite : Colors.BodyText}
            />
          </View>
          <Text style={getLabelStyle(isFocused, Colors)}>Home</Text>
        </>
      );
    case 'ProgramStack':
      return (
        <>
          <View style={getTabIconContainerStyle(isFocused, Colors)}>
            <ProgramIcon
              size={gFontSize(26)}
              color={isFocused ? Colors.PureWhite : Colors.BodyText}
            />
          </View>
          <Text style={getLabelStyle(isFocused, Colors)}>Program</Text>
        </>
      );
    case 'MyCalenderStack':
      return (
        <>
          <View style={getTabIconContainerStyle(isFocused, Colors)}>
            <CalenderIcon
              color={isFocused ? Colors.PureWhite : Colors.BodyText}
            />
          </View>
          <Text style={getLabelStyle(isFocused, Colors)}>Calendar</Text>
        </>
      );
    case 'CommunityStack':
      return (
        <>
          <View style={getTabIconContainerStyle(isFocused, Colors)}>
            <CommunityIcon
              size={24}
              color={isFocused ? Colors.PureWhite : Colors.BodyText}
            />
          </View>
          <Text style={getLabelStyle(isFocused, Colors)}>Community</Text>
        </>
      );
    default:
      return null;
  }
};

// -----------------------------
// Static Styles (non-dynamic styles)
// -----------------------------
const staticStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // Shadow styles:
    shadowColor: '#000', // a default fallback; will override below with Colors.Gray if available
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
});

// -----------------------------
// CustomTabBar Component
// -----------------------------
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const Colors: TColors = useTheme();

  // const handleDefaultRoute = () => {
  //   navigation.navigate('DefaultRoute', {
  //     title: 'Enrollment is not available',
  //     description:
  //       'Sorry, You have not enrolled at any Bootcamp yet. Please explore your Institutes website to enroll your preferred bootcamp!\n or \n If you already enrolled, please select your program.',
  //   });
  // };

  return (
    <View style={{backgroundColor: Colors.Background_color}}>
      <View
        style={[
          staticStyles.tabContainer,
          {
            backgroundColor: Colors.Foreground,
            paddingBottom: Platform.OS === 'ios' ? 10 : 0,
            height: gHeight(70),
            shadowColor: Colors.Gray,
          },
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            // if (
            //   (route.name === 'MyCalenderStack' &&
            //     !navigationData.myCalendar) ||
            //   (route.name === 'ProgramStack' && !navigationData.myProgram)
            // ) {
            //   return handleDefaultRoute();
            // }

            // if (route.name === 'CommunityStack') {
            // Uncomment and modify if needed:
            // }

            // if (route.name === 'MyCalenderStack') {
            //   loadCalendarEvent();
            //   loadEventInvitation();
            // }

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              // testID={options.tabBarTestID}
              onPress={onPress}
              style={staticStyles.tabItem}>
              <TabBarIcon
                routeName={route.name}
                isFocused={isFocused}
                Colors={Colors}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
