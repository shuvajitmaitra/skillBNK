import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Sound, {
  PlayBackType,
  PlaybackEndType,
  useSound,
} from 'react-native-nitro-sound';
import Waveform from './WaveForm';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AudioManager from '../../utility/AudioManager';
import {useFocusEffect} from '@react-navigation/native';
import PlayIcon from '../../assets/Icons/PlayIcon';
import PauseIcon from '../../assets/Icons/PauseIcon';
import {TColors} from '../../types';

// react-native-nitro-sound-এ category সেট করার দরকার নেই → internally handle করে

const formatTime = (time: number) => {
  // time যদি seconds-এ আসে
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const intervalRef = useRef<any | null>(null);
  const removePlaybackListener = useRef<(() => void) | null>(null);
  const removeEndListener = useRef<(() => void) | null>(null);
  const {
    sound,
    state,
    startPlayer,
    pausePlayer,
    resumePlayer,
    stopPlayer,
    seekToPlayer,
    mmssss,
  } = useSound({
    subscriptionDuration: 0.05, // 50ms updates
  });
  console.log('state', JSON.stringify(state, null, 2));
  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        setIsPlaying(false);
        setCurrentPlaybackTime(0);
        setProgress(0);

        // Previous sound clean up
        Sound.stopPlayer().catch(() => {});
        cleanupListeners();
        Sound.addPlayBackListener((e: PlayBackType) => {
          console.log('Playback progress:', e.currentPosition, e.duration);

          setTotalDuration(e.duration || 0);
          setIsLoading(false);
        });

        // Prepare + get duration
        await Sound.startPlayer(audioUrl); // prepare + play (but we pause immediately)
        await Sound.pausePlayer();

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err: any) {
        console.log('Audio prepare error:', err);
        if (isMounted) {
          setLoadError(err);
          setIsLoading(false);
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      Sound.stopPlayer().catch(() => {});
      cleanupListeners();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [audioUrl]);

  const cleanupListeners = () => {
    if (removePlaybackListener.current) {
      removePlaybackListener.current();
      removePlaybackListener.current = null;
    }
    if (removeEndListener.current) {
      removeEndListener.current();
      removeEndListener.current = null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (isPlaying) {
          Sound.pausePlayer().catch(() => {});
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      };
    }, [isPlaying]),
  );

  const handlePlayPause = async () => {
    if (isPlaying) {
      try {
        await Sound.pausePlayer();
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } catch (err) {
        console.log('Pause error:', err);
      }
      return;
    }

    try {
      cleanupListeners();

      // যদি শেষ হয়ে থাকে তাহলে restart
      if (currentPlaybackTime >= totalDuration - 0.3) {
        await Sound.stopPlayer();
        await Sound.startPlayer(audioUrl);
      } else {
        await Sound.resumePlayer(); // বা startPlayer() যদি paused না থাকে
      }
      // Progress listener
      removePlaybackListener.current = Sound.addPlayBackListener(
        (e: PlayBackType) => {
          setCurrentPlaybackTime(e.currentPosition);
          if (totalDuration > 0) {
            setProgress(e.currentPosition / totalDuration);
          }
        },
      );

      // End listener
      removeEndListener.current = Sound.addPlaybackEndListener(
        (e: PlaybackEndType) => {
          setIsPlaying(false);
          setCurrentPlaybackTime(totalDuration);
          setProgress(1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          cleanupListeners();
        },
      );

      setIsPlaying(true);

      // Fallback interval যদি listener smooth না হয়
      intervalRef.current = setInterval(() => {
        const pos = Sound.getCurrentTime();
        setCurrentPlaybackTime(pos);
        if (totalDuration > 0) {
          setProgress(pos / totalDuration);
        }
      }, 180); // ~5-6 fps update
    } catch (err) {
      console.log('Play error:', err);
      setIsPlaying(false);
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
