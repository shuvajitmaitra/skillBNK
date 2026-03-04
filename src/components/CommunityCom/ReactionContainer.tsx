import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import Popover from 'react-native-popover-view'; // Change to react-native-popover-view
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {giveReaction} from '../../actions/chat-noti';
import {useTheme} from '../../context/ThemeContext';
import {Placement, Rect} from 'react-native-popover-view/dist/Types';
import {TColors} from '../../types';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedPost} from '../../store/reducer/communityReducer';
import {RootState} from '../../types/redux/root';

// interface ReactionContainerProps {
//   touchPosition: {x: number; y: number};
//   setTouchPosition: () => void;
//   postId: string;
//   myReaction: string;
// }

const ReactionContainer = () => {
  let emojis = ['👍', '😍', '❤️', '😂', '🥰', '😯'];
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {selectedPost} = useSelector((s: RootState) => s.community);
  // console.log('selectedPost', JSON.stringify(selectedPost, null, 2));
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSelectedPost(null));
    };
  }, [dispatch]);

  return (
    <Popover
      placement={Placement.TOP}
      arrowSize={{width: 0, height: 0}}
      from={new Rect(selectedPost?.x ?? 0, selectedPost?.y ?? 0, 0, 0)}
      isVisible={Boolean(selectedPost)}
      popoverStyle={styles.content}
      onRequestClose={() => dispatch(setSelectedPost(null))}>
      <View style={styles.container}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            onPress={() => {
              giveReaction(selectedPost?._id, {symbol: emoji}, {popup: true});
              dispatch(setSelectedPost(null));
            }}
            style={[
              styles.emojiContainer,
              emoji === selectedPost?.myReaction && styles.myReactionStyle,
            ]}
            key={index}>
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Popover>
  );
};

export default ReactionContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    myReactionStyle: {
      backgroundColor: Colors.CyanOpacity,
      borderRadius: 100,
    },
    container: {
      backgroundColor: Colors.Foreground,
      flexDirection: 'row',
      // width: responsiveScreenWidth(80),
      justifyContent: 'center',
      borderRadius: 100,
      // gap: 10,
    },
    emoji: {
      fontSize: responsiveScreenFontSize(4),
    },
    arrow: {borderTopColor: Colors.PureGray},
    emojiContainer: {
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenWidth(1.5),
    },
    content: {
      backgroundColor: 'transparent',
    },
  });
