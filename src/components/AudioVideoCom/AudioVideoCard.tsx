import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Images from '../../constants/Images';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import {formattingDate} from '../../utility/commonFunction';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import {TColors, TMediaItem} from '../../types';
import {gGap} from '../../constants/Sizes';

type RootStackParamList = {
  AudioVideoDetails: {index: number};
};

interface AudioVideoCardProps {
  media: TMediaItem;
  index: number;
}

const AudioVideoCard: React.FC<AudioVideoCardProps> = ({media, index}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const Colors = useTheme();

  const styles = getStyles(Colors);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AudioVideoDetails', {index});
      }}
      style={styles.bgImgContainer}>
      <Image
        source={
          media?.thumbnail
            ? {uri: media.thumbnail}
            : (Images.DEFAULT_IMAGE as ImageSourcePropType)
        }
        style={styles.bgImg}
      />

      <View style={styles.info}>
        <Text style={styles.doc}>
          {media?.title?.length > 28
            ? media.title.slice(0, 28) + '...'
            : media.title}
        </Text>

        <View style={styles.userInfo}>
          <Text style={styles.title}>Uploaded By: </Text>
          <View style={styles.user}>
            <Image
              source={
                media?.createdBy?.profilePicture
                  ? {uri: media.createdBy.profilePicture}
                  : (Images.DEFAULT_IMAGE as ImageSourcePropType)
              }
              style={styles.img}
            />
            <Text style={styles.name}>
              {media?.createdBy?.fullName || 'Name unavailable'}
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.date}>
            Date: {formattingDate(media?.createdAt)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AudioVideoDetails', {index});
            }}
            style={styles.btnArea}>
            <Text style={styles.normalText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    bgImgContainer: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      justifyContent: 'flex-start',
      padding: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    bgImg: {
      height: 200,
      borderRadius: 10,
      resizeMode: 'contain',
      width: '100%',
      backgroundColor: Colors.Primary,
    },
    info: {
      marginTop: 10,
    },
    doc: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HS,
      color: Colors.Heading,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
      // backgroundColor: 'red',
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    user: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    img: {
      height: 25,
      width: 25,
      borderRadius: 50,
    },
    name: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      marginLeft: 10,
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      // backgroundColor: 'red',
    },
    btnArea: {
      flexDirection: 'row',
      paddingVertical: responsiveScreenHeight(0.7),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.LineColor,
    },
    normalText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.SecondaryButtonTextColor,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    date: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
  });

export default AudioVideoCard;
