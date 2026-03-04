import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Popover, {Rect} from 'react-native-popover-view';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import {FeatherIcon, MaterialIcon} from '../../constants/Icons';
import {fontSizes, gGap} from '../../constants/Sizes';
import {TColors} from '../../types';
import {selectNote} from '../../store/reducer/notesReducer';
import CustomFonts from '../../constants/CustomFonts';
import Divider from '../SharedComponent/Divider';
import ConfirmationModal from '../SharedComponent/ConfirmationModal';

const NotesPopup = ({
  onDeletePress,
  onNoteUpdatePress,
}: {
  onDeletePress: () => void;
  onNoteUpdatePress: () => void;
}) => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {selectedNote} = useSelector((state: RootState) => state.notes);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <Popover
      from={new Rect(selectedNote?.x ?? 333, selectedNote?.y ?? 0, 0, 0)}
      onRequestClose={() => {
        dispatch(selectNote({...selectedNote, x: null, y: null}));
      }}
      popoverStyle={styles.popoverStyle}
      isVisible={Boolean(selectedNote?._id && selectedNote?.y)}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            onNoteUpdatePress();
            dispatch(selectNote({...selectedNote, x: null, y: null}));
          }}>
          <FeatherIcon
            style={{paddingLeft: gGap(3), paddingRight: gGap(2)}}
            name="edit"
            size={18}
            color={Colors.BodyText}
          />
          <Text style={styles.itemText}>Update note</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            setDeleteModalVisible(!deleteModalVisible);
          }}>
          <MaterialIcon name="delete" size={25} color={Colors.BodyText} />
          <Text style={styles.itemText}>Delete note</Text>
        </TouchableOpacity>
      </View>
      <ConfirmationModal
        title="Delete note!"
        description="Do you want to delete this note permanently?"
        isVisible={deleteModalVisible}
        cancelPress={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
        okPress={onDeletePress}
      />
    </Popover>
  );
};

export default NotesPopup;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    popoverStyle: {
      backgroundColor: Colors.Background_color,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
      // backgroundColor: 'red',
      paddingHorizontal: gGap(8),
      paddingVertical: gGap(8),
    },
    itemText: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
      fontFamily: CustomFonts.MEDIUM,
    },
    container: {
      backgroundColor: Colors.Background_color,
      minWidth: gGap(200),
    },
  });
