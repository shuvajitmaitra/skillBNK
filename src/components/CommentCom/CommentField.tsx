import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {fontSizes} from '../../constants/Sizes';
import {TColors} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';

// Define types for the user state
interface User {
  profilePicture?: string;
  fullName?: string;
}

// Define type for the Redux state
interface RootState {
  auth: {
    user: User;
  };
}

// Define props interface
interface CommentFieldProps {
  postId: string;
  disable?: boolean;
  onPress?: () => void;
}

const CommentField: React.FC<CommentFieldProps> = ({
  postId,
  disable = false,
  onPress,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);

  const openCommentModal = () => {
    navigation.navigate('CommentScreen', {contentId: postId});
  };

  return (
    <View>
      <Text style={styles.comments}>Comments</Text>
      <View style={styles.writeComment}>
        <Image
          source={
            user.profilePicture
              ? {
                  uri: `${user.profilePicture}`,
                }
              : Images.DEFAULT_IMAGE
          }
          style={styles.profileImg}
        />
        <Pressable
          style={styles.inputText}
          disabled={disable}
          onPress={() => {
            onPress ? onPress() : openCommentModal();
          }}>
          <Text
            style={{
              fontFamily: CustomFonts.REGULAR,
              fontSize: fontSizes.body,
              color: Colors.BodyText,
            }}>
            {user?.fullName ? `Comment as ${user?.fullName}` : 'Comment...'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CommentField;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    writeComment: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
      marginTop: responsiveScreenHeight(2),
    },
    profileImg: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      objectFit: 'cover',
      borderRadius: 50,
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: Colors.BorderColor,
      minHeight: responsiveScreenHeight(6),
      borderRadius: 12,
      paddingVertical: responsiveScreenHeight(1),
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  });
