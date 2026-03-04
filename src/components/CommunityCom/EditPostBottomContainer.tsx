import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import SendIconTwo from '../../assets/Icons/SendIconTwo';
import {getHashtagTexts} from '../../utility/commonFunction';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import {handleGalleryPress} from './CreatePostButtonContainer';
import {TColors} from '../../types';
import {ICreatePost} from '../../types/community/community';

interface EditPostBottomContainerProps {
  post: ICreatePost | null;
  setPost: React.Dispatch<React.SetStateAction<ICreatePost | null>>;
  handleEditPost: () => void;
}

const EditPostBottomContainer = ({
  setPost,
  handleEditPost,
}: EditPostBottomContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [isLoading, setIsLoading] = useState(false);

  const extractTags = () => {
    setPost((pre: ICreatePost | null) => {
      if (!pre) {
        return null;
      }
      return {
        ...pre,
        tags: getHashtagTexts(pre.description || ''),
      };
    });
  };

  return (
    <View style={{paddingVertical: 10, paddingBottom: 20}}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.holidayButtonContainer,
            {backgroundColor: Colors.SecondaryButtonBackgroundColor},
          ]}
          onPress={() => handleGalleryPress({setPost, setIsLoading})}>
          {!isLoading ? (
            <>
              <GalleryIcon color={Colors.SecondaryButtonTextColor} />
              <Text
                style={[
                  styles.holidayButtonText,
                  {color: Colors.SecondaryButtonTextColor},
                ]}>
                Gallery
              </Text>
            </>
          ) : (
            <LoadingSmall color={Colors.SecondaryButtonTextColor} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.holidayButtonContainer,
            {backgroundColor: Colors.Primary},
          ]}
          onPress={() => {
            extractTags();
            handleEditPost();
          }}>
          <>
            <SendIconTwo color={Colors.PureWhite} />
            <Text style={[styles.holidayButtonText, {color: Colors.PureWhite}]}>
              Publish
            </Text>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPostBottomContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: responsiveScreenFontSize(2),
    },
    holidayButtonContainer: {
      width: responsiveScreenWidth(25),
      height: 40,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 8,
      borderRadius: 5,
    },
    holidayButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
    },

    removeImageText: {
      fontSize: 16,
      color: Colors.Primary,
    },
  });
