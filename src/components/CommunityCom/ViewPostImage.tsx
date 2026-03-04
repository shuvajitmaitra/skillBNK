import {Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {Image} from 'react-native';
import CustomFonts from '../../constants/CustomFonts';
import {IPost} from '../../types/community/community';
import ImageView from 'react-native-image-viewing';

const ViewPostImage = ({post}: {post: IPost}) => {
  const Colors = useTheme();
  const [imageDimensions, setImageDimensions] = useState<{
    [key: string]: {aspectRatio?: number};
  }>({});
  const images = post?.attachments;
  const newImage = images?.length > 4 ? images?.slice(0, 4) : images;
  const imageCount = images?.length;
  const [viewImage, setViewImage] = useState<{uri: string; index: number}[]>(
    [],
  );

  const handleImageLayout = (uri: string, width: number, height: number) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: {aspectRatio},
    }));
  };

  return (
    <>
      {imageCount > 0 && (
        <View
          style={{
            width: '100%',
            // height: imageCount === 2 ? responsiveScreenHeight(26) : responsiveScreenHeight(50.5),
            flexDirection: imageCount === 1 ? 'column' : 'row',
            flexWrap: imageCount > 1 ? 'wrap' : 'nowrap',
            backgroundColor: Colors.Background_color,
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: 4,
            padding: 10,
            gap: 10,
          }}>
          <ImageView
            images={viewImage}
            imageIndex={viewImage[0]?.index}
            visible={viewImage?.length !== 0}
            onRequestClose={() => setViewImage([])}
          />
          {newImage?.map((item: {_id: string; url: string}, index: number) => {
            const {aspectRatio} = imageDimensions[item.url] || {};

            return (
              <React.Fragment key={item?._id}>
                <Pressable
                  onPress={() => {
                    setViewImage &&
                      setViewImage(images.map(i => ({uri: i.url, index})));
                  }}
                  style={{
                    // height: imageCount === 1 ? "100%" : responsiveScreenHeight(25) - 15,
                    width: imageCount === 1 ? '100%' : '48%',
                    position: 'relative',
                  }}>
                  <Image
                    source={{
                      uri: item?.url,
                    }}
                    style={[
                      aspectRatio
                        ? {aspectRatio}
                        : {height: responsiveScreenHeight(20)},
                    ]}
                    resizeMode="cover"
                    onLoad={({nativeEvent}) =>
                      handleImageLayout(
                        item.url,
                        nativeEvent.source.width,
                        nativeEvent.source.height,
                      )
                    }
                  />
                  {imageCount > 4 && index === 3 && (
                    <View
                      style={{
                        position: 'absolute',
                        height: responsiveScreenHeight(25) - 15,
                        width: '100%',
                        backgroundColor: Colors.BackDropColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: CustomFonts.SEMI_BOLD,
                          fontSize: responsiveScreenFontSize(2.6),
                          color: Colors.PureWhite,
                        }}>
                        +{imageCount - 4}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>
      )}
    </>
  );
};

export default ViewPostImage;
