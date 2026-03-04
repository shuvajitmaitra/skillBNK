import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {RegularFonts} from '../../constants/Fonts';
import {onEmojiClick} from '../../actions/apiCall';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {TColors} from '../../types';

type EmojiContainerProps = {
  reacts: {count: number; symbol: string}[];
  messageId: string;
  myReactions: string;
  messageData: any;
};

const EmojiContainer = ({
  reacts,
  messageId,
  myReactions,
  messageData,
}: EmojiContainerProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const renderItem = ({item}: {item: {count: number; symbol: string}}) => {
    return (
      <TouchableOpacity
        onPress={() => onEmojiClick(item.symbol, messageId, messageData)}
        style={[
          styles.emojiContainer,
          myReactions === item.symbol && {
            backgroundColor: Colors.PrimaryOpacityColor,
          },
        ]}>
        <Text style={{fontSize: 12}}>{item?.symbol || '👍'}</Text>
        {item?.count > 1 && <Text style={styles.emojiText}>{item.count}</Text>}
      </TouchableOpacity>
    );
  };
  const renderSeparator = () => {
    return <View style={{width: 10}} />;
  };
  return (
    <FlatList
      data={reacts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal={true}
      ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={styles.container}
    />
  );
};

export default EmojiContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      // gap: 10,
      // backgroundColor: 'skyblue',
      // marginLeft: my ? 40 : 20,
    },
    emojiContainer: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 100,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      justifyContent: 'center',
      // marginVertical: 10,
      minWidth: responsiveScreenWidth(5),
      marginTop: 2,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    emojiText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
  });
