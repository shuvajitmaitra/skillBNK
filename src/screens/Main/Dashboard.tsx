import React, {JSX, useMemo, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import CustomFonts from '../../constants/CustomFonts';
import DashboardTopPart from '../../components/DashboardCom/DashboardTopPart';
import {LoadCalenderInfo, LoadMockInterviewInfo} from '../../actions/apiCall';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {RootState} from '../../types/redux/root';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import ProgramIconBig from '../../assets/Icons/ProgramIconBig';
import CalenderIconBig from '../../assets/Icons/CalenderIconBig';
import DashboardIcon from '../../assets/Icons/DashboardIcon';
import MockInterviewIcon from '../../assets/Icons/MockInterviewIcon';
import CommunityIcon from '../../assets/Icons/CommunityIcon';
import MediaIcon from '../../assets/Icons/MediaIcon';
import MessageIconLive2 from '../../assets/Icons/MessageIconLive2';
import {
  FontAwesomeIcon,
  IoniconsIcon,
  MaterialCommunityIcon,
} from '../../constants/Icons';

import ProgramSwitchModal from '../../components/SharedComponent/ProgramSwitchModal';
import {getActiveProgram, getFromMMKV} from '../../utility/mmkvHelpers';
import {theme} from '../../utility/commonFunction';
import HomeHeaderSection from '../../components/HomeCom/HomeHeaderSection';
import NavigationItem from '../../components/HomeCom/NavigationItem';
import {TChat} from '../../types/chat/chatTypes';

// -------------------- Types --------------------
export type NavItem = {
  id: string;
  title: string;
  subTitle: string;
  icon: JSX.Element;
  backgroundColor: string;
  circleColor: string;
  visible?: boolean;
  onPress: () => void;
  badge?: number;
};

// -------------------- Screen --------------------
const Dashboard: React.FC = () => {
  const {myEnrollments} = useSelector((state: RootState) => state.auth);
  const {chats} = useSelector((state: RootState) => state.chat);

  const hasMenu = (menuId: string) => {
    const navigationData = getFromMMKV('navigationData');
    if (!Array.isArray(navigationData)) return false;
    return !!navigationData.find((menu: any) => menu.id === menuId);
  };

  const hasDashboard = hasMenu('dashboard');
  const hasProgram =
    hasMenu('my-program') ||
    hasMenu('portal-audio-video-sending') ||
    hasMenu('portal-template') ||
    hasMenu('portal-diagram') ||
    hasMenu('leaderboard');
  const hasSlide = hasMenu('portal-slide');

  const hasChat = hasMenu('portal-my-chats');
  const hasCalendar = hasMenu('portal-calendar');
  const hasNotes = hasMenu('portal-my-notes');
  const hasCommunity = hasMenu('portal-community');
  const hasMockInterview =
    hasMenu('portal-mock-interviews') || hasMenu('mock-interviews');
  const hasAudioVideo = hasMenu('portal-audio-video-sending');

  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation<NavigationProp<any>>();
  const {top} = useSafeAreaInsets();

  const {pendingInvitationCount} = useSelector(
    (state: RootState) => state.calendarV2,
  );

  const unreadCounts = chats?.filter(
    (chat: TChat) =>
      Boolean(chat?.unreadCount) &&
      chat?.myData?.user !== chat?.latestMessage?.sender?._id &&
      !chat?.isArchived,
  ).length;

  const [statusSectionVisible, setStatusSectionVisible] =
    useState<boolean>(false);
  const [proSwitch, setProSwitch] = useState(false);

  const selectedProgram = getActiveProgram();

  const handleDefaultRoute = (): void => {
    navigation.navigate('DefaultRoute', {
      title: 'Enrollment is not available',
      description:
        'Sorry, You have not enrolled at any Bootcamp yet. Please explore your Institutes website to enroll your preferred bootcamp!\n or \n If you already enrolled, please select your program.',
    });
  };

  const handleMyProgramNavigation = (): void => {
    if (myEnrollments.length > 0) return setProSwitch(prev => !prev);
    navigation.navigate('ProgramStack', {screen: 'Program'});
  };

  const handleMyChatNavigation = (): void => {
    hasChat && navigation.navigate('HomeStack', {screen: 'NewChatScreen'});
  };

  const handleNewCalendarNavigation = (): void => {
    hasCalendar
      ? navigation.navigate('MyCalenderStack', {screen: 'CalendarScreenV2'})
      : handleDefaultRoute();
  };

  const handleMockInterviewNavigation = (): void => {
    hasMockInterview
      ? navigation.navigate('MockInterview')
      : handleDefaultRoute();
  };
  const handleSlides = (): void => {
    hasSlide ? navigation.navigate('PresentationSlides') : handleDefaultRoute();
  };

  const handleDashboardNavigation = (): void => {
    if (!hasDashboard) return;
    LoadCalenderInfo();
    LoadMockInterviewInfo();
    navigation.navigate('HomeStack', {screen: 'UserDashboard'});
  };

  const handleCommunityNavigation = (): void => {
    if (!hasCommunity) return;
    navigation.navigate('CommunityStack', {screen: 'CommunityScreen'});
  };

  const handleAudioVideoNavigation = (): void => {
    if (!hasAudioVideo) return;
    navigation.navigate('ProgramStack', {screen: 'AudioVideoScreen'});
  };

  const handleNotesNavigation = (): void => {
    if (!hasNotes) return;
    navigation.navigate('HomeStack', {screen: 'NotesScreen'});
  };

  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      {
        id: 'enrollments',
        title: 'Enrollments',
        subTitle: 'Your active courses',
        backgroundColor: '#097ef2',
        circleColor: Colors.BodyTextOpacity,
        icon: (
          <IoniconsIcon
            name="book-outline"
            size={25}
            color={Colors.PureWhite}
          />
        ),
        visible: true,
        onPress: () => {
          myEnrollments.length === 0
            ? handleDefaultRoute()
            : handleMyProgramNavigation();
        },
        badge: myEnrollments.length || 0,
      },

      {
        id: 'program',
        title: selectedProgram?.type === 'program' ? 'Bootcamps' : 'Courses',
        subTitle: 'Your learning hub',
        backgroundColor: Colors.Primary,
        circleColor: Colors.BodyTextOpacity,
        icon: <ProgramIconBig color={Colors.PureWhite} />,
        visible: hasProgram,
        onPress: () => {
          if (myEnrollments.length === 0) return handleDefaultRoute();

          if (selectedProgram?._id) {
            navigation.navigate('ProgramStack', {screen: 'Program'});
          } else {
            handleMyProgramNavigation();
          }
        },
      },

      {
        id: 'calendar',
        title: 'Calendar',
        subTitle: 'Schedule & events',
        backgroundColor: '#006884',
        circleColor: Colors.BodyTextOpacity,
        icon: <CalenderIconBig color={Colors.PureWhite} />,
        visible: hasCalendar,
        onPress: handleNewCalendarNavigation,
        badge: pendingInvitationCount || 0,
      },

      {
        id: 'dashboard',
        title: 'Dashboard',
        subTitle: 'Analytics & insights',
        backgroundColor: '#EB77E6',
        circleColor: Colors.BodyTextOpacity,
        icon: <DashboardIcon color={Colors.PureWhite} />,
        visible: hasDashboard,
        onPress: () => {
          if (myEnrollments.length === 0) return handleDefaultRoute();
          handleDashboardNavigation();
        },
      },

      {
        id: 'chats',
        title: 'Chats',
        subTitle: 'Instructor messaging',
        backgroundColor: '#9908F5',
        circleColor: Colors.BodyTextOpacity,
        icon: <MessageIconLive2 size={30} color={Colors.PureWhite} />,
        visible: hasChat,
        onPress: handleMyChatNavigation,
        badge: unreadCounts || 0,
      },

      {
        id: 'notes',
        title: 'Notes',
        subTitle: 'Your quick notes',
        backgroundColor: '#FF6666',
        circleColor: Colors.BodyTextOpacity,
        icon: (
          <MaterialCommunityIcon
            name="notebook-outline"
            size={30}
            color={Colors.PureWhite}
          />
        ),
        visible: hasNotes,
        onPress: handleNotesNavigation,
      },
      {
        id: 'diagram',
        title: 'White Board',
        subTitle: 'Draw your diagram',
        backgroundColor: '#667fff',
        circleColor: Colors.BodyTextOpacity,
        icon: (
          <MaterialCommunityIcon
            name="pen"
            size={30}
            color={Colors.PureWhite}
          />
        ),
        visible: hasProgram,
        onPress: () => navigation.navigate('ArchitectureDiagram'),
      },
      {
        id: 'community',
        title: 'Community',
        subTitle: 'Connect & learn',
        backgroundColor: '#83B4FF',
        circleColor: Colors.BodyTextOpacity,
        icon: <CommunityIcon color={Colors.PureWhite} />,
        visible: hasCommunity,
        onPress: handleCommunityNavigation,
      },

      {
        id: 'mock_interview',
        title: 'Mock Interview',
        subTitle: 'Practice sessions',
        backgroundColor: '#4f14ea',
        circleColor: Colors.BodyTextOpacity,
        icon: <MockInterviewIcon color={Colors.PureWhite} />,
        visible: hasMockInterview,
        onPress: handleMockInterviewNavigation,
      },
      {
        id: 'presentations_slides',
        title: 'Slides',
        subTitle: 'Slides Decks',
        backgroundColor: '#418941',
        circleColor: Colors.BodyTextOpacity,
        icon: (
          <FontAwesomeIcon
            name="slideshare"
            size={25}
            color={Colors.PureWhite}
          />
        ),
        visible: hasSlide,
        onPress: handleSlides,
      },

      {
        id: 'audio_video',
        title: 'Audios & Videos',
        subTitle: 'Media resources',
        backgroundColor: '#DA7297',
        circleColor: Colors.BodyTextOpacity,
        icon: <MediaIcon color={Colors.PureWhite} />,
        visible: hasAudioVideo,
        onPress: () => {
          if (myEnrollments.length === 0) return handleDefaultRoute();
          handleAudioVideoNavigation();
        },
      },
    ];

    return items.filter(i => i.visible !== false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Colors.Primary,
    Colors.PureWhite,
    Colors.Heading,
    hasAudioVideo,
    hasCalendar,
    hasChat,
    hasCommunity,
    hasDashboard,
    hasMockInterview,
    hasNotes,
    hasProgram,
    myEnrollments.length,
    navigation,
    selectedProgram?._id,
    selectedProgram?.type,
  ]);

  const renderItem: ListRenderItem<NavItem> = ({item, index}) => (
    <View style={styles.gridItem}>
      <NavigationItem item={item} index={index} />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors.Background_color, paddingTop: top},
      ]}>
      {proSwitch && (
        <ProgramSwitchModal
          onCancelPress={() => setProSwitch(prev => !prev)}
          modalOpen={proSwitch}
        />
      )}

      <StatusBar
        translucent
        backgroundColor={Colors.Background_color}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />

      <DashboardTopPart
        setProSwitch={setProSwitch}
        switchAvailable={myEnrollments.length > 1}
        statusSectionVisible={statusSectionVisible}
        setStatusSectionVisible={setStatusSectionVisible}
      />

      <HomeHeaderSection />

      {/* <HomeUserDetails
        statusSectionVisible={statusSectionVisible}
        setStatusSectionVisible={setStatusSectionVisible}
      /> */}

      {/* ✅ Two-column grid */}
      <FlatList
        data={navItems}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.navigationText}>Explore</Text>}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {flex: 1},

    navigationText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      marginTop: responsiveScreenHeight(2),
      marginLeft: responsiveScreenWidth(5),
      marginBottom: responsiveScreenHeight(1.5),
    },

    listContent: {
      paddingBottom: 20,
    },

    columnWrapper: {
      paddingHorizontal: responsiveScreenWidth(5),
      // justifyContent: 'space-between',
      marginBottom: 10,
      gap: 10,
    },

    // wrapper for each card in grid
    gridItem: {
      flex: 1,
      // width: responsiveScreenWidth(42),
    },
  });

export default Dashboard;
