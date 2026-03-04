import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from '../../context/ThemeContext';
import PlusIcon from '../../assets/Icons/PlusIcon';
import CustomFonts from '../../constants/CustomFonts';
import {gFontSize} from '../../constants/Sizes';
import {MaterialCommunityIcon, MaterialIcon} from '../../constants/Icons';
import {TColors} from '../../types';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const FloatingActionButtonV2 = ({
  onEventPress,
  onTaskPress,
}: {
  onEventPress: () => void;
  onTaskPress: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const rotation = useSharedValue(0);
  const button1Y = useSharedValue(0);
  const button2Y = useSharedValue(0);

  const toggleMenu = () => {
    if (isOpen) {
      // Close the menu
      rotation.value = withSpring(0, {damping: 10});
      button1Y.value = withSpring(0, {damping: 10});
      button2Y.value = withSpring(0, {damping: 10});
    } else {
      // Open the menu
      rotation.value = withSpring(45, {damping: 10});
      button1Y.value = withSpring(-45, {damping: 10});
      button2Y.value = withSpring(-90, {damping: 10});
    }
    setIsOpen(!isOpen);
  };

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const button1Style = useAnimatedStyle(() => ({
    transform: [{translateY: button1Y.value}],
  }));

  const button2Style = useAnimatedStyle(() => ({
    transform: [{translateY: button2Y.value}],
  }));

  return (
    <>
      {/* Overlay to detect taps outside the FAB */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      <View style={styles.container}>
        {/* Button 1: Create new Crowd */}
        {isOpen && (
          <Animated.View style={[styles.secondaryButton, button1Style]}>
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                onTaskPress();
              }}
              style={styles.actionButton}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Task</Text>
              </View>
              <View style={styles.iconContainer}>
                {/* <CrowdIcon size={25} color={Colors.PureWhite} /> */}
                <MaterialIcon
                  name="task-alt"
                  size={22}
                  color={Colors.PureWhite}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Button 2: Create New Chat */}
        {isOpen && (
          <Animated.View style={[styles.secondaryButton, button2Style]}>
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                onEventPress();
              }}
              style={styles.actionButton}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Event</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcon
                  size={22}
                  name={'calendar'}
                  color={Colors.PureWhite}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main FAB */}
        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <Animated.Text style={[styles.fabText, rotationStyle]}>
            <PlusIcon color={Colors.PureWhite} />
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: screenWidth,
      height: screenHeight,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    container: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      alignItems: 'flex-end',
      zIndex: 2, // Ensure FAB is above the overlay
    },
    fab: {
      width: gFontSize(35),
      height: gFontSize(35),
      borderRadius: 30,
      backgroundColor: Colors.Primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    fabText: {
      fontSize: 30,
      color: Colors.PureWhite,
      transform: [{rotate: '0deg'}],
    },
    secondaryButton: {
      position: 'absolute',
      width: 180,
      height: 50,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      justifyContent: 'flex-end',
    },
    buttonTextContainer: {
      backgroundColor: Colors.Primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    iconContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      height: 35,
      width: 35,
    },
    buttonText: {
      color: Colors.PureWhite,
      fontSize: 14,
      textAlign: 'center',
      fontFamily: CustomFonts.MEDIUM,
    },
  });

export default FloatingActionButtonV2;
