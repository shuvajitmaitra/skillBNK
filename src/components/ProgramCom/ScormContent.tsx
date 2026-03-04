import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import WebView from 'react-native-webview';

import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import ReactNativeModal from 'react-native-modal';
import {PlayButtonIcon} from '../../assets/Icons/PlayButtonIcon';
import PlayIcon from '../../assets/Icons/PlayIcon';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';

export function fileNameToTitle(fileName: string): string {
  if (!fileName) return '';

  return fileName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

const ScormContent = ({scormContent}: any) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [openModal, setOpenModal] = useState(false);
  const onLaunch = () => {
    setOpenModal(!openModal);
  };
  const {top} = useSafeAreaInsets();
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {/* Top play icon */}
        <View style={styles.topIcon}>
          <PlayButtonIcon size={60} color={Colors.Primary} />
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {fileNameToTitle(scormContent.lesson.title)}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Module — SCORM Content</Text>

        {/* Button */}
        <Pressable
          style={({pressed}) => [styles.button, pressed && styles.pressed]}
          onPress={onLaunch}>
          <PlayIcon size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>Launch SCORM</Text>
        </Pressable>
      </View>
      <ReactNativeModal
        isVisible={openModal}
        onBackdropPress={() => {
          setOpenModal(!openModal);
        }}
        style={{margin: 0}}>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            backgroundColor: Colors.Background_color,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: top,
              paddingHorizontal: responsiveScreenWidth(2),
              paddingBottom: 5,
              alignItems: 'center',
              gap: 10,
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.Foreground,
                padding: 10,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: Colors.BorderColor,
              }}
              onPress={() => {
                setOpenModal(!openModal);
              }}>
              <ArrowLeft />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.programNameText}>
              {fileNameToTitle(scormContent.lesson.title)}
            </Text>
          </View>
          <WebView
            source={{
              uri: scormContent?.lesson?.url,
            }}
            style={{flex: 1}}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
          />
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default ScormContent;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    topIcon: {
      marginBottom: 22,
    },
    title: {
      fontSize: 22,
      lineHeight: 30,
      fontWeight: '700',
      color: Colors.Heading,
      textAlign: 'center',
      marginBottom: 18,
    },
    subtitle: {
      fontSize: 16,
      color: Colors.BodyText,
      marginBottom: 18,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: Colors.Primary,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 10,
      minWidth: 220,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 6},
      elevation: 4,
    },
    pressed: {
      transform: [{scale: 0.99}],
      opacity: 0.95,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    programNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 20,
      color: Colors.Heading,
      flex: 0.95,
    },
  });
