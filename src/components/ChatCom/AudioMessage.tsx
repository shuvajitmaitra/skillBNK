import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-sound';
import Waveform from './WaveForm';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AudioManager from '../../utility/AudioManager';
import {useFocusEffect} from '@react-navigation/native';
import PlayIcon from '../../assets/Icons/PlayIcon';
import PauseIcon from '../../assets/Icons/PauseIcon';
import {TColors} from '../../types';

Sound.setCategory('Playback');

const formatTime = (time: number) => {
  return new Date(time * 1000).toISOString().substr(14, 5);
};

interface AudioMessageProps {
  audioUrl: string;
  background?: string;
  color?: string;
}

const AudioMessage: React.FC<AudioMessageProps> = ({
  audioUrl,
  background,
  color = '#ffffff',
}) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  // Use useRef without optional chaining on assignment.
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    let loadedSound: Sound | null = null;

    loadedSound = new Sound(audioUrl, undefined, error => {
      if (error) {
        console.log('Error loading audio:', error);
        setLoadError(error);
        setIsLoading(false);
        return;
      }
      if (isMounted && loadedSound) {
        setSound(loadedSound);
        setTotalDuration(loadedSound.getDuration());
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (loadedSound) {
        loadedSound.stop(() => {});
        loadedSound.release();
        if (AudioManager.getInstance().currentAudio === loadedSound) {
          AudioManager.getInstance().reset();
        }
      }
    };
  }, [audioUrl]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.pause();
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
        }
      };
    }, [sound]),
  );

  const handlePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      } else {
        if (Math.floor(currentPlaybackTime) === Math.floor(totalDuration)) {
          sound.setCurrentTime(0);
        }
        AudioManager.getInstance().setAudio(sound);
        sound.play((success: boolean) => {
          if (success) {
            setIsPlaying(false);
            setProgress(0);
            setCurrentPlaybackTime(0);
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
            }
          }
        });
        setIsPlaying(true);
        // Direct assignment without optional chaining.
        intervalRef.current = setInterval(() => {
          sound.getCurrentTime((seconds: number) => {
            setCurrentPlaybackTime(seconds);
            setProgress(seconds / totalDuration);
          });
        }, 1000);
      }
    }
  };

  const Colors = useTheme();
  const styles = getStyles({Colors, color});

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: background ?? Colors.ModalBoxColor},
      ]}>
      {loadError ? (
        <Text style={{color: Colors.BodyText}}>Error loading audio</Text>
      ) : isLoading ? (
        <ActivityIndicator
          style={{marginRight: 10}}
          size="small"
          color={color ?? Colors.PureWhite}
        />
      ) : (
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          {isPlaying ? (
            <PauseIcon color={color ?? Colors.PureWhite} />
          ) : (
            <PlayIcon color={color ?? Colors.PureWhite} />
          )}
        </TouchableOpacity>
      )}

      {!loadError && <Waveform progress={progress} color={color} />}
      <Text style={styles.audioTimer}>
        {formatTime(currentPlaybackTime)} / {formatTime(totalDuration)}
      </Text>
    </View>
  );
};

interface GetStylesProps {
  Colors: TColors;
  color: string;
}

const getStyles = ({Colors, color}: GetStylesProps) =>
  StyleSheet.create({
    playIcon: {
      color: Colors.Primary,
    },
    audioTimer: {
      marginLeft: responsiveScreenWidth(2),
      color: color || Colors.PureWhite,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      width: '90%',
    },
    playButton: {
      marginRight: 10,
    },
  });

export default AudioMessage;
