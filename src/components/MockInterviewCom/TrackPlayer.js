import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Audio} from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect} from '@react-navigation/native';
import Waveform from '../ChatCom/WaveForm';

const formatTime = time => {
  return new Date(time * 1000).toISOString().substr(14, 5);
};

const TrackPlayer = ({recordedURI, isActive, onTogglePlay, _id}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.pauseAsync(); // Stop the audio
          sound.unloadAsync(); // Unload the sound to free up resources
        }
      };
    }, [sound]),
  );

  useEffect(() => {
    let timer;
    const loadAudio = async () => {
      try {
        const {sound} = await Audio.Sound.createAsync(
          {uri: recordedURI},
          {
            shouldPlay: false,
            isLooping: false,
          },
        );
        setSound(sound);

        sound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded) {
            setCurrentPlaybackTime(status.positionMillis / 1000);
            setTotalDuration(status.durationMillis / 1000);
            setIsPlaying(status.isPlaying);
            setProgress(status.positionMillis / status.durationMillis);

            if (status.didJustFinish) {
              setIsPlaying(false);
              clearInterval(timer);
              sound.setPositionAsync(0); // Reset playback to the beginning
              setProgress(0);
              setCurrentPlaybackTime(0);
            }
          }
        });

        setIsLoading(false);

        // Start timer to update current time every second
        timer = setInterval(() => {
          sound.getStatusAsync().then(status => {
            if (status.isLoaded && status.isPlaying) {
              setCurrentPlaybackTime(status.positionMillis / 1000);
              setProgress(status.positionMillis / status.durationMillis);
            }
          });
        }, 1000);
      } catch (error) {
        console.log(JSON.stringify(error, null, 1));
        setLoadError(error);
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [recordedURI]);

  const Colors = useTheme();
  const styles = getStyles({Colors});

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      if (currentPlaybackTime === totalDuration) {
        await sound.setPositionAsync(0);
      }
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
    onTogglePlay();
  };

  return (
    <View style={styles.container}>
      {loadError ? (
        <Text style={{color: Colors.BodyText}}>Error loading audio</Text>
      ) : isLoading ? (
        <ActivityIndicator
          style={{marginRight: 10}}
          size="small"
          color={Colors.Primary}
        />
      ) : (
        <TouchableOpacity onPress={handleTogglePlay} style={styles.playButton}>
          <MaterialIcons
            style={styles.playIcon}
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={24}
          />
        </TouchableOpacity>
      )}

      {!loadError && <Waveform progress={progress} />}
      <Text style={styles.audioTimer}>
        {formatTime(currentPlaybackTime)} / {formatTime(totalDuration)}
      </Text>
    </View>
  );
};

const getStyles = ({Colors}) =>
  StyleSheet.create({
    playIcon: {
      color: Colors.Primary,
    },
    audioTimer: {
      marginLeft: responsiveScreenWidth(2),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveFontSize(1.6),
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: responsiveScreenWidth(4),
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 10,
      width: '95%',
      marginVertical: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
      borderWidth: 2,
      marginHorizontal: responsiveScreenWidth(2),
    },
    playButton: {
      marginRight: 10,
    },
  });

export default TrackPlayer;
