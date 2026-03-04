import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/SharedComponent/Loading';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {setMedias} from '../../store/reducer/audioVideoReducer';
import AudioVideoCard from '../../components/AudioVideoCom/AudioVideoCard';
import {TColors, TMediaItem} from '../../types';
import {RootState} from '../../types/redux/root';
import Divider2 from '../../components/SharedComponent/Divider2';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';
import {theme} from '../../utility/commonFunction';

export default function AudioVideoScreen() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const {medias: m} = useSelector((state: RootState) => state.medias);
  const [selectedItems, setSelectedItems] = useState('audio');
  // console.log('m', JSON.stringify(m, null, 2));

  const medias =
    selectedItems === 'audio'
      ? m.filter(item => item.mediaType === 'audio')
      : selectedItems === 'video'
      ? m.filter(item => item.mediaType === 'video')
      : [];
  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/media/mymedia')
      .then(res => {
        setIsLoading(false);
        if (res.data.success) {
          dispatch(setMedias(res.data.medias));
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(
          'Error fetching media:',
          JSON.stringify(error.response?.data, null, 1),
        );
        dispatch(setMedias([]));
      });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.heading}>Audios & Videos</Text>
        <Text
          style={{
            paddingHorizontal: gGap(14),
            color: Colors.BodyText,
            fontFamily: CustomFonts.REGULAR,
          }}>
          These audios and videos only shared with you
        </Text>
        <View style={{paddingHorizontal: responsiveScreenWidth(4)}}>
          <Divider2 marginBottom={gGap(10)} marginTop={gGap(5)} />
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            disabled={selectedItems === 'audio'}
            onPress={() => {
              selectedItems !== 'audio' && setSelectedItems('audio');
            }}
            style={[
              styles.tabItemContainer,
              selectedItems === 'audio' && {backgroundColor: Colors.Primary},
            ]}>
            <Text
              style={[
                styles.tabItemText,
                selectedItems === 'audio' && {color: Colors.PureWhite},
              ]}>
              Audios
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={selectedItems === 'video'}
            onPress={() => {
              selectedItems !== 'video' && setSelectedItems('video');
            }}
            style={[
              styles.tabItemContainer,
              selectedItems === 'video' && {backgroundColor: Colors.Primary},
            ]}>
            <Text
              style={[
                styles.tabItemText,
                selectedItems === 'video' && {color: Colors.PureWhite},
              ]}>
              Videos
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mediaContainer}>
          {medias?.length > 0 ? (
            medias.map((media: TMediaItem, index: number) => (
              <AudioVideoCard media={media} index={index} key={media._id} />
            ))
          ) : (
            <NoDataAvailable height={70} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    tabItemContainer: {
      flex: 1,
      alignItems: 'center',
      height: gGap(30),
      justifyContent: 'center',
      marginHorizontal: gGap(5),
      borderRadius: borderRadius.default,
    },
    tabItemText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      fontWeight: '600',
    },
    tabContainer: {
      backgroundColor: Colors.Foreground,
      height: gGap(40),
      marginHorizontal: gGap(14),
      marginBottom: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.default,
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: Colors.Foreground,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: Colors.Background_color,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    mediaContainer: {
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(2),
      gap: 10,
    },
  });
