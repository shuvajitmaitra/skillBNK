import React, {memo, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import PopupProgramItem from '../ProgramCom/PopupProgramItem';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {activeProgram, setOrganization} from '../../utility/mmkvHelpers';
import {
  setEnrollment,
  setSelectedOrganization,
} from '../../store/reducer/authReducer';
import {useMainContext} from '../../context/MainContext';
import {RegularFonts} from '../../constants/Fonts';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';
import {IEnrollment} from '../../types/enrollments/enrollments';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import {showToast} from '../HelperFunction';
import {MaterialIcon} from '../../constants/Icons';
import {getMyNavigation} from '../../actions/apiCall';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  modalOpen?: boolean;
  onCancelPress?: () => void;
}
interface enrollType {
  _id: string;
  program?: {
    title: string;
    type: string;
    slug: string;
    // Add other fields if needed.
  };
  session?: {
    name: string;
    // Add other fields if needed.
  };
  organization?: {
    name: string;
    // Add other fields if needed.
  };
  status: string;
}
const ProgramSwitchModal = memo(
  ({modalOpen, onCancelPress = () => {}}: Props) => {
    const dispatch = useDispatch();
    const Colors = useTheme();
    const styles = getStyles(Colors);
    const {myEnrollments, enrollment} = useSelector(
      (state: RootState) => state.auth,
    );
    const navigation = useNavigation<NavigationProp<any>>();
    const [selectedItems, setSelectedItems] = useState<
      'all' | 'program' | 'course' | 'other'
    >('all');
    // console.log('myEnrollments', JSON.stringify(myEnrollments, null, 2));
    const {handleVerify2} = useMainContext();
    // console.log('myEnrollments', JSON.stringify(myEnrollments, null, 2));
    useEffect(() => {
      handleVerify2();
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const handleSwitch = () => {
        console.log(
          'Handle Switch function called in Program switch modal++++++++++++++++++++++++++++++++++++',
        );
        if (myEnrollments.length > 0) {
          dispatch(setEnrollment(myEnrollments[0]));
          // console.log(', JSON.stringify, null, 2))
          activeProgram({
            _id: myEnrollments[0]._id,
            programName: myEnrollments[0].program.title,
            type: myEnrollments[0].program.type,
            slug: myEnrollments[0]?.program?.slug,
          });

          handleVerify2();
          getMyNavigation();
        }
      };
      if (!enrollment?._id) {
        handleSwitch();
        handleVerify2();
      }
    }, [dispatch, enrollment?._id, handleVerify2, myEnrollments]);

    const handleSwitch = async (enroll: enrollType) => {
      dispatch(setSelectedOrganization(enroll.organization as any));
      setOrganization(enroll.organization);
      dispatch(setEnrollment(enroll));
      activeProgram({
        _id: enroll._id,
        programName: enroll?.program?.title ? enroll?.program.title : '',
        type: enroll?.program?.type,
        slug: enroll?.program?.slug,
      });
      await handleVerify2();
      await getMyNavigation();
      showToast({message: 'Program switched successfully!'});
      onCancelPress();
      navigation.navigate('HomeStack', {screen: 'Home'});
    };
    const programItems = myEnrollments.filter(
      item => item.program.type === 'program',
    );
    const courseItems = myEnrollments.filter(
      item => item.program.type === 'course',
    );
    const otherItems = myEnrollments.filter(
      item => item.program.type !== 'course' && item.program.type !== 'program',
    );
    const allItems =
      selectedItems === 'all'
        ? myEnrollments
        : selectedItems === 'program'
        ? programItems
        : selectedItems === 'course'
        ? courseItems
        : selectedItems === 'other'
        ? otherItems
        : myEnrollments;
    const {top, bottom} = useSafeAreaInsets();
    return (
      <Modal
        backdropColor={Colors.BackDropColor}
        style={styles.modal}
        isVisible={modalOpen}
        statusBarTranslucent={true}>
        <View
          style={[
            styles.container,
            {paddingTop: top, paddingBottom: bottom / 2},
          ]}>
          <View style={styles.popupTopContainer}>
            <MaterialIcon
              onPress={onCancelPress}
              name="arrow-back"
              size={30}
              color={Colors.BodyText}
            />
            <TouchableOpacity
              onPress={onCancelPress}
              style={styles.popupArrowContainer}>
              <Text style={styles.popupTitle}>Select Program</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={onCancelPress}
              activeOpacity={0.9}
              style={styles.popupCrossContainer}>
              <CrossIcon color={Colors.BodyText} />
            </TouchableOpacity> */}
          </View>
          <View style={styles.popupLine} />
          {myEnrollments.length > 0 && (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                disabled={selectedItems === 'all'}
                onPress={() => {
                  selectedItems !== 'all' && setSelectedItems('all');
                }}
                style={[
                  styles.tabItemContainer,
                  selectedItems === 'all' && {backgroundColor: Colors.Primary},
                ]}>
                <Text
                  style={[
                    styles.tabItemText,
                    selectedItems === 'all' && {
                      color: Colors.PrimaryButtonTextColor,
                    },
                  ]}>
                  All ({myEnrollments?.length || 0})
                </Text>
              </TouchableOpacity>
              {programItems.length > 0 && (
                <TouchableOpacity
                  disabled={selectedItems === 'program'}
                  onPress={() => {
                    selectedItems !== 'program' && setSelectedItems('program');
                  }}
                  style={[
                    styles.tabItemContainer,
                    selectedItems === 'program' && {
                      backgroundColor: Colors.Primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tabItemText,
                      selectedItems === 'program' && {
                        color: Colors.PrimaryButtonTextColor,
                      },
                    ]}>
                    Programs ({programItems?.length || 0})
                  </Text>
                </TouchableOpacity>
              )}
              {courseItems?.length > 0 && (
                <TouchableOpacity
                  disabled={selectedItems === 'course'}
                  onPress={() => {
                    selectedItems !== 'course' && setSelectedItems('course');
                  }}
                  style={[
                    styles.tabItemContainer,
                    selectedItems === 'course' && {
                      backgroundColor: Colors.Primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tabItemText,
                      selectedItems === 'course' && {
                        color: Colors.PrimaryButtonTextColor,
                      },
                    ]}>
                    Courses ({courseItems?.length || 0})
                  </Text>
                </TouchableOpacity>
              )}
              {otherItems.length > 0 && (
                <TouchableOpacity
                  disabled={selectedItems === 'other'}
                  onPress={() => {
                    selectedItems !== 'other' && setSelectedItems('other');
                  }}
                  style={[
                    styles.tabItemContainer,
                    selectedItems === 'other' && {
                      backgroundColor: Colors.Primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tabItemText,
                      selectedItems === 'other' && {
                        color: Colors.PrimaryButtonTextColor,
                      },
                    ]}>
                    Others ({otherItems?.length || 0})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <ScrollView
            contentContainerStyle={{gap: gGap(10)}}
            showsVerticalScrollIndicator={false}>
            {allItems?.length ? (
              allItems?.map((item, index: number) => (
                <PopupProgramItem
                  active={enrollment as IEnrollment}
                  key={index}
                  enrollment={item as IEnrollment} // Cast if you’re sure of the shape
                  handleSwitch={handleSwitch}
                />
              ))
            ) : (
              <View
                style={{
                  flex: 1,
                  // backgroundColor: Colors.Red,
                  justifyContent: 'center',
                  height: responsiveScreenHeight(60),
                }}>
                <Text style={styles.headingText}>
                  Enrollment is not available
                </Text>
                <Text style={styles.bodyText}>
                  Sorry, You have not enrolled at any Bootcamp yet. Please
                  explore your Institutes website to enroll your preferred
                  bootcamp!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  },
);

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      flex: 1,
    },
    tabItemContainer: {
      flex: 1,
      alignItems: 'center',
      height: gGap(30),
      justifyContent: 'center',
      marginHorizontal: gGap(5),
      borderRadius: borderRadius.default,
    },
    tabItemText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.body,
    },
    tabContainer: {
      backgroundColor: Colors.Foreground,
      height: gGap(40),
      marginBottom: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.default,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: gGap(10),
    },
    headingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.8),
      color: Colors.Heading,
      textAlign: 'center',
    },
    bodyText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
      textAlign: 'center',
      marginHorizontal: responsiveScreenWidth(4),
      lineHeight: responsiveScreenHeight(3),
    },
    modal: {
      margin: 0,
      justifyContent: 'flex-start',
    },
    popupContainer: {},
    popupTopContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: gGap(10),
    },
    popupArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    popupTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HS,
      marginLeft: responsiveScreenWidth(2),
      color: Colors.BodyText,
    },
    popupCrossContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupLine: {
      width: responsiveScreenWidth(100),
      height: 2,
      backgroundColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(1),
      alignSelf: 'center',
    },
  });

export default ProgramSwitchModal;
