import React from 'react';
import ProtectedWebView from './ProtectedWebView';

const MockInterview = () => {
  return (
    <>
      <ProtectedWebView />
    </>
  );
};

export default MockInterview;

// import React, {useState, useEffect} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   StatusBar,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   RefreshControl,
// } from 'react-native';
// import {
//   responsiveScreenWidth,
//   responsiveScreenHeight,
//   responsiveFontSize,
// } from 'react-native-responsive-dimensions';
// import {useTheme} from '../../context/ThemeContext';
// import CustomFonts from '../../constants/CustomFonts';
// import ShareIcon from '../../assets/Icons/ShareIcon';

// import axios from '../../utility/axiosInstance';
// import StartInterviewModal from '../../components/MockInterviewCom/StartInterviewModal';
// import ShareInterviewModal from '../../components/MockInterviewCom/ShareInterviewModal';
// import CommentModal from '../../components/MockInterviewCom/CommentModal';
// import Loading from '../../components/SharedComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import {setInterviews} from '../../store/reducer/InterviewReducer';
// import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
// import {showToast} from '../../components/HelperFunction';
// import {TColors, TInterview} from '../../types';
// import {RootState} from '../../types/redux/root';
// import {theme} from '../../utility/commonFunction';
// import SearchIcon from '../../assets/Icons/SearchIcon';
// import {fontSizes, gGap} from '../../constants/Sizes';
// import moment from 'moment';
// import Images from '../../constants/Images';
// import {fetchSingleInterview} from '../../actions/api.mockInterview';
// import {navigate} from '../../navigation/NavigationService';
// import {
//   FeatherIcon,
//   FontAwesomeIcon,
//   SimpleLineIcon,
// } from '../../constants/Icons';
// import ProtectedWebView from './ProtectedWebView';

// export default function MockInterview() {
//   const Colors = useTheme();
//   const styles = getStyles(Colors);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState<TInterview | null>(
//     null,
//   );
//   const [interviewIndex, setInterviewIndex] = useState(0);
//   const dispatch = useDispatch();
//   const {interviews} = useSelector((state: RootState) => state.interview);
//   // console.log('interviews', JSON.stringify(interviews, null, 2));
//   const [filteredInterviews, setFilteredInterviews] = useState<
//     TInterview[] | null
//   >(null);
//   const [selectedTab, setSelectedTab] = useState('assigned');

//   const tabData = [
//     {
//       label: 'Assigned',
//       value: 'assigned',
//       color: '#0636d1',
//       interviewCount: interviews?.length || 0,
//       function: () => {
//         setSelectedTab('assigned');
//         setFilteredInterviews(
//           interviews.filter((item: TInterview) => item.type === 'ai'),
//         );
//       },
//     },
//     {
//       label: 'Completed',
//       value: 'completed',
//       color: '#089669',
//       interviewCount:
//         interviews?.filter((item: TInterview) => item.submission.length > 0)
//           .length || 0,
//       function: () => {
//         setSelectedTab('completed');
//         setFilteredInterviews(
//           interviews.filter((item: TInterview) => item.submission.length > 0),
//         );
//       },
//     },
//     {
//       label: 'Pending',
//       value: 'in-completed',
//       color: '#0636d1',
//       interviewCount:
//         interviews?.filter((item: TInterview) => item.submission.length === 0)
//           .length || 0,
//       function: () => {
//         setSelectedTab('in-completed');
//         setFilteredInterviews(
//           interviews.filter((item: TInterview) => item.submission.length === 0),
//         );
//       },
//     },
//     {
//       label: 'Shared',
//       value: 'shared',
//       color: '#13b881',
//       interviewCount: 0,
//       function: () => {
//         setSelectedTab('shared');
//         setFilteredInterviews([]);
//       },
//     },
//   ];

//   useEffect(() => {
//     const fetchData = () => {
//       setIsLoading(true);
//       axios
//         .get('/interview/myinterviews')
//         .then(res => {
//           dispatch(
//             setInterviews(
//               res.data.interviews.filter(
//                 (item: TInterview) => item.type === 'ai',
//               ),
//             ),
//           );
//           setFilteredInterviews(
//             res.data.interviews.filter(
//               (item: TInterview) => item.type === 'ai',
//             ),
//           );
//           setIsLoading(false);
//         })
//         .catch(err => {
//           setIsLoading(false);
//           console.log(err);
//         });
//     };
//     fetchData();
//   }, [dispatch]);
//   const handleFilterInterviews = (txt: string) => {
//     if (!txt) {
//       return interviews;
//     }
//     const i = interviews.filter((item: TInterview) =>
//       item?.name?.toLowerCase().includes(txt?.toLowerCase()),
//     );
//     setFilteredInterviews(i);
//   };
//   const ReloadInterview = () => {
//     axios
//       .get('/interview/myinterviews')
//       .then(res => {
//         console.log(
//           'res.data.interviews.length',
//           JSON.stringify(res.data.interviews.length, null, 2),
//         );
//         dispatch(
//           setInterviews(
//             res.data.interviews.filter(
//               (item: TInterview) => item.type === 'ai',
//             ),
//           ),
//         );
//         setFilteredInterviews(
//           res.data.interviews.filter((item: TInterview) => item.type === 'ai'),
//         );
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   return <ProtectedWebView />;
//   // return (
//   //   <View
//   //     style={{
//   //       backgroundColor: Colors.Background_color,
//   //       paddingHorizontal: responsiveScreenWidth(4),
//   //       flex: 1,
//   //     }}>
//   //     <Text
//   //       onPress={() => {
//   //         setToken('Hello from dddd!');
//   //       }}
//   //       style={{color: 'black'}}>
//   //       Protected WebView:
//   //     </Text>
//   //     <ScrollView
//   //       refreshControl={
//   //         <RefreshControl
//   //           tintColor={Colors.Primary}
//   //           refreshing={false}
//   //           onRefresh={() => {
//   //             ReloadInterview();
//   //           }}
//   //         />
//   //       }
//   //       contentContainerStyle={{gap: gGap(5)}}>
//   //       <StatusBar
//   //         translucent={true}
//   //         backgroundColor={Colors.Background_color}
//   //         barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
//   //       />
//   //       <Text style={styles.heading}>Mock Interviews</Text>
//   //       <Text style={styles.description}>
//   //         Your Practice Ground for Real-Time Answers
//   //       </Text>
//   //       <View style={{flexDirection: 'row', gap: gGap(10)}}>
//   //         {tabData.map(item => (
//   //           <View
//   //             style={{
//   //               flex: 1,
//   //               backgroundColor: item.color + '10',
//   //               height: gGap(60),
//   //               justifyContent: 'center',
//   //               alignItems: 'center',
//   //               borderRadius: gGap(8),
//   //               borderWidth: 1,
//   //               borderColor: item.color + '30',
//   //             }}
//   //             key={item.value}>
//   //             <Text
//   //               style={{
//   //                 fontFamily: CustomFonts.BOLD,
//   //                 color: item.color,
//   //                 fontSize: fontSizes.heading,
//   //               }}>
//   //               {item.interviewCount}
//   //             </Text>
//   //             <Text
//   //               style={{
//   //                 fontFamily: CustomFonts.REGULAR,
//   //                 color: Colors.Heading,
//   //                 fontSize: fontSizes.small,
//   //               }}>
//   //               {item.label}
//   //             </Text>
//   //           </View>
//   //         ))}
//   //       </View>
//   //       <View
//   //         style={{
//   //           position: 'relative',
//   //           alignItems: 'center',
//   //           borderWidth: 1,
//   //           borderColor: Colors.BorderColor,
//   //           backgroundColor: Colors.Foreground,
//   //           flexDirection: 'row',
//   //           gap: gGap(10),
//   //           paddingHorizontal: gGap(10),
//   //           marginVertical: gGap(5),
//   //           borderRadius: gGap(10),
//   //         }}>
//   //         <SearchIcon />
//   //         <TextInput
//   //           placeholder="Search interviews..."
//   //           style={{
//   //             color: Colors.BodyText,
//   //             paddingVertical: gGap(10),
//   //           }}
//   //           placeholderTextColor={Colors.BodyText}
//   //           keyboardAppearance={theme()}
//   //           onChangeText={t => {
//   //             handleFilterInterviews(t);
//   //           }}
//   //         />
//   //       </View>
//   //       <View
//   //         style={{
//   //           borderWidth: 1,
//   //           borderColor: Colors.BorderColor,
//   //           backgroundColor: Colors.Foreground,
//   //           flexDirection: 'row',
//   //           gap: gGap(10),
//   //           marginBottom: gGap(5),
//   //           borderRadius: gGap(10),
//   //         }}>
//   //         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//   //           {tabData.map(item => (
//   //             <TouchableOpacity
//   //               onPress={() => {
//   //                 item.function();
//   //               }}
//   //               key={item.value}
//   //               style={{
//   //                 paddingVertical: gGap(10),
//   //                 paddingHorizontal: gGap(10),
//   //                 borderRadius: gGap(10),
//   //                 backgroundColor:
//   //                   item.value === selectedTab ? Colors.Primary : 'transparent',
//   //               }}>
//   //               <Text
//   //                 style={{
//   //                   color:
//   //                     item.value === selectedTab
//   //                       ? Colors.PureWhite
//   //                       : Colors.BodyText,
//   //                   fontFamily: CustomFonts.MEDIUM,
//   //                 }}>
//   //                 {item.label} ({item.interviewCount})
//   //               </Text>
//   //             </TouchableOpacity>
//   //           ))}
//   //         </ScrollView>
//   //       </View>
//   //       {isLoading ? (
//   //         <Loading backgroundColor={'transparent'} />
//   //       ) : (
//   //         <>
//   //           {filteredInterviews && filteredInterviews?.length ? (
//   //             filteredInterviews?.map((interview: TInterview, i: number) => (
//   //               <View key={i} style={styles.interviewContainer}>
//   //                 <View>
//   //                   <Image
//   //                     source={
//   //                       interview.thumbnail
//   //                         ? {
//   //                             uri: interview?.thumbnail,
//   //                           }
//   //                         : Images.DEFAULT_IMAGE
//   //                     }
//   //                     style={styles.img}
//   //                   />
//   //                   <View
//   //                     style={[
//   //                       styles.progressContainer,
//   //                       {
//   //                         backgroundColor: interview.isActive
//   //                           ? Colors.SuccessColor
//   //                           : Colors.WarningColor,
//   //                       },
//   //                     ]}>
//   //                     <FeatherIcon
//   //                       name={interview.submission[0]?._id ? 'check' : 'clock'}
//   //                       size={15}
//   //                       color={Colors.Heading}
//   //                     />
//   //                     <Text style={[styles.title2, {}]}>
//   //                       {interview.submission[0]?._id ? 'Done' : 'In Progress'}
//   //                     </Text>
//   //                   </View>
//   //                 </View>
//   //                 <TouchableOpacity
//   //                   disabled={!interview?.submission[0]?._id}
//   //                   onPress={() =>
//   //                     setSelectedInterview({...interview, shareModal: true})
//   //                   }
//   //                   style={{
//   //                     flexDirection: 'row',
//   //                     position: 'absolute',
//   //                     backgroundColor: '#ffffff' + '50',
//   //                     padding: gGap(10),
//   //                     borderWidth: 1,
//   //                     borderColor: '#ffffff' + '60',
//   //                     borderRadius: 100,
//   //                     top: gGap(10),
//   //                     right: gGap(10),
//   //                   }}>
//   //                   <ShareIcon
//   //                     color={
//   //                       interview?.submission[0]?._id
//   //                         ? Colors.PrimaryButtonBackgroundColor
//   //                         : Colors.DisablePrimaryBackgroundColor
//   //                     }
//   //                   />
//   //                 </TouchableOpacity>
//   //                 <View
//   //                   style={{
//   //                     flex: 1,
//   //                     gap: gGap(5),
//   //                     padding: gGap(10),
//   //                     paddingTop: 0,
//   //                   }}>
//   //                   <Text style={styles.title}>{interview?.name}</Text>
//   //                   <Text style={styles.title2}>
//   //                     {interview?.aiData?.instruction}
//   //                   </Text>
//   //                   <View
//   //                     style={{
//   //                       flexDirection: 'row',
//   //                       alignItems: 'center',
//   //                       justifyContent: 'space-between',
//   //                     }}>
//   //                     <View
//   //                       style={{
//   //                         borderRadius: 50,
//   //                         backgroundColor: Colors.Background_color,
//   //                         paddingHorizontal: gGap(10),
//   //                         paddingVertical: gGap(3),
//   //                       }}>
//   //                       <Text style={styles.title2}>{interview.type}</Text>
//   //                     </View>
//   //                     <View
//   //                       style={{
//   //                         borderRadius: 50,
//   //                         backgroundColor:
//   //                           interview.aiData?.complexity === 'Hard'
//   //                             ? Colors.Red + '30'
//   //                             : interview.aiData?.complexity === 'Medium'
//   //                             ? Colors.WarningColor + '30'
//   //                             : Colors.Background_color,
//   //                         borderWidth: 1,
//   //                         borderColor:
//   //                           interview.aiData?.complexity === 'Hard'
//   //                             ? Colors.Red + '50'
//   //                             : interview.aiData?.complexity === 'Medium'
//   //                             ? Colors.WarningColor + '50'
//   //                             : Colors.Background_color,
//   //                         paddingHorizontal: gGap(10),
//   //                         paddingVertical: gGap(3),
//   //                         flexDirection: 'row',
//   //                         alignItems: 'center',
//   //                         gap: gGap(5),
//   //                       }}>
//   //                       <FeatherIcon
//   //                         name="target"
//   //                         size={20}
//   //                         color={
//   //                           interview.aiData?.complexity === 'Hard'
//   //                             ? Colors.Red
//   //                             : interview.aiData?.complexity === 'Medium'
//   //                             ? Colors.WarningColor
//   //                             : Colors.BodyText
//   //                         }
//   //                       />
//   //                       <Text
//   //                         style={[
//   //                           styles.title2,
//   //                           {
//   //                             color:
//   //                               interview.aiData?.complexity === 'Hard'
//   //                                 ? Colors.Red
//   //                                 : interview.aiData?.complexity === 'Medium'
//   //                                 ? Colors.WarningColor
//   //                                 : Colors.PureWhite,
//   //                           },
//   //                         ]}>
//   //                         {interview.aiData?.complexity}
//   //                       </Text>
//   //                     </View>
//   //                   </View>
//   //                   <View
//   //                     style={{
//   //                       flexDirection: 'row',
//   //                       alignItems: 'center',
//   //                       gap: gGap(5),
//   //                     }}>
//   //                     <FeatherIcon
//   //                       name="clock"
//   //                       size={20}
//   //                       color={Colors.BodyText}
//   //                     />
//   //                     <Text style={styles.title2}>
//   //                       Duration:{' '}
//   //                       <Text
//   //                         style={[
//   //                           styles.text2,
//   //                           interview.submission?.length > 0
//   //                             ? styles.doneStatus
//   //                             : styles.pendingStatus,
//   //                         ]}>
//   //                         {interview.aiData?.duration || 0} minutes
//   //                       </Text>
//   //                     </Text>
//   //                     <View
//   //                       style={{
//   //                         flexDirection: 'row',
//   //                         alignItems: 'center',
//   //                         gap: gGap(5),
//   //                       }}>
//   //                       <FeatherIcon
//   //                         name="calendar"
//   //                         size={20}
//   //                         color={Colors.BodyText}
//   //                       />
//   //                       <Text style={styles.title2}>
//   //                         Created:{' '}
//   //                         <Text
//   //                           style={[
//   //                             styles.text2,
//   //                             interview.submission?.length > 0
//   //                               ? styles.doneStatus
//   //                               : styles.pendingStatus,
//   //                           ]}>
//   //                           {moment(interview.createdAt).format('LL')}
//   //                         </Text>
//   //                       </Text>
//   //                     </View>
//   //                   </View>

//   //                   {/* Score----------------------------------------   ------  - - - - - - - -         - - - - */}
//   //                   <View style={styles.scoreContainer}>
//   //                     <Text style={styles.scoreText}>Score</Text>
//   //                     <View
//   //                       style={{
//   //                         flexDirection: 'row',
//   //                         alignItems: 'center',
//   //                         gap: gGap(10),
//   //                       }}>
//   //                       <SimpleLineIcon
//   //                         name="badge"
//   //                         size={20}
//   //                         color={Colors.WarningColor}
//   //                       />
//   //                       <Text style={styles.title2}>
//   //                         {interview.submission[0]?.mark}%
//   //                       </Text>
//   //                     </View>
//   //                   </View>

//   //                   {/* Bottom Button----------------------------------------   ------  - - - - - - - -         - - - - */}
//   //                   <View
//   //                     style={{
//   //                       flexDirection: 'row',
//   //                       gap: 10,
//   //                       alignItems: 'center',
//   //                     }}>
//   //                     <TouchableOpacity
//   //                       onPress={() => {
//   //                         // if (interview.submission?.length === 0) {
//   //                         //   return showToast({message: 'Coming soon...'});
//   //                         // }
//   //                         fetchSingleInterview(interview._id);
//   //                         navigate('InterviewDetails');
//   //                       }}
//   //                       style={styles.buttonContainer}>
//   //                       <FontAwesomeIcon
//   //                         name="bolt"
//   //                         size={25}
//   //                         color={Colors.PureWhite}
//   //                       />
//   //                       <Text style={styles.buttonText}>
//   //                         {interview.submission?.length > 0
//   //                           ? 'View History'
//   //                           : 'Start Interview'}
//   //                       </Text>
//   //                     </TouchableOpacity>
//   //                     <TouchableOpacity
//   //                       onPress={() => {
//   //                         if (interview?.submission[0]?._id) {
//   //                           setInterviewIndex(i);
//   //                           setSelectedInterview({
//   //                             ...interview,
//   //                             interviewComment: true,
//   //                           });
//   //                         } else {
//   //                           showToast({
//   //                             message: 'Submit interview before comment!',
//   //                           });
//   //                         }
//   //                       }}
//   //                       style={[
//   //                         styles.buttonContainer,
//   //                         {
//   //                           backgroundColor: Colors.Foreground,
//   //                           borderWidth: 1,
//   //                           borderColor: Colors.BorderColor,
//   //                         },
//   //                       ]}>
//   //                       <FontAwesomeIcon
//   //                         name="comments"
//   //                         size={25}
//   //                         color={Colors.Heading}
//   //                       />
//   //                       <Text
//   //                         style={[styles.buttonText, {color: Colors.Heading}]}>
//   //                         Comments
//   //                       </Text>
//   //                     </TouchableOpacity>
//   //                   </View>
//   //                 </View>
//   //               </View>
//   //             ))
//   //           ) : (
//   //             <View style={styles.noDataContainer}>
//   //               <NoDataAvailable />
//   //             </View>
//   //           )}

//   //           {selectedInterview?.startInterview && (
//   //             <StartInterviewModal
//   //               interview={selectedInterview}
//   //               isStartModalVisible={Boolean(selectedInterview)}
//   //               toggleStartModal={() => setSelectedInterview(null)}
//   //             />
//   //           )}
//   //           {selectedInterview?.shareModal && (
//   //             <ShareInterviewModal
//   //               interview={selectedInterview}
//   //               isShareModalVisible={selectedInterview?.shareModal}
//   //               toggleShareModal={() => setSelectedInterview(null)}
//   //             />
//   //           )}
//   //           {selectedInterview?.interviewComment && (
//   //             <CommentModal
//   //               toggleCommentModal={() => {
//   //                 setSelectedInterview(null);
//   //               }}
//   //               isCommentModalVisible={selectedInterview?.interviewComment}
//   //               interviewIndex={interviewIndex}
//   //             />
//   //           )}
//   //         </>
//   //       )}
//   //     </ScrollView>
//   //   </View>
//   // );
// }

// const getStyles = (Colors: TColors) =>
//   StyleSheet.create({
//     buttonContainer: {
//       backgroundColor: Colors.Primary,
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingVertical: gGap(8),
//       flexDirection: 'row',
//       borderRadius: gGap(8),
//       gap: gGap(10),
//     },
//     buttonText: {
//       color: Colors.PureWhite,
//       fontFamily: CustomFonts.SEMI_BOLD,
//       fontSize: fontSizes.body,
//     },
//     scoreText: {
//       fontFamily: CustomFonts.SEMI_BOLD,
//       fontSize: fontSizes.subHeading,
//       color: Colors.Heading,
//     },
//     scoreContainer: {
//       backgroundColor: Colors.Background_color,
//       paddingHorizontal: gGap(10),
//       paddingVertical: gGap(10),
//       borderWidth: 1,
//       borderColor: Colors.BorderColor,
//       borderRadius: gGap(8),
//       flexDirection: 'row',
//       alignItems: 'center',

//       justifyContent: 'space-between',
//     },
//     progressContainer: {
//       paddingHorizontal: gGap(5),
//       color: Colors.PureWhite,
//       borderRadius: gGap(50),
//       position: 'absolute',
//       bottom: gGap(5),
//       left: gGap(5),
//       paddingVertical: gGap(2),
//       fontFamily: CustomFonts.MEDIUM,
//       alignItems: 'center',
//       flexDirection: 'row',
//       gap: gGap(2),
//     },
//     noDataContainer: {
//       flex: 1,
//       height: responsiveScreenHeight(77),
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: Colors.Foreground,
//       borderRadius: 10,
//     },
//     container: {
//       // flex: 1,
//       // backgroundColor: Colors.Red,
//     },
//     description: {
//       color: Colors.BodyText,
//       fontFamily: CustomFonts.REGULAR,
//       fontSize: fontSizes.small,
//       marginTop: gGap(-5),
//     },
//     heading: {
//       fontFamily: CustomFonts.SEMI_BOLD,
//       fontSize: fontSizes.heading,
//       color: Colors.Heading,
//     },
//     interviewContainer: {
//       backgroundColor: Colors.Foreground,
//       borderRadius: gGap(10),
//       borderWidth: 1,
//       borderColor: Colors.BorderColor,
//       gap: gGap(10),
//       overflow: 'hidden',
//     },
//     img: {
//       width: '100%',
//       height: gGap(150),
//       backgroundColor: Colors.PrimaryOpacityColor,
//     },
//     title: {
//       fontSize: fontSizes.heading,
//       fontFamily: CustomFonts.SEMI_BOLD,
//       color: Colors.Heading,
//       flex: 1,
//     },
//     text: {
//       fontSize: fontSizes.body,
//       fontFamily: CustomFonts.REGULAR,
//       color: Colors.BodyText,
//     },
//     title2: {
//       fontSize: fontSizes.body,
//       fontFamily: CustomFonts.MEDIUM,
//       color: Colors.Heading,
//       textTransform: 'capitalize',
//     },
//     text2: {
//       fontSize: responsiveFontSize(1.5),
//       fontFamily: CustomFonts.MEDIUM,
//       color: Colors.BodyText,
//     },
//     doneStatus: {
//       color: 'green',
//     },
//     pendingStatus: {
//       color: 'orange',
//     },
//     rejectedStatus: {
//       color: 'red',
//     },
//   });
