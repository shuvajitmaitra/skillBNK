import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {CameraView, useCameraPermissions} from 'expo-camera';
import CrossIcon from '../../assets/Icons/CrossIcon';
import RefreshIcon from '../../assets/Icons/RefreshIcon';
import {ScrollView} from 'react-native';
import {Image} from 'react-native';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FullScreenModal from './FullScreenModal';
import CameraImagePreview from './CameraImagePreview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGlobalAlert} from './GlobalAlertContext';
const Camera = ({isVisible, toggleCamera, handleSendCapturedPhoto}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [gallery, setGallery] = useState([]);
  const cameraRef = useRef(null);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        setIsImagePreviewVisible(true);
        setGallery([photo.uri]);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  if (!permission || !permission.granted) {
    return null; // You can also handle permission-related UI here if needed.
  }

  return (
    <FullScreenModal isVisible={isVisible}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View
          style={[
            styles.buttonContainer,
            Platform.OS === 'ios' && {marginTop: top / 2},
          ]}>
          <View style={styles.firstContainer}>
            <TouchableOpacity
              onPress={() => toggleCamera()}
              style={styles.crossButton}>
              <CrossIcon color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                showAlert({
                  title: 'Coming Soon...',
                  type: 'warning',
                  message: 'This feature is coming soon.',
                })
              }
              style={[styles.crossButton, {padding: 10}]}>
              <Ionicons
                name={true ? 'flash-sharp' : 'flash-off-outline'}
                size={20}
                color={true ? Colors.Primary : 'white'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.secondContainer}>
            {gallery?.length > 0 && (
              <ScrollView horizontal style={styles.galleryContainer}>
                {gallery.map((item, index) => (
                  <Image
                    key={index}
                    source={{uri: item}}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            )}
            <View style={styles.snapContainer}>
              <TouchableOpacity
                style={styles.RefreshIconContainer}
                onPress={toggleCameraFacing}>
                <RefreshIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePicture}
                style={styles.snapButtonContainer}>
                <View style={styles.snapButton} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  showAlert({
                    title: 'Coming Soon...',
                    type: 'warning',
                    message: 'This feature is coming soon.',
                  })
                }
                style={styles.RefreshIconContainer}>
                <GalleryIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
      <CameraImagePreview
        isVisible={isImagePreviewVisible}
        gallery={gallery}
        togglePreview={() => setIsImagePreviewVisible(!isImagePreviewVisible)}
        handleSendCapturedPhoto={handleSendCapturedPhoto}
        toggleCamera={toggleCamera}
      />
    </FullScreenModal>
  );
};

export default Camera;

const getStyles = Colors =>
  StyleSheet.create({
    snapContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    secondContainer: {
      flexDirection: 'row',
      //   alignItems: "center",
      //   justifyContent: "space-between",
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: 20,
    },
    firstContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 20,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    crossButton: {
      // marginLeft: responsiveScreenWidth(4),
      padding: 15,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 100,
    },
    RefreshIconContainer: {
      // flex: 0.1,
      //   alignSelf: "flex-end",
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 100,
      padding: 10,
      //   margin: 20,
    },
    snapButtonContainer: {
      flexDirection: 'row',
      //   backgroundColor: "red",
      borderRadius: 5,
      justifyContent: 'center',
    },
    snapButton: {
      height: 60,
      width: 60,
      borderRadius: 100,
      borderWidth: 5,
      borderColor: Colors.ForegroundOpacityColor,
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: 'white',
    },
    button: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      margin: 20,
    },
    galleryContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      maxHeight: 120,
    },
    galleryImage: {
      width: 100,
      height: 100,
      margin: 5,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      //   flexDirection: "row",
      // backgroundColor: "red",
      //   // margin: 15,
      //   position: "relative",
      justifyContent: 'space-between',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
