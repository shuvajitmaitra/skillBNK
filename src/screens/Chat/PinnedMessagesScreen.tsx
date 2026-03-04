import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import CustomModal from '../../components/SharedComponent/CustomModal';
import Message from '../../components/ChatCom/Message';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';
import {IMessage} from '../../types/chat/messageTypes';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch} from 'react-redux';
// import {setSingleChat} from '../../store/reducer/chatReducer';
import ImageView from 'react-native-image-viewing';
import MessageOptionModal from '../../components/ChatCom/Modal/MessageOptionModal';

const PinnedMessagesScreen = ({
  pinned,
  setPinnedScreenVisible,
  messageOptionData,
  handlePin,
}: {
  pinned: IMessage[];
  setPinnedScreenVisible: () => void;
  messageOptionData: IMessage;
  handlePin: (id: string) => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  // const dispatch = useDispatch();
  // const navigation = useNavigation();
  const [viewImage, setViewImage] = useState<{uri: string; index: number}[]>(
    [],
  );

  const renderItem = ({item}: {item: IMessage}) => {
    return (
      <Message item={{...item, isSameDate: true}} setViewImage={setViewImage} />
    );
  };

  return (
    <CustomModal parentStyle={{zIndex: 1}} customStyles={styles.customStyles}>
      <View style={styles.pinHeaderContainer}>
        <TouchableOpacity
          onPress={() => {
            // dispatch(setSingleChat(null));
            // navigation.goBack();
            setPinnedScreenVisible();
          }}
          style={styles.backButtonContainer}>
          <ArrowLeft />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pinned Messages</Text>
      </View>
      <FlatList
        data={pinned || []}
        renderItem={renderItem}
        keyExtractor={() => Math.random().toString()}
        inverted={true}
      />
      <TouchableOpacity
        onPress={() => setPinnedScreenVisible()}
        style={styles.exitButton}>
        <Text style={styles.exitText}>Exit from pin</Text>
      </TouchableOpacity>
      {viewImage.length > 0 && (
        <ImageView
          images={viewImage}
          imageIndex={viewImage[0]?.index}
          visible={viewImage?.length !== 0}
          onRequestClose={() => setViewImage([])}
        />
      )}
      {messageOptionData?._id && (
        <MessageOptionModal
          handlePin={handlePin}
          setMessageEditVisible={() => {}}
          messageOptionData={messageOptionData}
        />
      )}
    </CustomModal>
  );
};

export default PinnedMessagesScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    headerText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.4),
      fontWeight: 'bold',
    },
    pinHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonContainer: {
      // backgroundColor: Colors.ForegroundOpacityColor,
      padding: 7,
      // borderRadius: 1000,
      // borderWidth: 1,
      // overflow: 'hidden',
      // borderColor: Colors.BorderColor,
    },
    exitButton: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: 'center',
      borderColor: Colors.BorderColor,
      borderWidth: 1,
    },
    exitText: {
      color: Colors.SecondaryButtonTextColor,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    customStyles: {
      flex: 1,
      width: '100%',
      zIndex: 2,
      backgroundColor: Colors.Foreground,
      paddingHorizontal: 0,
    },
  });
