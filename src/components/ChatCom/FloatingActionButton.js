import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import CrowdIcon from '../../assets/Icons/CrowedIcon';
import {useTheme} from '../../context/ThemeContext';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import ChatIconBig from '../../assets/Icons/ChatIconBig';
import ChatIcon from '../../assets/Icons/ChatIcon';
import UserIcon from '../../assets/Icons/UserIcon';
import PlusIcon from '../../assets/Icons/PlusIcon';
import CustomFonts from '../../constants/CustomFonts';

const FloatingActionButton = () => {
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
    <View style={styles.container}>
      {/* Button 1: Create new Crowd */}
      {isOpen && (
        <Animated.View style={[styles.secondaryButton, button1Style]}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Create new crowd</Text>
            </View>
            <View style={styles.iconContainer}>
              <CrowdIcon size={25} color={Colors.PureWhite} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Button 2: Create New Chat */}
      {isOpen && (
        <Animated.View style={[styles.secondaryButton, button2Style]}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Create new chat</Text>
            </View>
            <View style={styles.iconContainer}>
              <UserIcon size={22} color={Colors.PureWhite} />
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
  );
};

const getStyles = Colors =>
  StyleSheet.create({
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
    container: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      alignItems: 'flex-end',
      //   zIndex: 1,
    },
    fab: {
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: Colors.Primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
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
      // borderRadius: 25,
      // backgroundColor: 'red',
    },
    actionButton: {
      // width: '100%',
      // height: '100%',
      // justifyContent: 'center',
      // alignItems: 'center',
      //   backgroundColor: '#03dac6',
      // borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      justifyContent: 'flex-end',
      paddingHorizontal: 10,
    },
    buttonText: {
      color: Colors.PureWhite,
      fontSize: 14,
      textAlign: 'center',
      fontFamily: CustomFonts.MEDIUM,
    },
  });

export default FloatingActionButton;
