import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import PostHeader from './PostHeader';
import CustomFonts from '../../constants/CustomFonts';
import TopContributorSlider from './TopContributorSlider';
import PostFooterSection from './PostFooterSection';
import ViewPostImage from './ViewPostImage';
import {RegularFonts} from '../../constants/Fonts';
import {IPost} from '../../types/community/community';
import {TColors} from '../../types';
import GlobalSeeMoreButton from '../SharedComponent/GlobalSeeMoreButton';
import {fontSizes, gFontSize} from '../../constants/Sizes';
import TextRender from '../SharedComponent/TextRender';
// import TextRender from '../SharedComponent/TextRender';
type CommunityPostProps = {
  post: IPost;
  index: number;
  handleTopContributor: (id: string) => void;
  handleTagSearch: (tag: string) => void;
};

const CommunityPost = memo(
  ({
    post,
    index,
    handleTopContributor,
    handleTagSearch,
  }: CommunityPostProps) => {
    const Colors = useTheme();
    const styles = getStyles(Colors);
    const [isExpanded, setIsExpanded] = useState(false); // State for toggling expanded text

    // const toggleCommentSection = () => {
    //   setShowComments(!showComments);
    //   getComments(post?._id);
    // };

    const postText = post?.description || '';
    const isTextLong = postText.length > 400;
    const displayText = isExpanded ? postText : `${postText.slice(0, 400)}...`;

    const handleSeeMoreToggle = () => {
      setIsExpanded(true);
    };

    return (
      <>
        {(index === 1 ||
          index === 5 ||
          index === 10 ||
          index === 15 ||
          index === 20) && (
          <View style={styles.TopContributorsContainer}>
            <Text style={styles.postTitle}>Top Contributors</Text>
            <TopContributorSlider handleTopContributor={handleTopContributor} />
          </View>
        )}
        <View style={styles.postContainer}>
          <PostHeader post={post} />
          <Text style={styles.postTitle}>{post?.title}</Text>
          {post?.tags?.length > 0 && (
            <View style={styles.tagContainer}>
              {post?.tags.map((tag, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleTagSearch(tag)}>
                  <Text style={styles.tag}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {post?.attachments?.length > 0 && <ViewPostImage post={post} />}
          {/* <Markdown style={styles.markdown as MarkdownStylesProps}>
            {autoLinkify(displayText?.trim())}
          </Markdown> */}

          <TextRender text={displayText} />
          {/* <TextRender/> */}
          {isTextLong && !isExpanded && (
            // <TouchableOpacity
            //   style={styles.seeMoreContainer}
            //   onPress={handleSeeMoreToggle}>
            //   <Text style={styles.seeMoreText}>See More</Text>
            // </TouchableOpacity>
            <GlobalSeeMoreButton
              onPress={handleSeeMoreToggle}
              buttonStatus={isExpanded}
            />
          )}
          <PostFooterSection post={post} />
        </View>
      </>
    );
  },
);

export default CommunityPost;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    TopContributorsContainer: {
      gap: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
      marginHorizontal: responsiveScreenWidth(4),
    },
    postContainer: {
      backgroundColor: Colors.Foreground,
      marginBottom: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      // paddingVertical: responsiveScreenHeight(2),
      paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(0.5),
      zIndex: -1,
      position: 'relative',
      // gap: 10,
      overflow: 'hidden',
    },
    postTitle: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: fontSizes.largeTitle,
      color: Colors.Heading,
      marginVertical: 5,
    },
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      flexWrap: 'wrap',
    },
    tag: {
      color: Colors.Primary,
    },
    seeMoreContainer: {
      justifyContent: 'center',
      // alignItems: 'flex-end',
      height: 40,
      // backgroundColor: 'blue',
      paddingHorizontal: 20,
    },
    seeMoreText: {
      // textAlign: "right",
      color: Colors.Red,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(2),
      // marginTop8 responsiveScreenHeight(1),
    },
    markdown: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        color: Colors.BodyText,
        lineHeight: gFontSize(25),
      },
      paragraph: {
        marginTop: 0, // Remove top margin from paragraphs
        marginBottom: 0, // Remove bottom margin from paragraphs
        padding: 0, // Remove padding from paragraphs
      },
      link: {
        color: Colors.Primary,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: fontSizes.body,
      },
      heading1: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading2: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading3: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading4: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading5: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading6: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      strong: {
        fontFamily: CustomFonts.LATO_BOLD,
        fontSize: fontSizes.body,
        fontWeight: '500',
      },
      em: {
        fontFamily: CustomFonts.REGULAR,
        fontStyle: 'italic',
        fontSize: fontSizes.body,
        fontWeight: '500',
      },
      code_inline: {
        backgroundColor: Colors.PrimaryOpacityColor,
      },
      fence: {
        marginBottom: 10,
        padding: 8,
        borderRadius: 6,
        backgroundColor: Colors.Foreground,
        borderWidth: 1,
        borderColor: Colors.BorderColor,
      },
      code_block: {
        borderWidth: 0,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BS,
      },
      blockquote: {
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
      },
    } as any,
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        backgroundColor: 'red',
      },
      heading1: {
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
      },
      blockquote: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    } as any,
  });
