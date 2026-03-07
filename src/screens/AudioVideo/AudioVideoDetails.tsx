import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import moment from 'moment';
import Markdown from 'react-native-markdown-display';
import Images from '../../constants/Images';
import {useSelector} from 'react-redux';
import VideoPlayer from '../../components/ProgramCom/VideoPlayer';
import CommentField from '../../components/CommentCom/CommentField';
import {RootState} from '../../types/redux/root';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TColors} from '../../types';
import {MarkdownStylesProps} from '../../types/markdown/markdown';
import {ProgramStackParamList} from '../../types/navigation';
import {
  createSound,
  PlayBackType,
  PlaybackEndType,
} from 'react-native-nitro-sound';

type AudioVideoDetailsProps = NativeStackScreenProps<
  ProgramStackParamList,
  'AudioVideoDetails'
>;

const AudioVideoDetails: React.FC<AudioVideoDetailsProps> = ({route}) => {
  const {medias} = useSelector((state: RootState) => state.medias);

  const initialMediaIndex: number = route.params?.index ?? 0;
  const [currentMediaIndex, setCurrentMediaIndex] =
    useState<number>(initialMediaIndex);
  const [activeButton, setActiveButton] = useState<string>('summary');
  const [content, setContent] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Ref now holds SoundInstance from createSound()
  const soundRef = useRef<ReturnType<typeof createSound> | null>(null);

  // Listener cleanup refs
  const removePlaybackListener = useRef<(() => void) | null>(null);
  const removeEndListener = useRef<(() => void) | null>(null);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Cleanup function for listeners
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

  // Load & manage audio when currentMediaIndex changes
  useEffect(() => {
    // 1. Cleanup previous audio
    if (soundRef.current) {
      soundRef.current.stopPlayer().catch(() => {});
      cleanupListeners();
      soundRef.current = null;
    }
    setIsPlaying(false);

    const currentMedia = medias[currentMediaIndex];
    if (!currentMedia || currentMedia.mediaType !== 'audio') {
      return;
    }

    const url = currentMedia.url;
    if (!url) return;

    // 2. Create new independent sound instance
    const player = createSound();
    soundRef.current = player;

    // 3. Start / prepare & play
    player
      .startPlayer(url)
      .then(() => {
        setIsPlaying(true);

        // Progress listener (~every 500ms)
        player.addPlayBackListener((e: PlayBackType) => {
          // e.currentPosition is in seconds
          console.log('Playback progress:', e.currentPosition, e.duration);
          // You can use this for a progress bar if you add one later
        });
        removePlaybackListener.current = () => {
          // Cleanup for playback listener if needed
        };

        // Completion / end listener
        player.addPlaybackEndListener((e: PlaybackEndType) => {
          console.log('Playback finished:', e);
          setIsPlaying(false);
          cleanupListeners();
        });
        removeEndListener.current = () => {
          // Cleanup for end listener if needed
        };
      })
      .catch(err => {
        console.log('Failed to start audio:', err);
        setIsPlaying(false);
      });

    // 4. Cleanup on unmount / index change
    return () => {
      if (soundRef.current) {
        soundRef.current.stopPlayer().catch(() => {});
        cleanupListeners();
        soundRef.current = null;
      }
    };
  }, [currentMediaIndex, medias]);

  // Update content when button or media changes
  useEffect(() => {
    const currentMedia = medias[currentMediaIndex];
    if (currentMedia?.data) {
      setContent((currentMedia.data[activeButton] as string) || 'No Summary');
    } else {
      setContent('No Summary');
    }
  }, [activeButton, currentMediaIndex, medias]);

  // Final unmount cleanup
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stopPlayer().catch(() => {});
        cleanupListeners();
        soundRef.current = null;
      }
    };
  }, []);

  const handlePrevious = (): void => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleNext = (): void => {
    if (currentMediaIndex < medias.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const togglePlayback = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pausePlayer().catch(() => {});
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        await soundRef.current.resumePlayer().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {medias.length > 1 && (
          <View style={styles.btnContainer}>
            {currentMediaIndex > 0 && (
              <TouchableOpacity onPress={handlePrevious} style={styles.backBtn}>
                <ArrowLeftWhite />
                <Text style={styles.btnText}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentMediaIndex < medias.length - 1 && (
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <Text
                  style={[
                    styles.btnText,
                    {color: Colors.SecondaryButtonTextColor},
                  ]}>
                  Next
                </Text>
                <ArrowRightWhite color={Colors.SecondaryButtonTextColor} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Media Player */}
        <View style={styles.mediaContainer}>
          {medias[currentMediaIndex]?.mediaType === 'video' && (
            <VideoPlayer url={medias[currentMediaIndex]?.url} />
          )}
          {medias[currentMediaIndex]?.mediaType === 'audio' && (
            <View style={trackPlayerStyles.container}>
              <Text style={trackPlayerStyles.title}>
                {medias[currentMediaIndex]?.title}
              </Text>
              <Text style={trackPlayerStyles.artist}>
                {medias[currentMediaIndex]?.createdBy?.fullName ||
                  'Unknown Artist'}
              </Text>
              <TouchableOpacity
                onPress={togglePlayback}
                style={trackPlayerStyles.playButton}>
                <Text style={trackPlayerStyles.playButtonText}>
                  {isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Media Details */}
        <Text style={styles.heading}>{medias[currentMediaIndex]?.title}</Text>

        <View style={styles.userInfo}>
          <Text style={styles.title}>Uploaded By:</Text>
          <View style={styles.user}>
            <Image
              source={
                medias[currentMediaIndex]?.createdBy?.profilePicture
                  ? {uri: medias[currentMediaIndex]?.createdBy?.profilePicture}
                  : Images.DEFAULT_IMAGE
              }
              style={styles.img}
            />
            <Text style={styles.name}>
              {medias[currentMediaIndex]?.createdBy?.fullName ||
                'Name unavailable'}
            </Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateTitle}>Uploaded Date: </Text>
          <Text style={styles.date}>
            {moment(medias[currentMediaIndex]?.createdAt).format(
              'MMM DD, YYYY',
            )}
          </Text>
        </View>

        <Text style={styles.title}>Resources</Text>

        {/* Resource Buttons */}
        {medias[currentMediaIndex]?.data && (
          <ScrollView
            horizontal
            style={styles.resource}
            contentContainerStyle={styles.buttonContainer}
            showsHorizontalScrollIndicator={false}>
            {(['summary', 'implementation', 'interview', 'behavioral'] as const)
              .filter(
                buttonLabel => medias[currentMediaIndex].data[buttonLabel],
              )
              .map(buttonLabel => (
                <TouchableOpacity
                  key={buttonLabel}
                  style={[
                    styles.btn,
                    activeButton === buttonLabel && styles.activeButton,
                  ]}
                  onPress={() => setActiveButton(buttonLabel)}>
                  <Text
                    style={[
                      styles.resourceBtn,
                      activeButton === buttonLabel && styles.activeBtnText,
                    ]}>
                    {buttonLabel}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}

        {/* Content */}
        <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
          {content}
        </Markdown>

        {/* Comment Section */}
        <CommentField postId={medias[currentMediaIndex]?._id} />
      </ScrollView>
    </View>
  );
};

export default AudioVideoDetails;

// Separate styles for the TrackPlayerComponent
const trackPlayerStyles = StyleSheet.create({
  container: {
    padding: responsiveScreenWidth(4),
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: responsiveScreenHeight(1),
  },
  title: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: CustomFonts.MEDIUM,
    color: '#333',
  },
  artist: {
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: CustomFonts.REGULAR,
    color: '#666',
    marginVertical: responsiveScreenHeight(0.5),
  },
  playButton: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: responsiveScreenHeight(1),
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginTop: responsiveScreenHeight(1),
  },
  playButtonText: {
    color: '#fff',
    fontFamily: CustomFonts.MEDIUM,
    fontSize: responsiveScreenFontSize(1.6),
  },
});

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: responsiveScreenWidth(5),
      paddingBottom: responsiveScreenHeight(2),
    },
    header: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Primary,
      marginLeft: 5,
    },
    btnContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      height: 35,
      marginTop: 15,
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PrimaryButtonTextColor,
      textAlign: 'center',
    },
    backBtn: {
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    nextBtn: {
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    mediaContainer: {
      marginBottom: responsiveScreenHeight(1),
      marginTop: 15,
    },
    userInfo: {
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
    },
    user: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
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
    },
    dateContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginTop: responsiveScreenHeight(0.5),
    },
    dateTitle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    date: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      paddingVertical: responsiveScreenHeight(1),
    },
    heading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Primary,
      marginBottom: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(1),
    },
    resource: {
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
    },
    btn: {
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    resourceBtn: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Primary,
      textTransform: 'capitalize',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    activeButton: {
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
    },
    activeBtnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
      },
      blockquote: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    } as any,
  });
