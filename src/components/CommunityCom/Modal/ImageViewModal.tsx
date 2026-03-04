import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import React, {useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IAttachment} from '../../../types/community/community';
import {TColors} from '../../../types';

type ImageViewModalProps = {
  isVisible?: boolean;
  toggleModal?: () => void;
  attachments?: IAttachment[];
};

const ImageViewModal = ({
  isVisible = false,
  toggleModal = () => {},
  attachments = [],
}: ImageViewModalProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const [viewImage, setViewImage] = useState<{uri: string}[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{
    [key: string]: {aspectRatio?: number};
  }>({});

  const handleImageLayout = (uri: string, width: number, height: number) => {
    if (width && height) {
      const aspectRatio = width / height;
      setImageDimensions(prev => ({
        ...prev,
        [uri]: {aspectRatio},
      }));
    }
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.Foreground}
      backdropOpacity={1}
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      style={[styles.container, {paddingTop: top / 2}]}>
      <TouchableOpacity
        onPress={toggleModal}
        style={{
          position: 'absolute',
          zIndex: 100,
          top: responsiveScreenHeight(3),
          right: responsiveScreenWidth(0),
        }}>
        <CrossCircle
          color={Colors.Heading}
          size={responsiveScreenFontSize(5)}
        />
      </TouchableOpacity>
      <ScrollView>
        <View style={{gap: responsiveScreenHeight(3)}}>
          {attachments?.map(item => {
            // Safely access aspectRatio with a fallback
            const aspectRatio =
              item.url && imageDimensions[item.url]?.aspectRatio;

            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.url) {
                    setViewImage([{uri: item.url}]);
                  }
                }}
                key={item?._id}>
                <Image
                  source={{uri: item.url || ''}}
                  style={[
                    {
                      borderRadius: 7,
                      backgroundColor: 'red',
                    },
                    aspectRatio
                      ? {aspectRatio}
                      : {height: responsiveScreenHeight(20)}, // Fallback height
                  ]}
                  resizeMode="contain"
                  onLoad={({nativeEvent}) => {
                    if (item.url) {
                      handleImageLayout(
                        item.url,
                        nativeEvent.source.width,
                        nativeEvent.source.height,
                      );
                    }
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <ImageView
          images={viewImage}
          imageIndex={0}
          visible={viewImage.length > 0}
          onRequestClose={() => setViewImage([])}
        />
      </ScrollView>
    </ReactNativeModal>
  );
};

export default ImageViewModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
      position: 'relative',
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
