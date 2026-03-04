import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import CalendarIconSmall from '../../assets/Icons/CalendarIconSmall';
import CheckIcon from '../../assets/Icons/CheckIcon';
import UnCheckIcon from '../../assets/Icons/UnCheckIcon';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import axiosInstance from '../../utility/axiosInstance';
import Images from '../../constants/Images';
import {THistory} from '../../types/calendar/calendar';
import {TColors} from '../../types';
import {IParticipant} from '../../types/calendar/event';

const EventHistory = ({
  participants,
  eventId,
}: {
  participants?: IParticipant[];
  eventId?: string;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [status, setStatus] = useState('accepted');
  const [histories, setHistories] = useState([]);
  useEffect(() => {
    const getEventHistory = async () => {
      axiosInstance
        .post('history/getHistory', {itemId: eventId})
        .then(res => {
          // console.log('event history', JSON.stringify(res?.data, null, 1));
          setHistories(
            res?.data?.histories?.filter((item: THistory) => item?.version > 0),
          );
        })
        .catch(error => {
          console.log(
            'error event history.......',
            JSON.stringify(error.response.data, null, 1),
          );
        });
    };
    setTimeout(() => {
      getEventHistory();
    }, 1000);
    return () => {
      setHistories([]);
    };
  }, [eventId]);

  const tabs = [
    {
      label: 'Accepted',
      value: 'accepted',
    },
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Proposed New Time',
      value: 'proposedTime',
    },
    {
      label: 'Denied',
      value: 'denied',
    },
    {
      label: 'Changed History',
      value: 'updateHistory',
    },
  ];

  // if (loading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (error) {
  //   return <Text>Error: {error.message}</Text>;
  // }
  const participantsData = participants?.filter(
    (item: IParticipant) => item?.status === status,
  );

  const getStatusCount = (stat: string) =>
    participants?.filter((item: IParticipant) => item?.status === stat)
      ?.length || 0;
  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: responsiveScreenWidth(4),
          borderBottomColor: Colors.BorderColor,
          borderBottomWidth: 1,
        }}
        horizontal
        style={styles.tabContainer}
        showsHorizontalScrollIndicator={false}>
        {tabs.map(item => (
          <Pressable
            key={item.value}
            onPress={() => {
              setStatus(item.value);
            }}
            style={[
              styles.tabItemContainer,
              status === item.value && {
                borderBottomWidth: 3,
                borderBottomColor: Colors.Primary,
              },
            ]}>
            <Text
              style={[
                styles.tabItemText,
                status === item.value && {
                  color: Colors.Primary,
                },
              ]}>
              {item.label}(
              {item.value === 'updateHistory'
                ? histories.length
                : getStatusCount(item.value)}
              )
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {status === 'updateHistory' ? (
        <>
          {histories?.length ? (
            histories.map((history: THistory) => (
              <View key={history._id}>
                <View style={styles.versionContainer}>
                  <Text style={styles.versionText}>
                    Version: {history.version}
                  </Text>
                </View>
                <View>
                  {Object.entries(history.diff)
                    .map(([key, value]) => {
                      return {key, ...value};
                    })
                    .map((item, index) => (
                      <View style={styles.textContainer} key={index}>
                        <Text style={styles.text1}>{item.key}</Text>
                        <Text style={styles.text2}>
                          <Text style={styles.text2label}>Previous: </Text>
                          {item.oldValue || 'N/A'}
                        </Text>
                        <Text style={styles.text3}>
                          <Text style={styles.text2label}>Current: </Text>
                          {item.newValue}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            ))
          ) : (
            <NoDataAvailable />
          )}
        </>
      ) : (
        <>
          {participantsData?.length ? (
            participantsData?.map(participant => (
              <View key={participant._id}>
                {
                  <>
                    <View style={styles.participantContainer}>
                      <Image
                        style={styles.profileImage}
                        source={
                          participant?.user?.profilePicture
                            ? {
                                uri: participant?.user?.profilePicture,
                              }
                            : Images.DEFAULT_IMAGE
                        }
                      />
                      <View>
                        <Text style={styles?.profileName}>
                          {participant?.user?.fullName}
                        </Text>
                        <Text style={styles?.dateText}>
                          <Text style={styles?.dateHeading}>Date: </Text>
                          {moment(participant?.addedAt)?.format(
                            'MMM DD, YYYY, hh:mm A',
                          )}
                        </Text>
                      </View>
                    </View>
                    {status === 'proposedTime' && (
                      <View style={styles?.dateTimeContainer}>
                        <View style={styles?.timeDateContainer}>
                          <CalendarIconSmall />
                          <Text style={styles.timeDateLabel}>
                            Event Time & Date
                          </Text>
                        </View>
                        <View style={styles.dateTimeRow}>
                          <Text style={styles.dateTimeLabel}>Start Date:</Text>
                          <TouchableOpacity style={styles.dateTimePicker}>
                            <Text style={styles.timeDateText}>
                              {moment(participant?.proposedTime?.start).format(
                                'MMM DD, YYYY',
                              )}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.dateTimePicker}>
                            <Text style={styles.timeDateText}>
                              {moment(participant?.proposedTime?.start).format(
                                'hh:mm A',
                              )}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.dateTimeRow}>
                          <Text style={styles.dateTimeLabel}>End Date:</Text>
                          <TouchableOpacity style={styles.dateTimePicker}>
                            <Text style={styles.timeDateText}>
                              {moment(participant?.proposedTime?.end).format(
                                'MMM DD, YYYY',
                              )}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.dateTimePicker}>
                            <Text style={styles.timeDateText}>
                              {moment(participant?.proposedTime?.end).format(
                                'hh:mm A',
                              )}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.allDayContainer}>
                          {false ? <CheckIcon /> : <UnCheckIcon />}
                          <Text style={styles.allDayText}>All Day</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                }
              </View>
            ))
          ) : (
            <NoDataAvailable />
          )}
        </>
      )}
    </View>
  );
};

export default EventHistory;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    text2label: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.9),
      fontWeight: '600',
      fontFamily: CustomFonts.MEDIUM,
    },
    versionContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      marginVertical: responsiveScreenHeight(2),
      padding: 10,
      borderRadius: 10,
    },
    versionText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontWeight: '600',
      // textDecorationLine: "underline",
    },
    text1: {
      flex: 0.3,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
      textTransform: 'capitalize',
      marginBottom: responsiveScreenHeight(1),
    },
    text2: {
      flex: 0.3,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    text3: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      flex: 0.3,
    },
    textContainer: {
      // flexDirection: "col",
      // alignItems: "center",
      justifyContent: 'flex-start',
      // gap: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
    },
    dateTimeContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      gap: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      zIndex: 1,
    },
    timeDateContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1.5),
      paddingBottom: responsiveScreenHeight(1.5),
      alignItems: 'center',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    timeDateLabel: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    dateTimeRow: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
    },
    dateTimeLabel: {
      color: Colors.BodyText,
      fontWeight: '500',
    },
    dateTimePicker: {
      backgroundColor: Colors.Foreground,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 4,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    timeDateText: {
      color: 'rgba(39, 172, 31, 1)',
    },
    allDayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    allDayText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
    dateText: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
    },
    dateHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    profileName: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 100,
    },
    tabContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    tabItemContainer: {
      paddingBottom: responsiveScreenHeight(1),
    },
    tabItemText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    participantContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(2),
    },
  });
