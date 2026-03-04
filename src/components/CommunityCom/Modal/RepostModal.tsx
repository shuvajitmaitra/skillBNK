import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {RootState} from '../../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {TColors} from '../../../types';
import {useTheme} from '../../../context/ThemeContext';
import {setRepostInfo} from '../../../store/reducer/communityReducer';
import {borderRadius, fontSizes, gGap} from '../../../constants/Sizes';
import Images from '../../../constants/Images';
import CustomFonts from '../../../constants/CustomFonts';
import TextRender from '../../SharedComponent/TextRender';
import {truncateMarkdown} from '../../../utility/markdownUtils';
import {TextInput} from 'react-native';
import axiosInstance from '../../../utility/axiosInstance';
import {loadComPostNewly, theme} from '../../../utility/commonFunction';
import {showToast} from '../../HelperFunction';

const RepostModal = () => {
  const {repostInfo} = useSelector((state: RootState) => state.community);

  const Colors = useTheme();
  const dispatch = useDispatch();
  const styles = getStyles(Colors);
  if (!repostInfo) {
    return;
  }
  const handleRepost = async () => {
    try {
      const response = await axiosInstance.post(
        '/content/community/post/create',
        {
          title: repostInfo?.title,
          description: `${
            repostInfo?.comment ? repostInfo.comment : ''
          }\n\n REPOSTED FROM @${repostInfo?.createdBy.fullName} \n\n${
            repostInfo?.description
          }`,
          originalPostId: repostInfo?._id,
          tags: [],
          attachments: repostInfo?.attachments,
        },
      );
      if (response?.data?.success) {
        dispatch(setRepostInfo(null));

        loadComPostNewly();
      }
    } catch (error: any) {
      console.log(
        'Error to create post',
        JSON.stringify(error.response.data.error, null, 2),
      );
      showToast({message: error.response.data.error || 'Can not post'});
    }
  };
  return (
    <ReactNativeModal
      onBackdropPress={() => {
        dispatch(setRepostInfo(null));
      }}
      backdropOpacity={0.5}
      style={{margin: 0, justifyContent: 'flex-end'}}
      isVisible={repostInfo?.repostModalVisible}
      avoidKeyboard={true}>
      <View style={[styles.container]}>
        <View
          style={[
            styles.postHeaderCon,
            {justifyContent: 'space-between', marginTop: 0},
          ]}>
          <Text style={styles.headingText}>Repost</Text>
          <TouchableOpacity
            onPress={() => {
              handleRepost();
            }}
            style={styles.repostButtonCon}>
            <Text style={styles.repostBtnText}>Repost</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postHeaderCon}>
          <Image
            source={
              repostInfo?.createdBy.profilePicture
                ? {uri: repostInfo?.createdBy.profilePicture}
                : Images.DEFAULT_IMAGE
            }
            height={gGap(30)}
            width={gGap(30)}
            style={{
              borderRadius: borderRadius.circle,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
              height: gGap(30),
              width: gGap(30),
            }}
          />
          <Text style={styles.senderNameText}>
            {repostInfo?.createdBy?.fullName}
          </Text>
        </View>
        <Text style={[styles.senderNameText, {marginTop: gGap(5)}]}>
          {repostInfo?.title || ''}
        </Text>
        <ScrollView>
          {repostInfo?.description && (
            <TextRender
              text={truncateMarkdown(repostInfo?.description, 100) || ''}
            />
          )}
        </ScrollView>
        <Text style={styles.inputLabel}>Add your comment (optional)</Text>
        <TextInput
          keyboardAppearance={theme()}
          placeholder="Write your comment..."
          placeholderTextColor={Colors.BodyText}
          value={repostInfo?.comment || ''}
          onChangeText={t => {
            dispatch(setRepostInfo({comment: t}));
          }}
          style={styles.input}
          multiline={true}
        />
      </View>
    </ReactNativeModal>
  );
};

export default RepostModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    repostButtonCon: {
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
      paddingVertical: gGap(3),
      paddingHorizontal: gGap(10),
      borderRadius: borderRadius.small,
    },
    repostBtnText: {
      color: Colors.PrimaryButtonTextColor,
    },
    inputLabel: {
      color: Colors.Heading,
      fontSize: fontSizes.body,
      fontWeight: '500',
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: gGap(10),
      marginBottom: gGap(5),
    },
    input: {
      maxHeight: gGap(150),
      padding: gGap(10),
      borderWidth: 1,
      borderRadius: borderRadius.default,
      borderColor: Colors.BorderColor,
      minHeight: gGap(100),
      textAlignVertical: 'top',
      color: Colors.BodyText,
    },
    container: {
      backgroundColor: Colors.Background_color,
      padding: gGap(16),
      borderTopRightRadius: gGap(16),
      borderTopLeftRadius: gGap(16),
      maxHeight: gGap(450),
    },
    headingText: {
      color: Colors.Heading,
      fontSize: fontSizes.heading,
      fontWeight: '600',
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    postHeaderCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
      marginTop: gGap(10),
    },
    senderNameText: {
      color: Colors.Heading,
      fontSize: fontSizes.heading,
      fontWeight: '600',
      // fontFamily: CustomFonts.SEMI_BOLD,
    },
  });
