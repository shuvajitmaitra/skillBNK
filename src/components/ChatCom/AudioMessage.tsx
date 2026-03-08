import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-nitro-sound';
import Waveform from './WaveForm';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import PlayIcon from '../../assets/Icons/PlayIcon';
import PauseIcon from '../../assets/Icons/PauseIcon';
import {TColors} from '../../types';

interface AudioMessageProps {
  audioUrl: string;
  background?: string;
  color?: string;
}

const INITIAL_TIME = '00:00';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};

const AudioMessage: React.FC<AudioMessageProps> = ({
  audioUrl,
  background,
  color = '#ffffff',
}) => {
  const Colors = useTheme();
  const styles = getStyles({Colors, color});

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playTime, setPlayTime] = useState(INITIAL_TIME);
  const [duration, setDuration] = useState(INITIAL_TIME);
  const [loadError, setLoadError] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentPositionRef = useRef(0);
  const durationRef = useRef(0);
  const playbackFinishedRef = useRef(false);
  const listenersAttachedRef = useRef(false);

  useEffect(() => {
    attachListeners();

    return () => {
      try {
        Sound.stopPlayer();
      } catch {}
      removeListeners();
    };
  }, []);

  useEffect(() => {
    const resetAudio = async () => {
      try {
        await Sound.stopPlayer();
      } catch {}

      removeListeners();

      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
      setLoadError(false);
      setPlayTime(INITIAL_TIME);
      setDuration(INITIAL_TIME);
      setProgress(0);

      currentPositionRef.current = 0;
      durationRef.current = 0;
      playbackFinishedRef.current = false;

      attachListeners();
    };

    resetAudio();
  }, [audioUrl]);

  const removeListeners = () => {
    try {
      Sound.removePlayBackListener();
    } catch {}
    try {
      Sound.removePlaybackEndListener?.();
    } catch {}
    listenersAttachedRef.current = false;
  };

  const attachListeners = () => {
    if (listenersAttachedRef.current) {
      return;
    }

    Sound.addPlayBackListener((e: any) => {
      const currentPosition = Number(e.currentPosition ?? 0);
      const totalDuration = Number(e.duration ?? 0);

      currentPositionRef.current = currentPosition;
      durationRef.current = totalDuration;

      setPlayTime(formatTime(currentPosition));
      setDuration(formatTime(totalDuration));
      setProgress(totalDuration > 0 ? currentPosition / totalDuration : 0);
    });

    Sound.addPlaybackEndListener?.((e: any) => {
      const currentPosition = Number(e?.currentPosition ?? 0);
      const totalDuration = Number(e?.duration ?? 0);

      const isActuallyFinished =
        totalDuration > 0 && Math.abs(totalDuration - currentPosition) < 500;

      if (!isActuallyFinished) {
        return;
      }

      playbackFinishedRef.current = true;
      setIsPlaying(false);
      setIsPaused(false);
      currentPositionRef.current = 0;
      setProgress(1);
      setPlayTime(formatTime(totalDuration));
      setDuration(formatTime(totalDuration));
    });

    listenersAttachedRef.current = true;
  };

  const startFromBeginning = async () => {
    setIsLoading(true);
    setLoadError(false);
    playbackFinishedRef.current = false;

    try {
      await Sound.startPlayer(audioUrl);
      attachListeners();
      currentPositionRef.current = 0;
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to start playback:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeFromLastPosition = async () => {
    setIsLoading(true);
    setLoadError(false);
    playbackFinishedRef.current = false;

    try {
      const lastPosition = currentPositionRef.current || 0;

      await Sound.startPlayer(audioUrl);
      attachListeners();

      if (lastPosition > 0) {
        await Sound.seekToPlayer(lastPosition);
      }

      currentPositionRef.current = lastPosition;
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to resume playback:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      await Sound.pausePlayer();
      setIsPlaying(false);
      setIsPaused(true);
    } catch (error) {
      console.log('Pause error:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await handlePause();
        return;
      }

      if (playbackFinishedRef.current) {
        currentPositionRef.current = 0;
        setPlayTime(INITIAL_TIME);
        setProgress(0);
        await startFromBeginning();
        return;
      }

      if (isPaused && currentPositionRef.current > 0) {
        await resumeFromLastPosition();
        return;
      }

      await startFromBeginning();
    } catch (error) {
      console.log('Play/Pause error:', error);
    }
  };

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
        {playTime} / {duration}
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
