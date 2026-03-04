import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
  Pressable,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import CustomFonts from '../../constants/CustomFonts';
import ProgressIcon from '../../assets/Icons/ProgressIcon';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../../constants/Images';
import {TColors} from '../../types';
import {ProgramStackParamList} from '../../types/navigation';
import {TProgramMain} from '../../types/program/programModuleType';
import {RootState} from '../../types/redux/root';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import {calculateOverallProgress} from '../../utility/commonFunction';
import moment from 'moment';
import {
  AntDesignIcon,
  FeatherIcon,
  FontAwesome6Icon,
  MaterialIcon,
} from '../../constants/Icons';
import {setPreFilterItem} from '../../store/reducer/programReducer';
import GoToProgramButton from './GoToProgramButton';
import ProgressBarSection from './ProgressBarSection';
import AnimatedStatCard from './AnimatedStatCard';

interface ProgramItemProps {
  myprogram: TProgramMain | undefined;
}

const ProgramItem: React.FC<ProgramItemProps> = ({myprogram}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<ProgramStackParamList>>();
  const {user} = useSelector((state: RootState) => state.auth);
  const {bootcamp = []} = useSelector((state: any) => state.dashboard);

  const handleCourseDetails = (routeName?: string) => {
    navigation.navigate('ProgramDetails', {
      slug: myprogram?.program?.slug ? myprogram?.program?.slug : '',
      routeName: routeName || null,
    });
  };

  const handleProgress = () => {
    navigation.navigate('Progress');
  };

  const totalModules =
    bootcamp.length > 0 &&
    bootcamp.reduce(
      (acc: number, item: {totalItems: number}) => item.totalItems + acc,
      0,
    );

  const overall = calculateOverallProgress(bootcamp);

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleCourseDetails()}>
          <Text style={styles.title}>
            {myprogram?.program?.title || 'Bootcamps'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Last update + total modules row */}
      <View style={styles.rowBetween}>
        <View style={styles.sessionContainer}>
          <FeatherIcon
            name="clock"
            size={20}
            style={{marginRight: gGap(5)}}
            color={Colors.Heading}
          />
          <Text style={styles.sessionText}>Last Update:</Text>
          <Text style={styles.sessionDate}>
            {myprogram?.program?.updatedAt
              ? moment(myprogram?.program.updatedAt).fromNow()
              : 'N/A'}
          </Text>
        </View>

        {!!totalModules && (
          <Pressable
            onPress={() => handleCourseDetails()}
            style={styles.sessionContainer}>
            <FeatherIcon name="layers" size={22} color={Colors.Heading} />
            <Text style={styles.sessionDate}>{totalModules}</Text>
          </Pressable>
        )}
      </View>

      {/* Company */}
      <View style={styles.sessionContainer}>
        <FontAwesome6Icon
          name="building-columns"
          size={20}
          style={{marginRight: gGap(5)}}
          color={Colors.Heading}
        />
        <Text style={styles.sessionText}>Company:</Text>

        {/* ✅ wrap long text safely */}
        <Text style={[styles.sessionDate, {flex: 1}]} numberOfLines={1}>
          {myprogram?.enrollment?.organization?.name || ''}
        </Text>
      </View>

      {/* Branch (✅ FIXED: NO View inside Text) */}
      <View style={styles.sessionContainer}>
        <MaterialIcon
          name="store"
          size={20}
          style={{marginRight: gGap(5)}}
          color={Colors.Heading}
        />
        <Text style={styles.sessionText}>Branch:</Text>

        <Text style={[styles.sessionDate, {flex: 1}]} numberOfLines={1}>
          {myprogram?.enrollment?.branch?.name || ''}
        </Text>
      </View>

      {/* Session + ID */}
      <View style={styles.sessionContainer}>
        <Text style={styles.sessionText}>Session:</Text>
        <Text style={styles.sessionDate} numberOfLines={1}>
          {myprogram?.enrollment?.session?.name || 'N/A'}
        </Text>

        <Text style={[styles.sessionText, {marginLeft: 20}]}>ID:</Text>
        <Text style={[styles.sessionDate, {marginLeft: 5}]}>
          {user?.id ?? 0}
        </Text>
      </View>

      {/* Instructor */}
      <View style={styles.sessionContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              myprogram?.program?.instructor?.image
                ? {uri: myprogram?.program?.instructor?.image}
                : Images.DEFAULT_IMAGE
            }
            style={styles.image}
          />
        </View>
        <Text style={[styles.sessionDate, styles.instructor]}>Instructor:</Text>
        <Text style={styles.sessionText} numberOfLines={1}>
          {myprogram?.program?.instructor?.name || 'N/A'}
        </Text>
      </View>

      {/* Stats */}
      {bootcamp?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}>
          <AnimatedStatCard index={0}>
            <StatContainer
              onPress={() => {
                dispatch(setPreFilterItem('completed'));
                handleCourseDetails();
              }}
              Colors={Colors}
              icon={
                <AntDesignIcon
                  name="checkcircleo"
                  size={20}
                  color={Colors.SuccessColor}
                />
              }
              field="Completed"
              result={bootcamp.reduce(
                (acc: number, item: {completedItems: number}) =>
                  item.completedItems + acc,
                0,
              )}
            />
          </AnimatedStatCard>
          <AnimatedStatCard index={1}>
            <StatContainer
              onPress={() => {
                dispatch(setPreFilterItem('incomplete'));
                handleCourseDetails();
              }}
              Colors={Colors}
              icon={
                <FeatherIcon name="clock" size={20} color={Colors.PureYellow} />
              }
              field="Remaining"
              result={bootcamp.reduce(
                (acc: number, item: {incompletedItems: number}) =>
                  item.incompletedItems + acc,
                0,
              )}
            />
          </AnimatedStatCard>
          <AnimatedStatCard index={2}>
            <StatContainer
              onPress={() => {
                dispatch(setPreFilterItem(null));
                handleCourseDetails();
              }}
              Colors={Colors}
              icon={
                <FeatherIcon
                  name="layers"
                  size={25}
                  color={Colors.PurePurple}
                />
              }
              field="Total"
              result={Number(totalModules || 0)}
            />
          </AnimatedStatCard>
        </ScrollView>
      )}

      {/* Overall Progress */}
      <ProgressBarSection overall={overall} />

      {/* Buttons */}
      <AnimatedStatCard index={0}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleProgress}
            activeOpacity={0.8}
            style={styles.myPrograssBtn}>
            <ProgressIcon color={Colors.SecondaryButtonTextColor} />
            <Text style={styles.progressText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LeaderBoardScreen')}
            activeOpacity={0.8}
            style={styles.myPrograssBtn}>
            <ProgressIcon color={Colors.SecondaryButtonTextColor} />
            <Text style={styles.progressText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </AnimatedStatCard>

      {/* Go to Bootcamp */}

      <GoToProgramButton
        onPress={() => {
          dispatch(setPreFilterItem(null));
          handleCourseDetails();
        }}
      />

      {/* Lessons grid (2 columns, fills space) */}
      <View style={styles.lessonGrid}>
        {bootcamp?.map((item: any) => (
          <LessonItemContainer
            key={
              item?.category?.slug ?? String(item?.category?._id ?? item?.id)
            }
            containerStyle={styles.lessonItem}
            title={item?.category?.name}
            count={item?.totalItems}
            Colors={Colors}
            onPress={() => handleCourseDetails(item?.category?.slug)}
          />
        ))}
      </View>
    </View>
  );
};

export default ProgramItem;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginTop: gGap(10),
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.subHeading,
      color: Colors.Heading,
    },

    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: responsiveScreenHeight(1),
    },

    sessionContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(1),
      alignItems: 'center',
    },
    sessionText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
    },
    sessionDate: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.BodyText,
      marginLeft: 6,
    },

    profileImageContainer: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(12),
      overflow: 'hidden',
    },
    image: {
      width: responsiveScreenWidth(8),
      height: responsiveScreenWidth(8),
      borderRadius: responsiveScreenWidth(12),
      backgroundColor: Colors.LightGreen,
    },
    instructor: {
      marginRight: 8,
      marginLeft: 8,
    },

    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      // if your RN doesn't support gap, remove and use marginRight inside StatContainer
      gap: gGap(10),
      marginTop: gGap(5),
      marginBottom: gGap(10),
    },

    buttonContainer: {
      flexDirection: 'row',
      minWidth: '100%',
      justifyContent: 'center',
      gap: responsiveScreenWidth(3),
      marginTop: responsiveScreenWidth(4),
      marginBottom: responsiveScreenHeight(1),
    },

    progressText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.SecondaryButtonTextColor,
    },

    myPrograssBtn: {
      flex: 1,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      borderRadius: 10,
      borderWidth: 2,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(1.5),
    },

    // Lessons grid
    lessonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: gGap(10),
    },
    lessonItem: {
      width: '48%',
      marginBottom: gGap(10),
    },
  });

const StatContainer = ({
  Colors,
  icon,
  field = 'Unavailable',
  result = 0,
  onPress,
}: {
  Colors: any;
  icon: any;
  result: number;
  field: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.Foreground,
        flexDirection: 'row',
        alignItems: 'center',
        gap: gGap(10),
        padding: gGap(10),
        width: 'auto',
        borderRadius: borderRadius.small,
        borderWidth: 1,
        borderColor: Colors.BorderColor,
      }}>
      <View
        style={{
          backgroundColor: Colors.Background_color,
          padding: gGap(5),
          borderRadius: borderRadius.small,
          borderWidth: 1,
          borderColor: Colors.BorderColor,
        }}>
        {icon}
      </View>

      <View>
        <Text
          style={{
            fontSize: fontSizes.body,
            color: Colors.BodyText,
            fontFamily: CustomFonts.REGULAR,
          }}>
          {field}
        </Text>
        <Text
          style={{
            fontSize: fontSizes.heading,
            color: Colors.Heading,
            fontFamily: CustomFonts.SEMI_BOLD,
          }}>
          {result}
        </Text>
      </View>
    </Pressable>
  );
};

const LessonItemContainer = ({
  Colors,
  title,
  count,
  containerStyle,
  onPress,
}: {
  Colors: any;
  title: string;
  count: number;
  containerStyle: ViewStyle;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: gGap(10),
        backgroundColor: Colors.Foreground,
        padding: gGap(10),
        borderWidth: 1,
        borderRadius: borderRadius.small,
        borderColor: Colors.BorderColor,
        ...containerStyle,
      }}>
      <View
        style={{
          padding: gGap(10),
          borderRadius: borderRadius.circle,
          backgroundColor: Colors.Background_color,
          borderWidth: 1,
          borderColor: Colors.BorderColor,
        }}>
        <FeatherIcon name="layers" size={25} color={Colors.PurePurple} />
      </View>

      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: fontSizes.body,
            color: Colors.BodyText,
            fontFamily: CustomFonts.REGULAR,
          }}
          numberOfLines={1}>
          {title || 'Unavailable'}
        </Text>

        <Text
          style={{
            fontSize: fontSizes.heading,
            color: Colors.Heading,
            fontFamily: CustomFonts.SEMI_BOLD,
          }}>
          {count || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
