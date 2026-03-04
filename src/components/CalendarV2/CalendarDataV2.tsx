import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView as RNScrollView,
} from 'react-native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';

import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {setSelectedEventV2} from '../../store/reducer/calendarReducerV2';

import {
  fontSizes,
  gFontSize,
  gGap,
  gHeight,
  gMargin,
  gPadding,
  gWidth,
} from '../../constants/Sizes';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

import ArrowLeft from '../../assets/Icons/ArrowLeft';
import ArrowRight from '../../assets/Icons/ArrowRight';
import {MaterialIcon} from '../../constants/Icons';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {LoadUpcomingEvent} from '../../actions/apiCall2';
import CalendarIcon from '../../assets/Icons/CalendarIcon';
import TaskIcon from '../../assets/Icons/TaskIcon';

const formatDuration = (startTime: string | Date, endTime: string | Date) => {
  const start = moment(startTime);
  const end = moment(endTime);

  const totalMinutes = end.diff(start, 'minutes');
  if (totalMinutes <= 0) return '0 min';

  if (totalMinutes < 60) return `${totalMinutes} min`;

  const totalHours = end.diff(start, 'hours');
  if (totalHours < 24)
    return `${totalHours} ${totalHours === 1 ? 'hr' : 'hrs'}`;

  const totalDays = end.diff(start, 'days');
  return `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
};

export const CalendarDataV2 = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {weeklyEvents: w = []} = useSelector(
    (state: RootState) => state.calendarV2,
  );

  const [displayedEvents, setDisplayedEvents] = useState(10);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [pendingWeekOffset, setPendingWeekOffset] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const scrollViewRef = useRef<RNScrollView>(null);

  // Width of the ScrollView content for snapping
  const slideWidth = responsiveScreenWidth(98);

  useEffect(() => {
    let mounted = true;

    setIsLoadingEvents(true);
    LoadUpcomingEvent(weekOffset)
      .catch(() => {
        // swallow error (optional)
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingEvents(false);
        setPendingWeekOffset(weekOffset);
      });

    setDisplayedEvents(10);

    return () => {
      mounted = false;
    };
  }, [weekOffset]);

  const getWeekWithOffset = useCallback((offset = 0) => {
    const baseDate = moment();
    const start = baseDate.clone().add(offset, 'weeks').startOf('week');
    const end = baseDate.clone().add(offset, 'weeks').endOf('week');
    return `${start.format('MMM DD')} - ${end.format('MMM DD, YYYY')}`;
  }, []);

  const renderItem = useCallback(
    (item: any, index: number) => {
      const prevStartTime = w[index - 1]?.startTime;
      const isSameDayAsPrev =
        prevStartTime &&
        moment(item.startTime).isSame(moment(prevStartTime), 'day');

      return (
        <View key={item?._id ?? String(index)} style={{flex: 1}}>
          {index === 0 || !isSameDayAsPrev ? (
            <Text
              style={{
                fontSize: fontSizes.body,
                color: Colors.Heading,
                fontFamily: CustomFonts.SEMI_BOLD,
                marginVertical: gMargin(5),
              }}>
              {moment(item.startTime).format('dddd, LL')}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => dispatch(setSelectedEventV2(item))}
            style={[
              styles.eventContainer,
              {
                borderLeftColor: item?.eventColor
                  ? item.eventColor
                  : Colors.BodyTextOpacity,
                backgroundColor: item?.eventColor
                  ? `${item.eventColor}30`
                  : undefined,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                gap: gWidth(10),
                alignItems: 'center',
                flex: 1,
              }}>
              <View style={{flexDirection: 'row', gap: gGap(5)}}>
                <Text style={{color: Colors.BodyText, fontSize: gFontSize(10)}}>
                  {moment(item.startTime).format('hh:mm A')}
                </Text>

                {item?.type === 'event' ? (
                  <CalendarIcon color={Colors.BodyText} />
                ) : (
                  <TaskIcon color={Colors.BodyText} />
                )}
              </View>

              <Text
                numberOfLines={1}
                style={{
                  color: Colors.Heading,
                  fontSize: fontSizes.body,
                  flex: 1,
                  fontFamily: CustomFonts.MEDIUM,
                }}>
                {String(item?.title ?? '')}
              </Text>
            </View>

            <Text style={{color: Colors.BodyText, fontSize: gFontSize(10)}}>
              {formatDuration(item.startTime, item.endTime)}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [
      Colors.BodyText,
      Colors.BodyTextOpacity,
      Colors.Heading,
      dispatch,
      styles,
      w,
    ],
  );

  const handleLoadMore = useCallback(() => {
    setDisplayedEvents(prev => prev + 10);
  }, []);

  const renderContent = useCallback(() => {
    const weeklyEvents = Array.isArray(w) ? w : [];

    return (
      <View
        style={{
          width: responsiveScreenWidth(98),
          overflow: 'hidden',
          backgroundColor: Colors.Foreground,
        }}>
        <View style={styles.calenderTopicContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: gGap(10),
              marginBottom: gGap(10),
            }}>
            <MaterialIcon name="upcoming" size={25} color={Colors.BodyText} />
            <Text style={styles.heading}>Upcoming Events</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setWeekOffset(prev => prev - 1)}>
              <ArrowLeft size={20} />
            </TouchableOpacity>

            <Text
              style={{
                color: Colors.BodyText,
                fontSize: fontSizes.body,
                fontFamily: CustomFonts.MEDIUM,
              }}>
              {getWeekWithOffset(pendingWeekOffset)}
            </Text>

            <TouchableOpacity onPress={() => setWeekOffset(prev => prev + 1)}>
              <ArrowRight size={20} color={Colors.BodyText} />
            </TouchableOpacity>
          </View>

          {/* week pills section (currently disabled) */}
          <View
            style={{
              flexDirection: 'row',
              gap: gWidth(5),
              marginVertical: gMargin(5),
            }}
          />

          <View style={{gap: gHeight(5)}}>
            {isLoadingEvents ? (
              <View style={{alignItems: 'center', padding: gPadding(20)}}>
                <ActivityIndicator
                  size="large"
                  color={Colors.PrimaryButtonBackgroundColor}
                />
                <Text
                  style={{
                    color: Colors.BodyText,
                    fontSize: fontSizes.body,
                    marginTop: gMargin(10),
                  }}>
                  Loading events...
                </Text>
              </View>
            ) : weeklyEvents.length > 0 ? (
              weeklyEvents
                .slice(0, displayedEvents)
                .map((item, index) => (
                  <React.Fragment key={item?._id ?? String(index)}>
                    {renderItem(item, index)}
                  </React.Fragment>
                ))
            ) : (
              <View>
                <NoDataAvailable />
              </View>
            )}

            {!isLoadingEvents && weeklyEvents.length > displayedEvents ? (
              <TouchableOpacity
                onPress={handleLoadMore}
                style={{
                  alignItems: 'center',
                  padding: gPadding(10),
                  backgroundColor: Colors.SecondaryButtonBackgroundColor,
                  borderRadius: 5,
                  marginTop: gMargin(10),
                  borderWidth: 1,
                  borderColor: Colors.BorderColor,
                }}>
                <Text
                  style={{
                    color: Colors.SecondaryButtonTextColor,
                    fontSize: fontSizes.body,
                    fontFamily: CustomFonts.MEDIUM,
                  }}>
                  Load More
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }, [
    Colors.BodyText,
    Colors.BorderColor,
    Colors.Foreground,
    Colors.PrimaryButtonBackgroundColor,
    Colors.SecondaryButtonBackgroundColor,
    Colors.SecondaryButtonTextColor,
    displayedEvents,
    getWeekWithOffset,
    handleLoadMore,
    isLoadingEvents,
    pendingWeekOffset,
    renderItem,
    styles.buttonContainer,
    styles.calenderTopicContainer,
    styles.heading,
    w,
  ]);

  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      if (isScrolling) return;
      setIsScrolling(true);

      const currentScrollX = event?.nativeEvent?.contentOffset?.x ?? 0;
      const threshold = slideWidth / 4;

      if (currentScrollX >= slideWidth + threshold) {
        setPendingWeekOffset(prev => prev + 1);
        setWeekOffset(prev => prev + 1);
      } else if (currentScrollX <= slideWidth - threshold) {
        setPendingWeekOffset(prev => prev - 1);
        setWeekOffset(prev => prev - 1);
      }

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({x: slideWidth, animated: false});
      }

      setTimeout(() => setIsScrolling(false), 100);
    },
    [isScrolling, slideWidth],
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={slideWidth}
      snapToAlignment="center"
      decelerationRate="fast"
      scrollEventThrottle={16}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      contentOffset={{x: slideWidth, y: 0}}
      contentContainerStyle={{
        width: slideWidth * 3,
        justifyContent: 'center',
      }}>
      {renderContent()}
      {renderContent()}
      {renderContent()}
    </ScrollView>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    eventContainer: {
      backgroundColor: Colors.LineColor,
      padding: gPadding(5),
      borderLeftWidth: 5,
      borderLeftColor: Colors.BodyTextOpacity,
      borderRadius: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    calenderTopicContainer: {
      paddingVertical: 10,
      paddingHorizontal: gGap(10),
      backgroundColor: Colors.Foreground,
    },
    heading: {
      fontSize: fontSizes.heading,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
  });
