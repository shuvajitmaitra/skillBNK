import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Animated, Easing} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import RNText from '../SharedComponent/RNText';
import {getActiveProgram} from '../../utility/mmkvHelpers';
import {calculateOverallProgress} from '../../utility/commonFunction';
import {useNavigation} from '@react-navigation/native';
import ArrowRightWithoutTail from '../../assets/Icons/ArrowRightWithoutTail';
import {ProgressRing} from './ProgressRing';
const getGreeting = (date = new Date()): string => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
};

export default function HomeHeaderSection() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const greeting = useMemo(() => getGreeting(), []);
  const {bootcamp = []} = useSelector((state: any) => state.dashboard);
  const active = getActiveProgram();
  const {myEnrollments} = useSelector((state: RootState) => state.auth);
  const programCounts = myEnrollments.filter(
    e => e.program.type === 'program',
  ).length;
  const courseCounts = myEnrollments.filter(
    e => e.program.type === 'course',
  ).length;
  const navigation = useNavigation<any>();

  const handleMyProgramNavigation = (): void => {
    navigation.navigate('ProgramStack', {screen: 'Program'});
  };
  const pro = calculateOverallProgress(bootcamp); // 0..100
  const ringProgress = (pro || 0) / 100;

  // card slide in
  const cardIn = useRef(new Animated.Value(0)).current; // 0..1
  // progress bar fill
  const barProg = useRef(new Animated.Value(0)).current; // 0..100
  // play pulse
  const playPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    cardIn.setValue(0);
    barProg.setValue(0);

    Animated.parallel([
      Animated.timing(cardIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(barProg, {
        toValue: Math.max(0, Math.min(100, pro || 0)),
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // width
      }),
    ]).start();

    // play pulse loop
    playPulse.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(playPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(playPulse, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pro, cardIn, barProg, playPulse]);

  const cardTranslateX = cardIn.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });
  const cardOpacity = cardIn;

  const playScale = playPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const barWidth = barProg.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        {/* <ProgressRing progress={pro / 100} /> */}
        <ProgressRing
          progress={ringProgress}
          size={90}
          strokeWidth={6}
          color={Colors.Primary}
          trackColor={Colors.PrimaryOpacityColor}
          glowColor={Colors.Primary}
          textStyle={{color: Colors.Heading}}
          subTextStyle={{color: Colors.BodyText}}
        />

        <View style={styles.rightCol}>
          <RNText style={styles.greeting}>{greeting}</RNText>
          <RNText style={styles.name}>{user?.fullName}</RNText>
          <RNText style={styles.level}>{user?.email}</RNText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <View style={styles.metaDot} />
              <RNText style={styles.metaText}>
                {programCounts || 0}{' '}
                {programCounts > 1 ? 'Programs' : 'Program'}
              </RNText>
            </View>

            <View style={styles.metaItem}>
              <View style={styles.metaDot} />
              <RNText style={styles.metaText}>
                {courseCounts || 0} {courseCounts > 1 ? 'Courses' : 'Course'}
              </RNText>
            </View>
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          styles.card,
          {opacity: cardOpacity, transform: [{translateX: cardTranslateX}]},
        ]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleMyProgramNavigation}
          style={styles.cardInner}>
          <View style={styles.playWrap}>
            <Animated.View
              style={[styles.playCircle, {transform: [{scale: playScale}]}]}>
              <Text style={styles.playIcon}>▶</Text>
            </Animated.View>
          </View>

          <View style={styles.cardTextCol}>
            <RNText style={styles.resumeLabel}>RESUME</RNText>
            <RNText style={styles.courseTitle} numberOfLines={1}>
              {active?.programName}
            </RNText>

            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, {width: barWidth}]} />
            </View>
          </View>

          <View style={styles.arrowWrap}>
            <ArrowRightWithoutTail color={Colors.Primary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 18,
      paddingTop: 14,
    },

    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    rightCol: {
      flex: 1,
      marginLeft: 16,
    },

    greeting: {
      color: Colors.Primary,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },

    name: {
      color: Colors.Heading,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.2,
      marginBottom: 2,
    },

    level: {
      color: Colors.BodyText,
      fontSize: 14,
      marginBottom: 10,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18, // RN 0.71+; if not supported, replace with marginRight on first item
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    metaDot: {
      width: 7,
      height: 7,
      borderRadius: 999,
      backgroundColor: Colors.Primary,
      marginRight: 8,
    },

    metaText: {
      color: Colors.Heading,
      fontSize: 14,
      fontWeight: '700',
    },

    // Ring center text overlay
    ringCenter: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ringPercent: {
      fontSize: 20,
      fontWeight: '900',
      color: Colors.Heading,
      lineHeight: 22,
    },

    ringComplete: {
      marginTop: 2,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: Colors.BodyText,
    },

    // Resume card
    card: {
      marginTop: 16,
      backgroundColor: Colors.Foreground,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },

    cardInner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
    },

    playWrap: {
      marginRight: 12,
    },

    playCircle: {
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundColor: Colors.PrimaryOpacityColor,

      alignItems: 'center',
      justifyContent: 'center',
    },

    playIcon: {
      color: Colors.Primary,
      fontSize: 20,
      fontWeight: '900',
      marginLeft: 2, // nudge to look centered like a play icon
    },

    cardTextCol: {
      flex: 1,
    },

    resumeLabel: {
      color: Colors.BodyText,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.8,
      marginBottom: 2,
    },

    courseTitle: {
      color: Colors.Heading,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
    },

    progressTrack: {
      height: 4,
      borderRadius: 999,
      backgroundColor: '#E9EEF9',
      overflow: 'hidden',
      width: '92%',
    },

    progressFill: {
      height: '100%',
      backgroundColor: Colors.Primary,
      borderRadius: 999,
    },

    arrowWrap: {
      width: 34,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },

    arrow: {
      color: Colors.Primary,
      fontSize: 22,
      fontWeight: '900',
    },
  });
