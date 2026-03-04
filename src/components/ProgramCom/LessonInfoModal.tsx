import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderRadius, fontSizes, gGap, gHeight} from '../../constants/Sizes';
import {
  LessonData,
  setSelectedLesson,
} from '../../store/reducer/programReducer';
import TextRender from '../SharedComponent/TextRender';
import {MaterialIcon} from '../../constants/Icons';
import RNText from '../SharedComponent/RNText';

function getOrderedKeys(obj: LessonData): string[] {
  const desiredOrder = [
    'transcription',
    'summary',
    'behavioral',
    'interview',
    'implementation',
  ];

  // Get keys from desired order that exist and have non-empty values
  const orderedKeys = desiredOrder.filter(
    key => obj[key] && obj[key].trim() !== '',
  );

  // Get additional keys not in desired order that have non-empty values
  const additionalKeys = Object.keys(obj).filter(
    key => !desiredOrder.includes(key) && obj[key] && obj[key].trim() !== '',
  );

  // Combine ordered keys with additional keys
  return [...orderedKeys, ...additionalKeys];
}

const LessonInfoModal = () => {
  const {selectedLesson} = useSelector((state: RootState) => state.program);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top, bottom} = useSafeAreaInsets();

  return (
    <ReactNativeModal
      style={[
        styles.modal,
        {
          paddingTop: top,
          paddingBottom: bottom / 2,
        },
      ]}
      isVisible={Boolean(selectedLesson?.lessonInfoModalVisible)}>
      <View style={styles.headerContainer}>
        <View style={styles.tabContainer}>
          <ScrollView horizontal={true}>
            {selectedLesson?.lesson?.data &&
              getOrderedKeys(selectedLesson.lesson.data).map(i => (
                <TouchableOpacity
                  onPress={() => {
                    const pre = {...selectedLesson};
                    dispatch(
                      setSelectedLesson({
                        ...pre,
                        activeTab: i,
                      }),
                    );
                  }}
                  style={[
                    styles.tabButton,
                    i === selectedLesson.activeTab && styles.activeTabButton,
                  ]}
                  key={i}>
                  <RNText
                    style={[
                      styles.tabText,
                      i === selectedLesson.activeTab && styles.activeTabText,
                    ]}>
                    {i}
                  </RNText>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => {
            const pre = {...selectedLesson};
            dispatch(
              setSelectedLesson({
                ...pre,
                activeTab: '',
                lessonInfoModalVisible: false,
              }),
            );
          }}
          style={styles.closeButton}>
          <MaterialIcon name="cancel" size={30} color={Colors.BodyText} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          {selectedLesson?.activeTab && (
            <TextRender
              text={
                selectedLesson?.lesson.data[selectedLesson?.activeTab] || ''
              }
            />
          )}
        </View>
      </ScrollView>
    </ReactNativeModal>
  );
};

export default LessonInfoModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-start',
      backgroundColor: Colors.Background_color,

      paddingHorizontal: gGap(16),
    },
    headerContainer: {
      flexDirection: 'row',
      width: '100%',
      // backgroundColor: 'red',
      marginBottom: gGap(10),
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.Foreground,
      height: gHeight(40),
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderRadius: borderRadius.circle,
      flex: 0.9,
      overflow: 'hidden',
    },
    tabButton: {
      height: gHeight(40),
      justifyContent: 'center',
      borderRadius: borderRadius.circle,
      paddingHorizontal: gGap(10),
    },
    activeTabButton: {
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
    },
    tabText: {
      color: Colors.Heading,
      fontSize: fontSizes.small,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    activeTabText: {
      color: Colors.PrimaryButtonTextColor,
    },
    closeButton: {
      flex: 0.1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
