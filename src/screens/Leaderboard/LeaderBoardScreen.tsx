import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import Hexagon from '../../components/LeaderboardCom/Hexagon';
import axiosInstance from '../../utility/axiosInstance';
import UserIconTwo from '../../assets/Icons/UserIconTwo';
import {useSelector} from 'react-redux';
import StarBadgeIcon from '../../assets/Icons/StarBadgeIcon';
import {TouchableOpacity} from 'react-native';
import ArrowRight from '../../assets/Icons/ArrowRight';
import GoodBadgeIcon from '../../assets/Icons/GoodBadgeIcon';
import AlertIcon from '../../assets/Icons/AlertIcon';
import moment from 'moment';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ProgramStackParamList,
  RootStackParamList,
} from '../../types/navigation';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {TResult, TTotalData} from '../../types/program/leaderboardType';
import {calculateOverallProgress} from '../../utility/commonFunction';
import CustomProgressbar from '../../components/SharedComponent/CustomProgressbar';
import {gGap} from '../../constants/Sizes';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';

type LeaderboardBoardProps = NativeStackScreenProps<
  ProgramStackParamList,
  'LeaderBoardScreen'
>;
const LeaderBoardScreen: React.FC<LeaderboardBoardProps> = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TResult[]>();
  const [totalData, setTotalData] = useState<TTotalData>();
  const {user} = useSelector((state: RootState) => state.auth);
  const {bootcamp} = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/progress/leaderboard')
      .then(res => {
        // console.log(res.data)
        // console.log("res.data", JSON.stringify(res.data, null, 1))
        setResults(res.data.results || []);
        setTotalData(res.data || []);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Foreground,
        }}>
        <ActivityIndicator size={50} color={Colors.Primary} />
      </View>
    );
  }
  const renderBadge = (rank: number) => {
    if (rank >= 1 && rank <= 5) {
      return (
        <View style={styles.badgeContainer}>
          <StarBadgeIcon />
          <Text style={[styles.badgeText, {color: Colors.Primary}]}>
            Outstanding Performance
          </Text>
        </View>
      );
    } else if (rank >= 6 && rank <= 8) {
      return (
        <View style={styles.badgeContainer}>
          <GoodBadgeIcon />
          <Text style={[styles.badgeText, {color: '#FF9900'}]}>
            Good Performance
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.badgeContainer}>
          <AlertIcon />
          <Text style={[styles.badgeText, {color: '#EE404C'}]}>
            Need Improvements
          </Text>
        </View>
      );
    }
  };
  const userBadge = (rank: number) => {
    if (rank >= 1 && rank <= 5) {
      return (
        <View style={styles.badgeContainer}>
          <StarBadgeIcon color={Colors.PureWhite} />
          <Text style={[styles.badgeText, {color: Colors.PureWhite}]}>
            Outstanding Performance
          </Text>
        </View>
      );
    } else if (rank >= 6 && rank <= 8) {
      return (
        <View style={styles.badgeContainer}>
          <GoodBadgeIcon />
          <Text style={[styles.badgeText, {color: '#FF9900'}]}>
            Good Performance
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.badgeContainer}>
          <AlertIcon />
          <Text style={[styles.badgeText, {color: '#EE404C'}]}>
            Need Improvements
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.heading}>
          Program:
          <Text style={styles.headingText}>
            {' '}
            {totalData?.program?.title
              ? totalData?.program?.title
              : 'Bootcamps'}
          </Text>
        </Text>
        <Text style={styles.heading}>
          Session:
          <Text style={styles.headingText}> {totalData?.session?.name}</Text>
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            {totalData?.myData?.user?.profilePicture ? (
              <Image
                source={{
                  uri: totalData?.myData?.user?.profilePicture,
                }}
                style={styles.toperImg}
              />
            ) : user?.profilePicture ? (
              <Image
                source={{
                  uri: user?.profilePicture,
                }}
                style={styles.toperImg}
              />
            ) : (
              <View
                style={[
                  styles.toperImg,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <UserIconTwo size={50} />
              </View>
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.progressTitle}>
                {totalData?.myData?.user?.fullName || user?.fullName}
              </Text>
              <Text style={styles.progressHeading}>
                Program:
                <Text style={styles.progressText}>
                  {' '}
                  {totalData?.program?.title}
                </Text>
              </Text>
              <Text style={styles.progressHeading}>
                Session:
                <Text style={styles.progressText}>
                  {' '}
                  {totalData?.session?.name}
                </Text>
              </Text>

              <Text style={styles.progressText}>
                {totalData?.myData?.metrics?.totalObtainedMark || 0} pts
              </Text>
            </View>
            <Hexagon
              number={totalData?.myData?.rank.toString() || '0'}
              color="#68C562"
            />
          </View>
          <View style={styles.ShowProgress}>
            <Text style={styles.your}>Your Progress</Text>
            <Text style={styles.progressHeading}>
              {calculateOverallProgress(bootcamp) || 0}%
            </Text>
          </View>
          <CustomProgressbar
            containerStyle={{
              marginVertical: gGap(5),
              backgroundColor: Colors.BodyTextOpacity,
            }}
            innerContainerStyle={{backgroundColor: Colors.PureWhite}}
            progress={calculateOverallProgress(bootcamp)}
          />
          {userBadge(totalData?.myData?.rank ? totalData?.myData?.rank : 0)}

          <Text style={styles.progressHeading}>
            Last Update:
            <Text style={styles.progressText}>
              {' '}
              {moment(totalData?.lastUpdated).format('MMM DD, YYYY, (h:mm a)')}
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() =>
              navigation.navigate('ProgramStack', {screen: 'Progress'})
            }>
            <View style={styles.btnContainer}>
              <Text style={styles.btnText1}>View Progress</Text>
              <ArrowRight color={Colors.Primary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.topContainer}>
          {results?.length! > 0 && (
            <Text style={styles.topTitle}>Top Performers in the Program</Text>
          )}
          <View style={{gap: 10}}>
            {results?.length! > 0 ? (
              results?.map(item => (
                <View
                  key={item?._id}
                  style={[
                    styles.topersContainer,
                    {
                      backgroundColor:
                        item?.rank === 1
                          ? Colors.YellowOpacity
                          : item?.rank === 2
                          ? Colors.PurpleOpacity
                          : item?.rank === 3
                          ? Colors.CyanOpacity
                          : Colors.GrayOpacity,
                    },
                  ]}>
                  <View style={styles.toperInfo}>
                    <View style={styles.progressInfo}>
                      <View>
                        {item?.user?.profilePicture ? (
                          <Image
                            source={{
                              uri: item?.user?.profilePicture,
                            }}
                            style={styles.toperImg}
                          />
                        ) : (
                          <View
                            style={[
                              styles.toperImg,
                              {
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}>
                            <UserIconTwo size={50} />
                          </View>
                        )}
                      </View>
                      <View style={{width: responsiveScreenWidth(50)}}>
                        <Text style={styles.name}>{item?.user?.fullName}</Text>

                        <Text style={styles.heading}>
                          Program:
                          <Text style={styles.headingText}>
                            {' '}
                            {totalData?.program?.title &&
                              totalData?.program?.title}
                          </Text>
                        </Text>
                        <Text style={styles.heading}>
                          Session:
                          <Text style={styles.headingText}>
                            {' '}
                            {totalData?.session?.name}
                          </Text>
                        </Text>
                        <Text style={styles.pts}>
                          {item?.metrics?.totalObtainedMark || 0} pts
                        </Text>
                      </View>
                    </View>
                    <Hexagon
                      number={item?.rank.toString() || '0'}
                      color={
                        item?.rank === 1
                          ? Colors.PureYellow
                          : item?.rank === 2
                          ? Colors.PurePurple
                          : item?.rank === 3
                          ? Colors.PureCyan
                          : Colors.PureGray
                      }
                    />
                  </View>

                  <View style={styles.ShowProgress}>
                    <Text style={styles.topProgress}>Progress</Text>
                    <Text style={styles.percentage}>
                      {item.metrics?.overallPercentageAllItems || 0}%
                    </Text>
                  </View>
                  <CustomProgressbar
                    containerStyle={{
                      marginVertical: gGap(5),
                      backgroundColor: Colors.BodyTextOpacity,
                    }}
                    innerContainerStyle={{
                      backgroundColor:
                        item?.rank === 1
                          ? Colors.PureYellow
                          : item?.rank === 2
                          ? Colors.PurePurple
                          : item?.rank === 3
                          ? Colors.PureCyan
                          : Colors.PureGray,
                    }}
                    progress={
                      item.metrics?.overallPercentageAllItems / 100 || 0
                    }
                  />

                  {renderBadge(item.rank)}

                  <Text style={styles.heading}>
                    Last Update:
                    <Text style={styles.headingText}>
                      {' '}
                      {moment(totalData?.lastUpdated).format(
                        'MMM DD, YYYY, (h:mm a)',
                      )}
                    </Text>
                  </Text>
                </View>
              ))
            ) : (
              <NoDataAvailable />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default LeaderBoardScreen;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      // padding: responsiveScreenWidth(5),
      paddingHorizontal: 15,
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    // HeadingContainer: {
    //   borderBottomWidth: 1.5,
    //   borderColor: Colors.BorderColor3,
    //   paddingBottom: responsiveScreenHeight(1.5),
    // },
    heading: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      paddingVertical: 3,
    },
    headingText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      lineHeight: responsiveScreenHeight(2.5),
    },
    text: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      paddingVertical: responsiveScreenHeight(1.5),
    },
    progressContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(2),
    },
    progressInfo: {
      flexDirection: 'row',
      gap: 10,
      // justifyContent: "space-between"
      // alignItems: "center",
    },
    img: {
      width: 60,
      height: 60,
    },
    progressTitle: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      width: responsiveScreenWidth(52.5),
    },
    progressText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    smallText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.PureWhite,
    },
    smallText2: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
    },
    progressHeading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    ShowProgress: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: responsiveScreenWidth(2),
    },
    your: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
    },
    progress1: {
      width: '100%',
      height: 10,
      borderRadius: 10,
      marginTop: responsiveScreenHeight(1),
      backgroundColor: Colors.BodyTextOpacity,
      marginBottom: responsiveScreenWidth(1.5),
    },
    topContainer: {
      marginTop: 10,
    },
    topTitle: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      paddingBottom: 10,
    },
    topersContainer: {
      paddingVertical: responsiveScreenWidth(4),
      paddingHorizontal: 10,
      borderRadius: responsiveScreenWidth(3),
    },
    toperInfo: {
      flexDirection: 'row',
      // gap: 2,
      marginBottom: responsiveScreenHeight(1),
      justifyContent: 'space-between',
    },
    toperImg: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    name: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      width: responsiveScreenWidth(40),
    },
    pts: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.REGULAR,
    },
    topProgress: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
    percentage: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
    progressAll: {
      width: '100%',
      height: 10,
      borderRadius: 10,
      marginTop: responsiveScreenHeight(1),
      backgroundColor: Colors.Foreground,
      marginBottom: responsiveScreenWidth(1.5),
    },
    infoContainer: {
      flexDirection: 'column',
      gap: 5,
      width: responsiveScreenWidth(55),
    },

    badgeContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    badgeText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
    },
    btn1: {
      marginTop: responsiveScreenHeight(2),
      width: responsiveScreenWidth(43),
      paddingVertical: responsiveScreenWidth(2.5),
      backgroundColor: Colors.PureWhite,
      borderRadius: responsiveScreenWidth(3),
      flexDirection: 'column',
      alignItems: 'center',
    },
    btnText1: {
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    button: {
      marginTop: responsiveScreenHeight(2),
      width: responsiveScreenWidth(43),
      paddingVertical: responsiveScreenWidth(2.5),
      backgroundColor: Colors.Primary,
      borderRadius: responsiveScreenWidth(3),
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttonText: {
      // textAlign: "center",
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    btnContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
    },
  });
