import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ArrowLeftCircle from '../../assets/Icons/ArrowLeftCircle';
import ArrowRightCircle from '../../assets/Icons/ArrowRightCircle';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {Image} from 'react-native';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import Images from '../../constants/Images';
import {IContributor} from '../../types/community/community';
import {TColors} from '../../types';
import {
  fontSizes,
  gFontSize,
  gHeight,
  gMargin,
  gPadding,
} from '../../constants/Sizes';

const TopContributorSlider = ({
  handleTopContributor,
}: {
  handleTopContributor: (string: string) => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [contributors, setContributors] = useState<IContributor[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    axiosInstance
      .get('/content/community/top-users')
      .then(res => {
        if (res.data.success) {
          setContributors(res.data.users);
        }
      })
      .catch(error => {
        console.log(
          'To get to contributor',
          JSON.stringify(error.response.data, null, 1),
        );
      });
  }, []);
  const contributor = contributors[index];
  const n = contributor?.user?.fullName || 'New User';
  let name = n.split(' ').slice(0, 3).join(' ');
  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };
  const handleNext = () => {
    if (index < contributors?.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.contributorsContainer}>
      {/* <View style={styles.arrowContainer}> */}
      <TouchableOpacity
        style={{position: 'absolute', left: -18, zIndex: 10}}
        activeOpacity={index === 0 ? 1 : 0}
        onPress={handlePrevious}>
        <ArrowLeftCircle />
      </TouchableOpacity>
      <TouchableOpacity
        style={{position: 'absolute', right: -18, zIndex: 10}}
        activeOpacity={index === contributors.length - 1 ? 1 : 0}
        onPress={handleNext}>
        <ArrowRightCircle />
      </TouchableOpacity>
      {/* </View> */}
      <TouchableOpacity
        onPress={() => handleTopContributor(contributor?.user?._id)}
        style={styles.dataContainer}>
        <Image
          source={
            contributor?.user?.profilePicture
              ? {
                  uri: contributor?.user?.profilePicture,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.userImg}
        />
        <View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.time}>{`Total Posts: ${
            contributor?.count || 0
          }`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(TopContributorSlider);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    time: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      color: Colors.BodyText,
    },
    userName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.heading,
      color: Colors.Heading,
      marginBottom: gMargin(5),
    },
    dataContainer: {
      width: '100%',
      padding: gPadding(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenFontSize(1),
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      // backgroundColor: "green",
    },
    userImg: {
      height: gFontSize(60),
      width: gFontSize(60),
      borderRadius: responsiveScreenFontSize(1),
      alignSelf: 'flex-start',
    },
    contributorsContainer: {
      minHeight: gHeight(50),
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'red',
    },
  });
