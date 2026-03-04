import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import CustomFonts from '../../constants/CustomFonts';
import {TColors} from '../../types';
import {RootStackParamList} from '../../types/navigation';
import {IMessage} from '../../types/chat/messageTypes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import EmojiContainer from './EmojiContainer';
import {RootState} from '../../types/redux/root';
import {useSelector} from 'react-redux';

type MessageBottomContainerProps = {
  item: IMessage;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const MessageBottomContainer = ({
  item,
  navigation,
}: MessageBottomContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {singleChat} = useSelector((state: RootState) => state.chat);

  return (
    <View
      style={[
        styles.messageBottomContainer,
        item.replyCount === 0 &&
          item?.text?.length < 300 && {justifyContent: 'flex-end'},
      ]}>
      {!singleChat?.isReadOnly && item?.replyCount! > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ThreadScreen', {
              parentMessage: item?._id,
              chat: item?.chat,
            })
          }
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
          }}>
          <Text style={styles.replyCountText}>{`${item.replyCount} ${
            item?.replyCount === 1 ? 'reply' : 'replies'
          }`}</Text>
        </TouchableOpacity>
      )}
      {
        <EmojiContainer
          messageData={item}
          reacts={Object.entries(item?.reactions || {}).map(
            ([symbol, count]) => ({
              symbol,
              count: Number(count),
            }),
          )}
          messageId={item._id}
          myReactions={item?.myReaction}
        />
      }
    </View>
  );
};

export default MessageBottomContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    readMoreText: {
      color: Colors.ThemeAnotherButtonColor,
      fontSize: RegularFonts.BR,
      height: 20,
      fontFamily: CustomFonts.MEDIUM,
    },
    iconStyle: {
      alignSelf: 'flex-start',
    },
    editedText: {
      color: Colors.Red,
      // textAlignVertical: 'bottom',
    },
    replyCountText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BS,
      color: Colors.Red,
    },
    messageBottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingLeft: 45,
    },
    timeText: {
      color: Colors.BodyText,
      alignSelf: 'flex-end',
      marginRight: 5,
    },
  });
