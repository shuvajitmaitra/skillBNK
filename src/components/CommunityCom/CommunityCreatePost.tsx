import React, {useEffect, useState, useRef} from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CreatePostButtonContainer from './CreatePostButtonContainer';
import Feather from 'react-native-vector-icons/Feather';
import {RegularFonts} from '../../constants/Fonts';
import {ICreatePost} from '../../types/community/community';
import {TColors} from '../../types';
// import SaveConfirmationModal from '../SharedComponent/SaveConfirmationModal';
import {borderRadius, fontSizes, gFontSize, gGap} from '../../constants/Sizes';
import {useDispatch, useSelector} from 'react-redux';
import {setCreatePost} from '../../store/reducer/communityReducer';
import {RootState} from '../../types/redux/root';
import {theme} from '../../utility/commonFunction';

const FIcon = Feather as any;
const CommunityCreatePost = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {createPost} = useSelector((state: RootState) => state.community);
  const [post, setPost] = useState<ICreatePost | null>(null);
  const [fullView, setFullView] = useState<boolean>(false);
  // const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);

  const titleInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleStatusSection = () => {
    // if (post) {
    //   return setSaveModalVisible(true);
    // }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFullView(!fullView);

    if (!fullView) {
      setTimeout(() => {
        titleInputRef?.current?.focus();
      }, 300);
    }
  };

  useEffect(() => {
    if (!post && createPost) {
      setPost(createPost);
    }
    dispatch(setCreatePost(post));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  return (
    <View style={styles.createPostContainer}>
      {fullView ? (
        <>
          <Pressable onPress={toggleStatusSection} style={styles.toggleSection}>
            <Text style={styles.title}>Create Post</Text>

            <FIcon
              name="minimize-2"
              size={gFontSize(24)}
              color={Colors.Primary}
            />
          </Pressable>
          <View style={styles.fieldContainer}>
            <TextInput
              ref={titleInputRef} // Attach ref to the title input
              keyboardAppearance={theme()}
              placeholder="Enter post title..."
              multiline
              textAlignVertical="top"
              placeholderTextColor={Colors.BodyText}
              style={[
                styles.input,
                {fontFamily: CustomFonts.REGULAR, paddingTop: 10},
              ]}
              onChangeText={text =>
                setPost(pre => ({...(pre as ICreatePost), title: text}))
              }
              value={(post?.title as string) || ''}
            />
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              keyboardAppearance={theme()}
              placeholder="Write post..."
              placeholderTextColor={Colors.BodyText}
              textAlignVertical="top"
              multiline
              style={[
                styles.input,
                {
                  minHeight: responsiveScreenHeight(15),
                  fontFamily: CustomFonts.REGULAR,
                },
              ]}
              onChangeText={text =>
                setPost(pre => ({...(pre as ICreatePost), description: text}))
              }
              value={post?.description || ''}
            />
          </View>
          <CreatePostButtonContainer post={post} setPost={setPost} />
        </>
      ) : (
        <TouchableOpacity
          onPress={toggleStatusSection}
          style={styles.dummyInput}>
          <Text style={styles.sloganText}>
            {createPost?.title ? createPost?.title : "What's on your mind?"}
          </Text>
        </TouchableOpacity>
      )}
      {/* <SaveConfirmationModal
        isVisible={saveModalVisible}
        tittle="Unsave changes"
        description="You have unsaved changes. Do you want to continue?"
        onExitPress={() => {
          setPost(null);
          setSaveModalVisible(false);
          setFullView(!fullView);
        }}
        onContinuePress={() => {
          setSaveModalVisible(false);
        }}
      /> */}
    </View>
  );
};

export default CommunityCreatePost;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    sloganText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BR,
    },
    toggleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
    },
    dummyInput: {
      height: 50,
      backgroundColor: Colors.Background_color,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 7,
      paddingHorizontal: 15,
      justifyContent: 'center',
    },
    input: {
      backgroundColor: Colors.Background_color,
      minHeight: responsiveScreenHeight(6),
      borderRadius: borderRadius.small,
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingVertical: responsiveScreenHeight(1),
      color: Colors.BodyText,
      fontSize: fontSizes.body,
    },
    createPostContainer: {
      backgroundColor: Colors.Foreground,
      minHeight: 50,
      paddingHorizontal: responsiveScreenWidth(2),
      marginHorizontal: gGap(-10),
      marginBottom: 10,
      overflow: 'hidden',
    },
    title: {
      fontSize: fontSizes.largeTitle,
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    fieldContainer: {
      marginTop: responsiveScreenHeight(1),
      gap: responsiveScreenHeight(1),
    },
  });
