import React, {useState, useRef} from 'react';
import {StyleSheet, View, Animated, TouchableOpacity, Text} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CrossIcon from '../../assets/Icons/CrossIcon';
import PlusIcon from '../../assets/Icons/PlusIcon';
import UsersIcon from '../../assets/Icons/UsersIcon';
import SettingIcon from '../../assets/Icons/SettingIcon';
import CreateCrowdModal from './Modal/CreateCrowdModal';

const FloatingButton = ({UploadFile}) => {
  const Colors = useTheme();
  const imagePickerRef = useRef();
  const styles = getStyles(Colors);
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotation, {
      toValue: isOpen ? 0 : 1, // Rotate back to 0 degrees if closing
      duration: 400,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const pinStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
    ],
  };

  const thumbStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  };

  const heartStyle = {
    transform: [
      {scale: animation},
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -150],
        }),
      },
    ],
  };

  const rotationStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'], // Rotate from 0 to 90 degrees
        }),
      },
    ],
  };
  const [isCreateCrowdModalVisible, setIsCreateCrowdModalVisible] =
    useState(false);
  const toggleCreateCrowdModal = () => {
    setIsCreateCrowdModalVisible(!isCreateCrowdModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.button}>
        <Animated.View style={rotationStyle}>
          <Text style={styles.buttonText}>
            <CrossIcon />
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.button, styles.secondary, pinStyle]}>
        <TouchableOpacity onPress={toggleCreateCrowdModal}>
          <Text style={styles.buttonText}>
            <PlusIcon />
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.button, styles.secondary, thumbStyle]}>
        <TouchableOpacity onPress={() => imagePickerRef.current?.openSheet()}>
          <Text style={styles.buttonText}>
            <UsersIcon />
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.button, styles.secondary, heartStyle]}>
        <Text style={styles.buttonText}>
          <SettingIcon />
        </Text>
      </Animated.View>
      <CreateCrowdModal
        isCreateCrowdModalVisible={isCreateCrowdModalVisible}
        toggleCreateCrowdModal={toggleCreateCrowdModal}
      />
      {/* <MediaPicker UploadFile={UploadFile} ref={imagePickerRef} /> */}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    button: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowRadius: 10,
      shadowColor: '#00213B',
      shadowOpacity: 0.3,
      shadowOffset: {height: 10},
      backgroundColor: Colors.Foreground,
    },
    secondary: {
      width: 35,
      height: 35,
      borderRadius: 24,
      backgroundColor: Colors.PureWhite,
    },
    buttonText: {
      fontSize: 16,
      color: '#555',
    },
  });

export default FloatingButton;
