/* eslint-disable no-bitwise */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fontSizes, gBorderRadius, gFontSize, gGap} from '../../constants/Sizes';
import {useTheme} from '../../context/ThemeContext';

const parseInlineStyles = styleString => {
  const styles = {};
  styleString.split(';').forEach(rule => {
    const [key, value] = rule.split(':').map(s => s.trim());
    if (key === 'font-family') styles.fontFamily = value;
    if (key === 'font-size') styles.fontSize = parseInt(value, 10);
    if (key === 'background-color') styles.backgroundColor = value;
  });
  return styles;
};

const CodeBlock = ({children, language}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.codeBlock}>
      <Text style={styles.codeText}>{children}</Text>
      {/* {language && <Text style={styles.codeLanguage}>{language}</Text>} */}
    </View>
  );
};

const LexicalTextRenderer = ({content, style}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const renderTextNode = (node, index) => {
    const textStyles = parseInlineStyles(node.style || '');
    // Ensure text color is applied
    textStyles.color = textStyles.color || Colors.BodyText;

    // Handle format flags
    if (node.format & 1) textStyles.fontWeight = 'bold';
    if (node.format & 2) textStyles.fontStyle = 'italic';
    if (node.format & 4) textStyles.textDecorationLine = 'underline';
    if (node.format & 8) textStyles.textDecorationLine = 'line-through';
    if (node.format & 16) textStyles.fontFamily = 'monospace';

    // Code highlighting
    if (node.type === 'code-highlight') {
      const highlightColors = {
        keyword: '#0000ff',
        punctuation: '#ff0000',
        string: '#a31515',
      };
      textStyles.color = highlightColors[node.highlightType] || Colors.BodyText;
    }

    if (node.type === 'linebreak')
      return <View key={`br-${index}`} style={styles.lineBreak} />;
    if (node.type === 'tab') return <Text key={`tab-${index}`}> </Text>;

    if (node.type === 'text' && node.text === ' ') {
      return null;
    }

    return (
      <Text key={`text-${index}`} style={textStyles}>
        {node.text}
      </Text>
    );
  };

  const renderElementNode = (node, index) => {
    // Allow image nodes or nodes with children
    if (node.type !== 'image' && (!node.children || node.children.length === 0))
      return null;

    switch (node.type) {
      case 'heading': {
        const tag = node.tag || 'h1';
        const level = parseInt(tag.replace('h', ''), 10) || 1;
        return (
          <Text
            key={`heading-${index}`}
            style={[
              styles[`heading${level}`],
              parseInlineStyles(node.children[0].style),
            ]}>
            {node.children.map(renderTextNode)}
          </Text>
        );
      }
      case 'list':
        return (
          <View key={`list-${index}`} style={styles.list}>
            {node.children.map((item, idx) => {
              // Handle listitem nodes
              if (item.type === 'listitem') {
                return (
                  <View key={`li-${idx}`} style={styles.listItem}>
                    {node.listType === 'number' && (
                      <Text style={styles.listMarker}>{idx + 1}.</Text>
                    )}
                    {node.listType === 'bullet' && (
                      <Text style={styles.listMarker}>•</Text>
                    )}
                    {node.listType === 'check' && (
                      <MaterialCommunityIcons
                        name={
                          item.checked
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={20}
                        style={styles.checkbox}
                      />
                    )}
                    <View style={styles.listContent}>
                      {item.children.map((child, childIdx) =>
                        child.type === 'text'
                          ? renderTextNode(child, childIdx)
                          : renderElementNode(child, childIdx),
                      )}
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </View>
        );

      case 'code':
        return (
          <CodeBlock key={`code-${index}`} language={node.language}>
            {node.children.map(renderTextNode)}
          </CodeBlock>
        );

      case 'quote':
        return (
          <View key={`quote-${index}`} style={styles.quote}>
            <Text style={{color: Colors.BodyText}}>
              {node.children.map(renderTextNode)}
            </Text>
          </View>
        );

      case 'link':
        return (
          <TouchableOpacity
            key={`link-${index}`}
            onPress={() => node.url && Linking.openURL(node.url)}>
            <Text style={styles.link}>{node.children.map(renderTextNode)}</Text>
          </TouchableOpacity>
        );

      case 'image':
        return (
          <Image
            key={`image-${index}`}
            source={{uri: node.src}}
            style={{
              width: '100%',
              height: node.height || 300,
              maxWidth: node.maxWidth || '100%',
              resizeMode: 'contain',
              marginVertical: gGap(5),
              borderRadius: gBorderRadius(4),
            }}
            accessibilityLabel={node.altText || 'Image'}
          />
        );

      case 'paragraph':
        return (
          <Text key={`para-${index}`} style={styles.paragraph}>
            {node.children.map((child, idx) =>
              child.type === 'text'
                ? renderTextNode(child, idx)
                : renderElementNode(child, idx),
            )}
          </Text>
        );

      default:
        return null;
    }
  };

  if (!content?.root?.children) return null;

  return (
    <View style={[styles.container, style]}>
      {content.root.children
        .filter(node => node.type === 'image' || node.children)
        .map((node, index) => {
          return renderElementNode(node, index);
        })}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: gGap(10),
    },
    paragraph: {
      fontSize: fontSizes.body,
      color: Colors.BodyText,
    },
    heading1: {
      fontSize: gFontSize(28),
      fontWeight: 'bold',
      color: Colors.BodyText,
    },
    heading2: {
      fontSize: gFontSize(24),
      fontWeight: '600',
      color: Colors.BodyText,
    },
    heading3: {
      fontSize: gFontSize(20),
      fontWeight: '500',
      color: Colors.BodyText,
    },
    codeBlock: {
      backgroundColor: Colors.BodyTextOpacity,
      padding: gGap(10),
      borderRadius: 4,
    },
    codeText: {
      fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
      fontSize: 14,
    },
    codeLanguage: {
      position: 'absolute',
      right: 8,
      top: 4,
      fontSize: 12,
      color: Colors.BodyText,
    },
    quote: {
      borderLeftWidth: 4,
      borderLeftColor: Colors.BodyText,
      paddingLeft: 12,
      paddingVertical: gGap(5),
      borderTopRightRadius: gBorderRadius(4),
      borderBottomRightRadius: gBorderRadius(4),
      backgroundColor: Colors.BodyTextOpacity,
    },
    list: {
      gap: gGap(5),
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingLeft: gGap(10),
    },
    listMarker: {
      marginRight: 8,
      color: Colors.BodyText,
    },
    listContent: {
      flex: 1,
    },
    checkbox: {
      marginRight: 8,
      color: Colors.BodyText,
    },
    link: {
      color: '#0066cc',
      textDecorationLine: 'underline',
    },
    lineBreak: {
      height: 16,
    },
  });

export default LexicalTextRenderer;
