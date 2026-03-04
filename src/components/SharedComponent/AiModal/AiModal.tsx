/* eslint-disable dot-notation */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AiButtonContainer from './AiButtonContainer';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import Markdown from 'react-native-markdown-display';
import ReactNativeModal from 'react-native-modal';
import AiDrawer from './AiDrawer';
import axiosInstance from '../../../utility/axiosInstance';
import AiTopSection from './AiTopSection';
import CopyIcon from '../../../assets/Icons/CopyIcon';
import GlobalAlertModal from '../GlobalAlertModal';
import AiIcon2 from '../../../assets/Icons/AiIcon2';
import Clipboard from '@react-native-clipboard/clipboard';
import BlinkingText from '../BlinkingText';
import {TColors} from '../../../types';
import {showToast} from '../../HelperFunction';
import {theme} from '../../../utility/commonFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';

interface AiModalProps {
  state: any;
  setState: (newState: string) => void;
  onCancelPress: () => void;
  isVisible: boolean;
}

type SelectedValues = {
  Questions?: string[];
  Rewrite?: string;
  About?: string[];
  Styles?: string;
  'S Media posts'?: string[];
  Size?: string;
  [key: string]: any;
};

const AiModal: React.FC<AiModalProps> = ({
  state,
  setState,
  onCancelPress,
  isVisible,
}) => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors, top);

  const [generatedText, setGeneratedText] = useState<string>(state);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});
  const [result, setResult] = useState<string>('');
  const [previousResult, setPreviousResult] = useState<string>('');
  const [preVisible, setPreVisible] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorText, setErrorText] = useState('');
  const handleCancelButton = () => {
    onCancelPress();
    setResult('');
  };

  useEffect(() => {
    setGeneratedText(state);
  }, [state]);

  const generatePrompt = () => {
    let pro = '';

    if (
      selectedValues['Questions'] &&
      Array.isArray(selectedValues['Questions'])
    ) {
      const questions = selectedValues['Questions'].join(' ');
      pro += ` ${questions}`;
    }

    if (selectedValues['Rewrite']) {
      pro += ` ${selectedValues['Rewrite']}`;
    }

    if (selectedValues['About'] && Array.isArray(selectedValues['About'])) {
      const about = selectedValues['About'].join(' ');
      pro += ` ${about}`;
    }

    if (selectedValues['Styles']) {
      pro += ` ${selectedValues['Styles']}`;
    }

    if (
      selectedValues['S Media posts'] &&
      Array.isArray(selectedValues['S Media posts'])
    ) {
      const sMediaPosts = selectedValues['S Media posts'].join(' ');
      pro += ` ${sMediaPosts}`;
    }

    if (selectedValues['Size']) {
      pro += ` ${selectedValues['Size']}`;
    }

    handleGenerate(pro);
  };

  const handleGenerate = (prompt: string) => {
    setErrorText('');
    const data =
      prompt && !prompt.includes(generatedText)
        ? `${generatedText} ${prompt}`
        : generatedText;
    if (!generatedText) {
      showToast({
        message: 'Please write your queries in the field',
      });
      return;
    }
    setIsLoading(true);
    axiosInstance
      .post('/organization/integration/generate-text', {prompt: data})
      .then(res => {
        if (res.data.success) {
          setGeneratedText('');
          setResult(res.data.text);
          setSelectedValues({});
          setPreviousResult(result);
          setIsCopied(false);
        }
      })
      .catch(error => {
        console.log(
          'error.response.data',
          JSON.stringify(error.response.data, null, 2),
        );
        setErrorText('Failed to generate, Please try again later.');
        showToast({
          message: error.response?.data?.error || 'There is some error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const copyAvailableAfter = () => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleApplyPress = () => {
    if (!result) {
      return onCancelPress();
    }
    if (preVisible) {
      setState(previousResult);
    } else {
      setState(result);
    }
    onCancelPress();
  };

  const handleClipBoard = () => {
    const data = preVisible ? previousResult : result;
    try {
      Clipboard.setString(data);
      setIsCopied(true);
      copyAvailableAfter();
    } catch (error) {
      console.error('Error while copying to clipboard:', error);
    }
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onCancelPress}
      style={{margin: 0}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Toast config={toastConfig} />
        {isDrawerVisible ? (
          <AiDrawer
            generatedText={generatedText}
            toggle={() => setIsDrawerVisible(prev => !prev)}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
        ) : (
          <View style={styles.container}>
            <AiTopSection
              setIsDrawerVisible={() => setIsDrawerVisible(!isDrawerVisible)}
              preVisible={preVisible}
              setPreVisible={st => {
                setPreVisible(st);
                setIsCopied(false);
              }}
              previousResult={previousResult}
            />
            <ScrollView
              contentContainerStyle={{width: responsiveScreenWidth(100)}}>
              {isLoading ? (
                <View style={[styles.loadingContainer, {width: '38%'}]}>
                  <AiIcon2 color={Colors.PureCyan} />
                  <BlinkingText style={styles.text}>Thinking...</BlinkingText>
                </View>
              ) : (
                <>
                  {result ? (
                    <View
                      style={{
                        marginHorizontal: responsiveScreenWidth(4),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.loadingContainer}>
                        <AiIcon2 color={Colors.PureCyan} />
                        <Text style={styles.text}>Your result:</Text>
                      </View>
                      {isCopied ? (
                        <View style={styles.copyContainer}>
                          <Text style={[styles.text, {color: Colors.BodyText}]}>
                            Copied...
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={handleClipBoard}
                          style={styles.copyContainer}>
                          <CopyIcon />
                          <Text style={[styles.text, {color: Colors.BodyText}]}>
                            Copy
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : null}
                  <Markdown style={styles.markdownStyle}>
                    {preVisible ? previousResult : result}
                  </Markdown>
                </>
              )}
            </ScrollView>
            <TextInput
              keyboardAppearance={theme()}
              placeholder="Write your queries"
              multiline
              style={styles.input}
              value={generatedText}
              onChangeText={text => {
                errorText && setErrorText('');
                setGeneratedText(text);
              }}
              placeholderTextColor={Colors.BodyText}
              autoCorrect={false}
            />
            {errorText && (
              <Text
                style={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.ErrorColor,
                }}>
                {errorText}
              </Text>
            )}
            <AiButtonContainer
              handleCancelButton={handleCancelButton}
              generatePrompt={generatePrompt}
              onApplyPress={handleApplyPress}
              onResetPress={() => {
                setResult('');
              }}
              resetVisible={!!result && !isLoading}
            />
          </View>
        )}
        <GlobalAlertModal />
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

export default AiModal;

const getStyles = (Colors: TColors, top: number) =>
  StyleSheet.create({
    copyContainer: {
      backgroundColor: Colors.Foreground + '50',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    loadingContainer: {
      backgroundColor: Colors.CyanOpacity,
      alignItems: 'center',
      paddingVertical: 3,
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 10,
      borderRadius: 4,
    },
    text: {
      fontSize: 18,
      color: Colors.PureCyan,
      fontFamily: CustomFonts.MEDIUM,
    },
    input: {
      backgroundColor: Colors.ScreenBoxColor,
      width: '95%',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      minHeight: 40,
      maxHeight: 200,
      borderRadius: 25,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: Platform.OS === 'ios' ? 10 : undefined,
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
      textAlignVertical: 'center',
    },
    container: {
      backgroundColor: Colors.Background_color,
      paddingTop: top,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      paddingBottom: 30,
    },
    drawerContent: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      padding: 20,
      paddingTop: top,
    },
    drawerText: {
      fontSize: 18,
      marginBottom: 20,
      color: Colors.Heading,
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
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        height: 'auto',
        paddingHorizontal: 10,
      },
      heading1: {
        flex: 1,
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        color: Colors.Primary,
      },
      blockquote: {
        flex: 1,
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
      fence: {
        flex: 1,
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
      // // Overriding bullet_list and ordered_list to use monospace
      // bullet_list: {
      //   fontFamily: 'monospace',
      // },
      // ordered_list: {
      //   fontFamily: 'monospace',
      //   paddingRight: 10,
      // },
    } as any,
  });
