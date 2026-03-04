import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import axiosInstance from '../../utility/axiosInstance';
import CustomFonts from '../../constants/CustomFonts';
import Toppart from '../../components/DashboardCom/Toppart';
import ProgramItem from '../../components/ProgramCom/ProgramItem';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';
import {TProgramMain} from '../../types/program/programModuleType';
import ProgramItemSkeleton from '../../components/ProgramCom/ProgramItemSkeleton';
import {loadBootcampProgress} from '../../actions/apiCall2';
import {FeatherIcon} from '../../constants/Icons';
import ProgramSwitchModal from '../../components/SharedComponent/ProgramSwitchModal';
import {setPrograms} from '../../store/reducer/programReducer';
import {getActiveProgram} from '../../utility/mmkvHelpers';
import {SafeAreaView} from 'react-native-safe-area-context';
import DefaultRoute from '../../components/SharedComponent/DefaultRoute';

export default function Program({navigation}: any) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {enrollment} = useSelector((state: RootState) => state.auth);
  const selectedProgram = getActiveProgram();

  const [switchModalVisible, setSwitchModalVisible] = useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [myProgram, setMyProgram] = useState<TProgramMain>();

  useLayoutEffect(() => {
    if (!enrollment || enrollment.length === 0) return;
    const fetchProgramData = async () => {
      await loadBootcampProgress();
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/enrollment/myprogram');
        setMyProgram(response.data);
        dispatch(setPrograms(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (enrollment?._id) {
      fetchProgramData();
    }
  }, [dispatch, enrollment?._id, enrollment]);
  if (!enrollment || enrollment.length === 0) {
    return (
      <DefaultRoute
        navigation={navigation}
        route={{
          key: 'DefaultRoute',
          name: 'DefaultRoute',
          params: {
            title: 'Enrollment is not available',
            description:
              'Sorry, You have not enrolled at any Bootcamp yet. Please explore your Institutes website to enroll your preferred bootcamp!\n or \n If you already enrolled, please select your program.',
          },
        }}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.Background_color,
          paddingHorizontal: gGap(16),
        }}>
        <Toppart />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProgramSwitchModal
            onCancelPress={() => {
              setSwitchModalVisible(!switchModalVisible);
            }}
            modalOpen={switchModalVisible}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: gGap(10),
            }}>
            <View>
              <Text style={[styles.title, {color: Colors.Heading}]}>
                {selectedProgram?.type === 'program'
                  ? 'Program'
                  : selectedProgram?.type === 'course'
                  ? 'Course'
                  : 'Bootcamps'}
              </Text>
              <Text style={styles.details}>Keep learning to make progress</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSwitchModalVisible(!switchModalVisible);
              }}
              style={{
                backgroundColor: Colors.PrimaryButtonBackgroundColor,
                flexDirection: 'row',
                alignItems: 'center',
                gap: gGap(5),
                paddingVertical: gGap(5),
                paddingHorizontal: gGap(5),
                borderRadius: borderRadius.small,
              }}>
              <FeatherIcon
                name="refresh-ccw"
                size={18}
                color={Colors.PrimaryButtonTextColor}
              />
              <Text
                style={{
                  color: Colors.PrimaryButtonTextColor,
                  fontSize: fontSizes.small,
                  fontWeight: '500',
                }}>
                Switch
              </Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ProgramItemSkeleton />
          ) : (
            <ProgramItem myprogram={myProgram} />
          )}
          <View style={styles.emptyContainer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.subHeading,
    },
    details: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.small,
      color: Colors.BodyText,
    },
    emptyContainer: {
      height: responsiveScreenHeight(2),
    },
    myPrograssBtn: {
      backgroundColor: Colors.Foreground,
      width: responsiveScreenWidth(93),
      borderRadius: 5,
      marginTop: responsiveScreenHeight(2),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1.5),
    },
    progressText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Primary,
    },
  });
