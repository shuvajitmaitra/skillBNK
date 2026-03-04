import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  View,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import Divider from '../../SharedComponent/Divider';
import CustomFonts from '../../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ArchiveIcon from '../../../assets/Icons/ArchiveIcon';
import ReactNativeModal from 'react-native-modal';
import Grabber from '../../SharedComponent/Grabber';
import {TColors} from '../../../types';
import BellOffIcon from '../../../assets/Icons/BellOffIcon';

const MIcon = MaterialIcons as any;

const {height: screenHeight} = Dimensions.get('window');
const FilterOptionModal = ({
  handleRadioChecked,
  isVisible,
  closeModal,
}: {
  handleRadioChecked: (value: string) => void;
  isVisible: boolean;
  closeModal: () => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const data = [
    // {
    //   label: 'New chat',
    //   onPress: () => {
    //     navigation.navigate('CreateNewUser');
    //     closeBottomSheet();
    //   },
    //   icon: <CommentsIcon />,
    // },
    // {
    //   label: 'New crowd',
    //   onPress: () => {
    //     closeBottomSheet();
    //     toggleCreateCrowdModal();
    //   },
    //   icon: <CrowdIcon width={23} height={23} color={Colors.BodyText} />,
    // },
    {
      label: 'Onlines',
      onPress: () => {
        handleRadioChecked('onlines');
        closeModal();
      },
      icon: (
        <MIcon name="online-prediction" size={24} color={Colors.BodyText} />
      ),
    },
    {
      label: 'Favorite chat',
      onPress: () => {
        handleRadioChecked('favorites');
        closeModal();
      },
      icon: <NewPinIcon size={23} />,
    },
    {
      label: 'Muted chat',
      onPress: () => {
        handleRadioChecked('muted');
        closeModal();
      },
      icon: <BellOffIcon size={25} />,
    },
    {
      label: 'Archived chat',
      onPress: () => {
        handleRadioChecked('archived');
        closeModal();
      },
      icon: <ArchiveIcon size={23} />,
    },
  ];

  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      swipeDirection={['down']}
      onSwipeComplete={closeModal}>
      <View style={styles.contentContainer}>
        <Grabber backgroundColor={Colors.BodyText} />
        <Text style={styles.title}>Filter Options</Text>
        <ScrollView>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                onPress={item.onPress}
                style={styles.itemContainer}>
                <Text style={styles.popupContryText}>{item.label}</Text>
                {item.icon}
              </TouchableOpacity>
              {index < data.length - 1 && (
                <Divider
                  style={{borderTopColor: Colors.Gray}}
                  marginTop={0.8}
                  marginBottom={0.8}
                />
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    </ReactNativeModal>
    // <BottomSheetModal
    //   opacity={0.1}
    //   ref={bottomSheetRef}
    //   index={0} // Default snap point index
    //   snapPoints={snapPoints}
    //   enablePanDownToClose={true}
    //   backgroundStyle={{backgroundColor: Colors.Foreground}}
    //   handleIndicatorStyle={{backgroundColor: Colors.Primary}}
    //   animateOnMount={true}
    //   onDismiss={closeBottomSheet}>
    //   {/* Modal Content */}
    //   <BottomSheetView style={styles.contentContainer}>

    //   </BottomSheetView>
    // </BottomSheetModal>
  );
};

export default FilterOptionModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    popupContryText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      marginVertical: 7,
      fontSize: responsiveScreenFontSize(1.9),
    },
    itemContainer: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
    },
    contentContainer: {
      maxHeight: screenHeight * 0.5, // Limit height to half of the screen
      paddingHorizontal: 20,
      backgroundColor: Colors.Foreground,
      padding: 20,
      paddingBottom: 30,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: 10,
    },
  });
