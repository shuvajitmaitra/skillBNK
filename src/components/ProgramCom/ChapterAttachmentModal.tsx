import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import ReactNativeModal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {gGap} from '../../constants/Sizes';
import ScreenHeader from '../SharedComponent/ScreenHeader';
import {setSelectedLesson} from '../../store/reducer/programReducer';
import ProgramAttachmentsContainer from './ProgramAttachmentsContainer';

const ChapterAttachmentModal = () => {
  const {selectedLesson} = useSelector((state: RootState) => state.program);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top, bottom} = useSafeAreaInsets();
  return (
    <ReactNativeModal
      isVisible={Boolean(selectedLesson?.chapterAttachmentModalVisible)}
      style={{
        margin: 0,
        paddingTop: top,
        paddingBottom: bottom,
        backgroundColor: Colors.Background_color,
      }}>
      <View style={styles.container}>
        <ScreenHeader
          onPress={() => {
            const pre = {...selectedLesson};
            dispatch(
              setSelectedLesson({
                ...pre,
                chapterAttachmentModalVisible: false,
              }),
            );
          }}
        />
        {selectedLesson?.attachments?.length > 0 && (
          <ProgramAttachmentsContainer
            files={selectedLesson.attachments}
            setViewImage={() => {}}
          />
        )}
      </View>
    </ReactNativeModal>
  );
};

export default ChapterAttachmentModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: gGap(16),
    },
  });
