// CustomTabView.tsx
import React, {useEffect, useState, useCallback, memo, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts'; // Ensure this path is correct
import {useTheme} from '../../../context/ThemeContext'; // Ensure this path is correct
import ContentList from './ContentList'; // Ensure this path is correct
import {TProgram, TCategory} from '../../../types/program/programModuleType';
import {TColors} from '../../../types';

// Define the type for our Colors object returned from the theme

// Type for route objects used in the tab bar
interface Route {
  key: string;
  title: string;
}

// Props for the CustomTabBar component
interface CustomTabBarProps {
  routes: Route[];
  activeIndex: number;
  onTabPress: (index: number) => void;
  Colors: TColors;
}

// CustomTabBar Component
const CustomTabBar: React.FC<CustomTabBarProps> = ({
  routes,
  activeIndex,
  onTabPress,
  Colors,
}) => {
  // Generate dynamic styles using the Colors object
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  return (
    <View style={styles.tabContainerOuter}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => onTabPress(index)}
              style={[
                styles.tabItemContainer,
                isActive && styles.activeTabContainer,
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.tabText, isActive && styles.activeTabText]}>
                {route.title === 'Module' ? 'Modules' : route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Memoized ContentList Component to prevent unnecessary re-renders
const ContentListComp = memo(
  ({course, category}: {course: TProgram; category: string}) => {
    return <ContentList course={course} category={category} />;
  },
);

// Props for the main component
interface CusSegmentedButtonsProps {
  category: TCategory;
  course: TProgram;
}

const CusSegmentedButtons: React.FC<CusSegmentedButtonsProps> = ({
  category,
  course,
}) => {
  // Assume that useTheme returns an object matching TColors.
  const Colors = useTheme() as TColors;

  // Memoize styles based on Colors
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [routes, setRoutes] = useState<Route[]>([]);

  // Generate the routes based on active categories
  useEffect(() => {
    if (category?.categories) {
      const newRoutes = category.categories
        .filter(item => item.isActive)
        .map(item => ({
          key: item._id,
          title: item.name,
        }));
      setRoutes(newRoutes);
      // Reset active index if current index is out of bounds
      if (activeIndex >= newRoutes.length) {
        setActiveIndex(0);
      }
    } else {
      setRoutes([]);
    }
  }, [category, activeIndex]);

  // Render content based on active tab
  const renderContent = useCallback(() => {
    if (routes.length === 0) {
      return (
        <View style={styles.noContentContainer}>
          <Text style={[styles.noContentText, {color: Colors.Heading}]}>
            No Content Found
          </Text>
        </View>
      );
    }

    return (
      <ContentListComp course={course} category={routes[activeIndex]?.key} />
    );
  }, [routes, activeIndex, course, Colors, styles]);

  return (
    <View style={styles.container}>
      <View>
        {routes.length > 0 && (
          <CustomTabBar
            routes={routes}
            activeIndex={activeIndex}
            onTabPress={setActiveIndex}
            Colors={Colors}
          />
        )}
      </View>
      <View style={{flex: 1}}>{renderContent()}</View>
    </View>
  );
};

export default CusSegmentedButtons;

// Create dynamic styles based on the Colors object
const createStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
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
    contentContainer: {
      flex: 1,
    },
    noContentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noContentText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.REGULAR,
    },
  });
