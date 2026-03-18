import {StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import Markdown from 'react-native-markdown-display';
import CustomFonts from '../../constants/CustomFonts';
import {fontSizes, gFontSize, gGap} from '../../constants/Sizes';
import {TColors} from '../../types';
import LexicalTextRenderer from './LexicalTextRenderer';
import QuillRenderer from './QuillRenderer';
import {
  autoLinkify,
  convertToCorrectMarkdown,
  removeHtmlTags,
  transFormDate,
} from '../ChatCom/MessageHelper';
import {RegularFonts} from '../../constants/Fonts';

// function isMarkdown(t: string) {
//   const markdownRegex =
//     /(^#{1,6}\s)|(\*\*.*\*\*)|(_.*_)|(\[.*\]\(.*\))|(```[\s\S]*?```)|(`[^`]+`)|(^> )|(!\[.*\]\(.*\))|(- |\* |\d+\. )/m;
//   return markdownRegex.test(t);
// }

const TextRender = ({text}: {text: string}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  if (!text) {
    return null;
  }
  console.log('text', JSON.stringify(text, null, 2));
  try {
    const obj = JSON.parse(text);
    if (typeof obj === 'object' && obj !== null) {
      if (obj.ops && Array.isArray(obj.ops)) {
        return <QuillRenderer delta={obj} style={{backgroundColor: '#fff'}} />;
      }

      return <LexicalTextRenderer content={obj} style={{}} />;
    } else {
      if (!text) {
        return;
      }
      return (
        <Markdown style={styles.markdown}>
          {autoLinkify(
            transFormDate(removeHtmlTags(convertToCorrectMarkdown(text || ''))),
          )}
        </Markdown>
      );
    }
  } catch (error) {
    console.log('Text Renderer', JSON.stringify(error, null, 2));
    if (!text) {
      return;
    }
    return (
      <Markdown style={styles.markdown}>
        {autoLinkify(
          transFormDate(removeHtmlTags(convertToCorrectMarkdown(text || ''))),
        )}
      </Markdown>
    );
  }
};

export default TextRender;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    markdown: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: fontSizes.body,
        color: Colors.BodyText,
        lineHeight: gFontSize(22),
      },
      paragraph: {
        marginTop: gGap(2), // Remove top margin from paragraphs
        marginBottom: gGap(2), // Remove bottom margin from paragraphs
        // padding: 0, // Remove padding from paragraphs
      },
      link: {
        color: Colors.Primary,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: RegularFonts.BR,
      },
      heading1: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading2: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading3: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading4: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading5: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading6: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BR,
        marginVertical: 4,
        fontWeight: '500',
      },
      strong: {
        fontFamily: CustomFonts.LATO_BOLD,
        fontSize: RegularFonts.BR,
        fontWeight: '500',
      },
      em: {
        fontFamily: CustomFonts.LATO_REGULAR,
        fontStyle: 'italic',
        fontSize: RegularFonts.BR,
        fontWeight: '500',
        backgroundColor: Colors.PrimaryOpacityColor,
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
        fontFamily: CustomFonts.LATO_REGULAR,
        fontSize: RegularFonts.BS,
      },
      blockquote: {
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
        backgroundColor: Colors.Background_color,
      },
      td: {
        borderColor: Colors.Red,
      },
      th: {
        borderColor: Colors.Red,
      },
      table: {
        borderColor: Colors.LineColor,
      },
      tr: {
        borderColor: Colors.LineColor,
      },
      span: {
        borderColor: Colors.BorderColor,
      },
      rules: {
        borderColor: Colors.BorderColor,
      },
      hr: {backgroundColor: Colors.LineColor},
    } as any,
  });
