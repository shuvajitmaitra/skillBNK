import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {fontSizes, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';
import RNModal from '../SharedComponent/RNModal';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

const AddNoteModal = ({
  isVisible,
  onClose,
  handleAddNote,
}: {
  isVisible: boolean;
  onClose: () => void;
  handleAddNote: () => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <RNModal isVisible={isVisible} modalType="fullScreen">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Interview Notes</Text>
        </View>
        <View style={{flex: 1}}>
          <ScrollView>
            <TouchableOpacity
              onPress={() => {
                handleAddNote();
              }}>
              <Text>Add Note</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};
export default AddNoteModal;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {backgroundColor: Colors.Background_color, flex: 1},
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
      marginBottom: gGap(10),
    },
    headerTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.heading,
      color: Colors.Heading,
    },
  });
