import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../../../ChatCom/Modal/ModalBackAndCrossButton';
import CustomFonts from '../../../../constants/CustomFonts';
import {ScrollView} from 'react-native';
import {useTheme} from '../../../../context/ThemeContext';
import {TColors} from '../../../../types';
import {theme} from '../../../../utility/commonFunction';

export default function ProgramTextDetailsModal({
  setProgramDetailsModalVisible,
  isProgramDetailsModalVisible,
  item,
  dataListArray,
  itemType,
}: {
  setProgramDetailsModalVisible: (prevState: boolean) => void;
  isProgramDetailsModalVisible: boolean;
  item: any;
  dataListArray: string[];
  itemType: string;
}) {
  const [type, setType] = useState(itemType || '');
  const handlePress = (newType: string) => {
    if (isProgramDetailsModalVisible && type !== newType) {
      setType(newType);
    }
  };
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isProgramDetailsModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton
            toggleModal={() => setProgramDetailsModalVisible(false)}
          />
          <ScrollView>
            <View style={styles.modalHeading}>
              {dataListArray.map((itemCat, index: number) => {
                if (!item?.lesson?.data?.[itemCat]) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flex: 1,
                      backgroundColor:
                        itemCat === type ? Colors.Primary : Colors.Foreground,

                      borderRadius: 6,
                      // fontFamily: CustomFonts.REGULAR,
                      // paddingHorizontal: responsiveScreenWidth(5),
                      paddingVertical: responsiveScreenHeight(1),
                      borderWidth: 1,
                      borderColor:
                        itemCat === type ? Colors.Primary : Colors.Primary,
                    }}
                    onPress={() => {
                      handlePress(itemCat);
                    }}
                    disabled={
                      item?.lesson?.data?.[itemCat] === '' ||
                      item?.lesson?.data?.[itemCat] === null
                    }
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.videoTypeTitle,
                        {
                          color:
                            itemCat === type
                              ? Colors.PureWhite
                              : Colors.Primary,
                        },
                      ]}>
                      {itemCat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View>
              <Text style={styles.HeadingText}>{type}</Text>
              {Platform.OS === 'android' ? (
                <Text selectable={true} style={styles.descriptionText}>
                  {item?.lesson?.data[type]?.trim()}
                </Text>
              ) : (
                <TextInput
                  value={item?.lesson?.data[type]?.trim()}
                  multiline
                  editable={false}
                  selectTextOnFocus
                  style={styles.descriptionText}
                  keyboardAppearance={theme()}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    descriptionText: {
      color: Colors.BodyText,
      textAlign: 'justify',
      fontFamily: CustomFonts.REGULAR,
      lineHeight: responsiveScreenHeight(2.5),
    },
    HeadingText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.4),
      textTransform: 'capitalize',
      paddingVertical: responsiveScreenHeight(2),
    },
    videoTypeTitle: {
      flexDirection: 'row',
      color: Colors.PureWhite,
      textTransform: 'capitalize',
      textAlign: 'center',
    },
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalChild: {
      paddingBottom: 10,
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),

      alignItems: 'center',
      paddingVertical: responsiveScreenWidth(4.5),
      maxHeight: responsiveScreenHeight(80),
    },
    modalHeading: {
      alignItems: 'center',
      paddingTop: responsiveScreenHeight(1.7),
      gap: responsiveScreenWidth(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: 'rgba(71, 71, 72, 1)',
    },
    modalHeadingText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: 'rgba(11, 42, 70, 1)',
    },
    headingDescription: {
      color: 'rgba(84, 106, 126, 1)',
      paddingHorizontal: responsiveScreenWidth(10),
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
    },
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingVertical: responsiveScreenHeight(2.5),
    },
  });
