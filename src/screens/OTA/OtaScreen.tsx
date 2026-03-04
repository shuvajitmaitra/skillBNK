// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Animated,
//   BackHandler,
//   DevSettings,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   UIManager,
//   View,
// } from 'react-native';
// import {useTheme} from '../../context/ThemeContext';
// // import hotUpdate from 'react-native-ota-hot-update';
// import CustomFonts from '../../constants/CustomFonts';
// import {useNavigation} from '@react-navigation/native';
// import UpdateIcon from '../../assets/Icons/UpdateIcon';
// import BlinkingText from '../../components/SharedComponent/BlinkingText';
// import {useDispatch, useSelector} from 'react-redux';
// import {setUpdateInfo} from '../../store/reducer/otaReducer';
// import Markdown from 'react-native-markdown-display';
// import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
// import CrossCircle from '../../assets/Icons/CrossCircle';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {RootState} from '../../types/redux/root';
// import {RootStackParamList} from '../../types/navigation';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {MarkdownStylesProps} from '../../types/markdown/markdown';
// import {TColors} from '../../types';
// import {RegularFonts} from '../../constants/Fonts';
// import {fontSizes, gFontSize} from '../../constants/Sizes';
// import {showToast} from '../../components/HelperFunction';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const OtaScreen = () => {
//   const Colors = useTheme();
//   const styles = getStyles(Colors);
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const {updateInfo} = useSelector((state: RootState) => state.ota);
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [progressNumber, setProgressNumber] = useState(0);
//   const {top} = useSafeAreaInsets();
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const progressListener = progressAnim.addListener(({value}) => {
//       setProgressNumber(Math.floor(value));
//     });
//     return () => {
//       progressAnim.removeListener(progressListener);
//     };
//   }, [progressAnim]);

//   const navigateBackOrHome = () => {
//     navigation.pop();
//   };
//   // const removeGitUpdate = (folderName?: string) => {
//   //   fs.promises.unlink(getFolder(folderName));
//   // };
//   // const removeGitUpdate = () => {
//   //   hotUpdate.git.removeGitUpdate();
//   // };
//   const onCheckGitVersion = () => {
//     hotUpdate.git.removeGitUpdate();
//     setLoading(true);
//     progressAnim.setValue(0);
//     setProgressNumber(0);
//     Animated.timing(progressAnim, {
//       toValue: 90,
//       duration: 30000,
//       useNativeDriver: false,
//     }).start();

//     hotUpdate.git.checkForGitUpdate({
//       branch: Platform.OS === 'ios' ? 'iOS' : 'android',
//       bundlePath:
//         Platform.OS === 'ios'
//           ? 'output/main.jsbundle'
//           : 'output/index.android.bundle',
//       url:
//         updateInfo?.url || 'https://github.com/shuvajitmaitra/OTA-bundle.git',
//       restartAfterInstall: true,
//       onCloneFailed(msg) {
//         showToast({message: msg || 'Clone failed'});
//         dispatch(setUpdateInfo(null));
//         DevSettings.reload();
//         navigateBackOrHome();

//         // hotUpdate.resetApp();
//       },
//       onCloneSuccess() {
//         showToast({message: 'Clone success'});
//         dispatch(setUpdateInfo(null));
//         DevSettings.reload();
//         hotUpdate.resetApp();
//         setLoading(false);
//       },
//       onPullFailed() {
//         showToast({
//           message: 'Update pull filed!',
//         });
//         dispatch(setUpdateInfo(null));
//         DevSettings.reload();
//         // hotUpdate.resetApp();
//         navigateBackOrHome();
//         setLoading(false);
//       },
//       onPullSuccess() {
//         showToast({
//           message: 'Pull Successfully!',
//         });
//         dispatch(setUpdateInfo(null));
//         DevSettings.reload();
//         hotUpdate.resetApp();
//         setLoading(false);
//       },
//       onProgress() {
//         dispatch(setUpdateInfo(null));
//       },
//       onFinishProgress() {
//         dispatch(setUpdateInfo(null));
//       },
//     });
//   };

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         if (updateInfo?.isMandatory) {
//           navigation.goBack();
//           return true;
//         }
//         return null;
//       },
//     );

//     return () => {
//       backHandler.remove();
//     };
//   }, [navigation, updateInfo?.isMandatory]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <BlinkingText style={styles.loadingText}>
//           Downloading updates...
//         </BlinkingText>
//         <View style={styles.progressBarContainer}>
//           <Text style={styles.progressText}>{progressNumber}%</Text>
//           <View style={styles.bgProgress}>
//             <Animated.View
//               style={[
//                 styles.animatedProgress,
//                 {
//                   backgroundColor: Colors.Primary,
//                   width: progressAnim.interpolate({
//                     inputRange: [0, 100],
//                     outputRange: ['10%', '100%'],
//                   }),
//                 },
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText}>100%</Text>
//         </View>
//       </View>
//     );
//   }

//   const skipForNow = () => {
//     dispatch(setUpdateInfo({...updateInfo, minimized: true}));
//     navigateBackOrHome();
//   };

//   return (
//     <View style={styles.container}>
//       {!updateInfo?.isMandatory && (
//         <TouchableOpacity
//           onPress={skipForNow}
//           style={[styles.closeButton, {top: top + 10, right: 20}]}>
//           <CrossCircle size={40} color={Colors.Primary} />
//         </TouchableOpacity>
//       )}

//       <View style={styles.header}>
//         <UpdateIcon width={80} height={80} />
//         <Text style={styles.headerText}>What's New</Text>
//         <Text style={styles.subHeaderText}>Version {updateInfo?.version}</Text>
//       </View>

//       <View style={styles.updateContainer}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}>
//           <Markdown style={styles.markdown as MarkdownStylesProps}>
//             {updateInfo?.releaseInfo || ''}
//           </Markdown>
//         </ScrollView>
//       </View>

//       <View style={styles.buttonContainer}>
//         {!updateInfo?.isMandatory && (
//           <TouchableOpacity
//             style={styles.skipButton}
//             onPress={skipForNow}
//             activeOpacity={0.8}>
//             <Text
//               style={[
//                 styles.buttonText,
//                 {color: Colors.SecondaryButtonTextColor},
//               ]}>
//               Skip for now
//             </Text>
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           style={[
//             styles.updateButton,
//             !updateInfo?.isMandatory
//               ? styles.buttonHalfWidth
//               : styles.buttonFullWidth,
//           ]}
//           onPress={onCheckGitVersion}
//           activeOpacity={0.8}>
//           <Text style={styles.buttonText}>Start Update</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default OtaScreen;

// const getStyles = (Colors: TColors) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingHorizontal: 15,
//       paddingTop: responsiveScreenHeight(6),
//       backgroundColor: Colors.Background_color,
//     },
//     header: {
//       alignItems: 'center',
//       marginBottom: 24,
//     },
//     headerText: {
//       fontSize: 28,
//       fontFamily: CustomFonts.BOLD,
//       color: Colors.Primary,
//       marginTop: 16,
//       marginBottom: 4,
//     },
//     subHeaderText: {
//       fontSize: 16,
//       fontFamily: CustomFonts.MEDIUM,
//       color: Colors.BodyText,
//     },
//     closeButton: {
//       position: 'absolute',
//       zIndex: 1,
//       padding: 8,
//     },
//     updateContainer: {
//       flex: 1,
//       marginBottom: 80,
//     },
//     scrollContent: {
//       paddingBottom: 24,
//     },
//     loadingContainer: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: Colors.Background_color,
//       paddingHorizontal: 40,
//     },
//     loadingText: {
//       fontSize: 20,
//       fontFamily: CustomFonts.SEMI_BOLD,
//       color: Colors.Primary,
//       marginBottom: 24,
//     },
//     progressBarContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       width: '100%',
//     },
//     progressText: {
//       color: Colors.Primary,
//       fontSize: 14,
//       fontFamily: CustomFonts.MEDIUM,
//       minWidth: 40,
//     },
//     bgProgress: {
//       backgroundColor: Colors.Foreground,
//       flex: 1,
//       height: 12,
//       marginHorizontal: 12,
//       borderRadius: 6,
//       overflow: 'hidden',
//     },
//     animatedProgress: {
//       height: '100%',
//       borderRadius: 6,
//     },
//     buttonContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingHorizontal: 10,
//       position: 'absolute',
//       bottom: 30,
//       left: 0,
//       right: 0,
//       gap: 10,
//       // backgroundColor: 'red',
//     },
//     skipButton: {
//       backgroundColor: Colors.SecondaryButtonBackgroundColor,
//       paddingVertical: 15,
//       borderRadius: 7,
//       flex: 1,
//       elevation: 4,
//       borderWidth: 1,
//       borderColor: Colors.BorderColor,
//     },
//     updateButton: {
//       backgroundColor: Colors.Primary,
//       paddingVertical: 15,
//       borderRadius: 7,
//       flex: 1,
//       elevation: 4,
//     },
//     buttonHalfWidth: {
//       flex: 1,
//     },
//     buttonFullWidth: {
//       width: '100%',
//     },
//     buttonText: {
//       color: Colors.PureWhite,
//       fontFamily: CustomFonts.BOLD,
//       fontSize: 18,
//       textAlign: 'center',
//     },
//     markdown: {
//       whiteSpace: 'pre',
//       body: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         color: Colors.BodyText,
//         lineHeight: gFontSize(25),
//         width: '100%',
//       },
//       paragraph: {
//         marginTop: 0, // Remove top margin from paragraphs
//         marginBottom: 0, // Remove bottom margin from paragraphs
//         padding: 0, // Remove padding from paragraphs
//       },
//       link: {
//         color: Colors.Primary,
//         fontFamily: CustomFonts.SEMI_BOLD,
//         fontSize: fontSizes.body,
//       },
//       heading1: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         marginVertical: 4,
//         fontWeight: '500',
//       },
//       heading2: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         marginVertical: 4,
//         fontWeight: '500',
//       },
//       heading3: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         marginVertical: 4,
//         fontWeight: '500',
//       },
//       heading4: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         marginVertical: 4,
//         fontWeight: '500',
//       },
//       heading5: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         marginVertical: 4,
//         fontWeight: '500',
//       },
//       heading6: {
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: fontSizes.body,
//         marginVertical: 4,
//         fontWeight: '500',
//       },
//       strong: {
//         fontFamily: CustomFonts.LATO_BOLD,
//         fontSize: fontSizes.body,
//         fontWeight: '500',
//       },
//       em: {
//         fontFamily: CustomFonts.REGULAR,
//         fontStyle: 'italic',
//         fontSize: fontSizes.body,
//         fontWeight: '500',
//       },
//       code_inline: {
//         backgroundColor: Colors.PrimaryOpacityColor,
//       },
//       fence: {
//         marginBottom: 10,
//         padding: 8,
//         borderRadius: 6,
//         backgroundColor: Colors.Foreground,
//         borderWidth: 1,
//         borderColor: Colors.BorderColor,
//       },
//       code_block: {
//         borderWidth: 0,
//         padding: 8,
//         borderRadius: 6,
//         fontFamily: CustomFonts.REGULAR,
//         fontSize: RegularFonts.BS,
//       },
//       blockquote: {
//         padding: 8,
//         borderRadius: 6,
//         marginVertical: 4,
//         borderLeftWidth: 4,
//         borderLeftColor: Colors.ThemeAnotherButtonColor,
//       },
//     } as any,
//   });
import { View, Text } from 'react-native';
import React from 'react';

const OtaScreen = () => {
  return (
    <View>
      <Text>OtaScreen</Text>
    </View>
  );
};

export default OtaScreen;
