/* eslint-disable no-bitwise */
import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  Image,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fontSizes, gBorderRadius, gFontSize, gGap} from '../../constants/Sizes';
import {useTheme} from '../../context/ThemeContext';

type TInlineStyle = {
  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  color?: string;
};

type TNode = {
  type?: string;
  text?: string;
  style?: string;
  format?: number;
  children?: TNode[];
  tag?: string;
  listType?: 'number' | 'bullet' | 'check' | string;
  checked?: boolean;
  url?: string;
  src?: string;
  altText?: string;
  maxWidth?: number;
  height?: number;
  language?: string;
  highlightType?: string;
  indent?: number;
};

interface LexicalTextRendererProps {
  content: any;
  style?: any;
}

const parseInlineStyles = (styleString = ''): TInlineStyle => {
  const styles: TInlineStyle = {};

  if (!styleString) return styles;

  styleString.split(';').forEach(rule => {
    const [rawKey, rawValue] = rule.split(':');
    const key = rawKey?.trim();
    const value = rawValue?.trim();

    if (!key || !value) return;

    if (key === 'font-family') styles.fontFamily = value;
    if (key === 'font-size') styles.fontSize = parseInt(value, 10);
    if (key === 'background-color') styles.backgroundColor = value;
    if (key === 'color') styles.color = value;
  });

  return styles;
};

const getHighlightColor = (highlightType?: string, fallback?: string) => {
  switch (highlightType) {
    case 'keyword':
      return '#C792EA';
    case 'string':
      return '#C3E88D';
    case 'number':
      return '#F78C6C';
    case 'comment':
      return '#7F848E';
    case 'function':
      return '#82AAFF';
    case 'punctuation':
      return '#89DDFF';
    case 'operator':
      return '#89DDFF';
    case 'constant':
      return '#FFD54F';
    case 'parameter':
      return '#F07178';
    case 'literal-property':
      return '#FFCB6B';
    case 'template-punctuation':
      return '#89DDFF';
    case 'interpolation':
      return '#F07178';
    case 'interpolation-punctuation':
      return '#89DDFF';
    default:
      return fallback || '#EAEAEA';
  }
};

const getTextStyleFromNode = (node: TNode, defaultColor: string) => {
  const textStyles: TInlineStyle & Record<string, any> = parseInlineStyles(
    node?.style || '',
  );

  textStyles.color = textStyles.color || defaultColor;

  if ((node?.format ?? 0) & 1) textStyles.fontWeight = 'bold';
  if ((node?.format ?? 0) & 2) textStyles.fontStyle = 'italic';
  if ((node?.format ?? 0) & 4) textStyles.textDecorationLine = 'underline';
  if ((node?.format ?? 0) & 8) textStyles.textDecorationLine = 'line-through';
  if ((node?.format ?? 0) & 16) {
    textStyles.fontFamily = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
  }

  if (node?.type === 'code-highlight') {
    textStyles.color = getHighlightColor(node.highlightType, defaultColor);
    textStyles.fontFamily = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
  }

  return textStyles;
};

const normalizeContent = (content: any) => {
  if (!content) return null;

  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch {
      return {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [{type: 'text', text: content}],
            },
          ],
        },
      };
    }
  }

  return content;
};

const ResponsiveImage = ({node, index}: {node: TNode; index: number}) => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const {width: screenWidth} = useWindowDimensions();

  const uri = node?.src;
  const alt = node?.altText || 'Image';

  const targetWidth =
    typeof node?.maxWidth === 'number' && node.maxWidth > 0
      ? Math.min(screenWidth - 32, node.maxWidth)
      : screenWidth - 32;

  const [measuredHeight, setMeasuredHeight] =
    (useState < number) | (null > null);

  useEffect(() => {
    if (!uri) return;

    const hasValidHeight = typeof node?.height === 'number' && node.height > 0;
    if (hasValidHeight) return;

    Image.getSize(
      uri,
      (w, h) => {
        if (w > 0 && h > 0) {
          const newHeight = Math.round((targetWidth * h) / w);
          setMeasuredHeight(newHeight);
        } else {
          setMeasuredHeight(240);
        }
      },
      () => {
        setMeasuredHeight(240);
      },
    );
  }, [uri, node?.height, targetWidth]);

  const finalHeight =
    typeof node?.height === 'number' && node.height > 0
      ? node.height
      : measuredHeight ?? 240;

  if (!uri) return null;

  return (
    <Image
      key={`image-${index}`}
      source={{uri}}
      style={[
        styles.imageBase,
        {
          width: targetWidth,
          height: finalHeight,
        },
      ]}
      accessibilityLabel={alt}
      resizeMode="contain"
    />
  );
};

const CodeBlock = ({node, index}: {node: TNode; index: number}) => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const children = Array.isArray(node?.children) ? node.children : [];

  const lines: TNode[][] = [[]];

  children.forEach(child => {
    if (child?.type === 'linebreak') {
      lines.push([]);
    } else {
      lines[lines.length - 1].push(child);
    }
  });

  return (
    <View key={`code-${index}`} style={styles.codeBlock}>
      {!!node?.language && (
        <View style={styles.codeHeader}>
          <Text style={styles.codeLanguage}>{node.language}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.codeScrollContent}>
        <View style={styles.codeInner}>
          {lines.map((line, lineIndex) => (
            <View key={`code-line-${lineIndex}`} style={styles.codeLineRow}>
              <Text style={styles.codeLineNumber}>{lineIndex + 1}</Text>
              <Text style={styles.codeLineText}>
                {line.length === 0 ? ' ' : null}
                {line.map((segment, segmentIndex) => (
                  <Text
                    key={`code-segment-${lineIndex}-${segmentIndex}`}
                    style={[
                      styles.codeText,
                      getTextStyleFromNode(segment, styles.codeText.color),
                    ]}>
                    {segment?.text ?? ''}
                  </Text>
                ))}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const LexicalTextRenderer: React.FC<LexicalTextRendererProps> = ({
  content,
  style,
}) => {
  const Colors = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const normalizedContent = useMemo(() => normalizeContent(content), [content]);

  const renderInlineNodes = (
    nodes: TNode[] = [],
    keyPrefix: string,
  ): React.ReactNode[] => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-inline-${index}`;

      if (node?.type === 'linebreak') {
        return <Text key={key}>{'\n'}</Text>;
      }

      if (node?.type === 'tab') {
        return <Text key={key}>{'    '}</Text>;
      }

      if (
        node?.type === 'text' ||
        node?.type === 'code-highlight' ||
        typeof node?.text === 'string'
      ) {
        return (
          <Text key={key} style={getTextStyleFromNode(node, Colors.BodyText)}>
            {node?.text ?? ''}
          </Text>
        );
      }

      if (node?.type === 'link') {
        return (
          <Text
            key={key}
            style={styles.link}
            onPress={() => {
              if (node?.url) Linking.openURL(node.url);
            }}>
            {renderInlineNodes(node.children || [], `${key}-link`)}
          </Text>
        );
      }

      return null;
    });
  };

  const renderParagraphChildren = (
    nodes: TNode[] = [],
    keyPrefix: string,
  ): React.ReactNode[] => {
    return nodes.map((child, idx) => {
      const key = `${keyPrefix}-child-${idx}`;

      if (
        child?.type === 'text' ||
        child?.type === 'code-highlight' ||
        child?.type === 'linebreak' ||
        child?.type === 'tab' ||
        child?.type === 'link'
      ) {
        return renderInlineNodes([child], key);
      }

      if (child?.type === 'image') {
        return (
          <View key={key} style={styles.blockInsideParagraph}>
            <ResponsiveImage node={child} index={idx} />
          </View>
        );
      }

      if (child?.type === 'list') {
        return (
          <View key={key} style={styles.blockInsideParagraph}>
            {renderElementNode(child, idx, key)}
          </View>
        );
      }

      return null;
    });
  };

  const renderListItemContent = (
    item: TNode,
    itemIndex: number,
    parentKey: string,
  ) => {
    const children = item?.children || [];

    const inlineChildren = children.filter(
      child =>
        child?.type === 'text' ||
        child?.type === 'code-highlight' ||
        child?.type === 'linebreak' ||
        child?.type === 'tab' ||
        child?.type === 'link',
    );

    const blockChildren = children.filter(
      child =>
        child?.type !== 'text' &&
        child?.type !== 'code-highlight' &&
        child?.type !== 'linebreak' &&
        child?.type !== 'tab' &&
        child?.type !== 'link',
    );

    return (
      <View
        key={`${parentKey}-content-${itemIndex}`}
        style={styles.listContent}>
        {inlineChildren.length > 0 && (
          <Text style={styles.listItemText}>
            {renderInlineNodes(
              inlineChildren,
              `${parentKey}-inline-${itemIndex}`,
            )}
          </Text>
        )}

        {blockChildren.map((child, childIdx) => (
          <View
            key={`${parentKey}-block-${itemIndex}-${childIdx}`}
            style={styles.nestedBlock}>
            {renderElementNode(
              child,
              childIdx,
              `${parentKey}-nested-${itemIndex}-${childIdx}`,
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderElementNode = (
    node: TNode,
    index: number,
    parentKey = 'root',
  ): React.ReactNode => {
    if (!node) return null;

    const key = `${parentKey}-${node.type || 'node'}-${index}`;

    switch (node.type) {
      case 'heading': {
        const tag = node.tag || 'h1';
        const level = parseInt(tag.replace('h', ''), 10) || 1;
        const headingStyle =
          level === 1
            ? styles.heading1
            : level === 2
            ? styles.heading2
            : level === 3
            ? styles.heading3
            : styles.heading4;

        return (
          <View key={key} style={styles.headingWrap}>
            <Text style={headingStyle}>
              {renderInlineNodes(node.children || [], `${key}-heading`)}
            </Text>
          </View>
        );
      }

      case 'paragraph': {
        const children = node.children || [];
        const hasOnlyInline = children.every(
          child =>
            child?.type === 'text' ||
            child?.type === 'code-highlight' ||
            child?.type === 'linebreak' ||
            child?.type === 'tab' ||
            child?.type === 'link',
        );

        if (children.length === 0) {
          return <View key={key} style={styles.emptyParagraph} />;
        }

        if (hasOnlyInline) {
          return (
            <Text key={key} style={styles.paragraph}>
              {renderInlineNodes(children, `${key}-paragraph`)}
            </Text>
          );
        }

        return (
          <View key={key} style={styles.paragraphBlock}>
            {renderParagraphChildren(children, key)}
          </View>
        );
      }

      case 'list':
        return (
          <View key={key} style={styles.list}>
            {(node.children || []).map((item, idx) => {
              if (item.type !== 'listitem') return null;

              return (
                <View key={`${key}-li-${idx}`} style={styles.listItem}>
                  <View style={styles.listMarkerWrap}>
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
                  </View>

                  {renderListItemContent(item, idx, key)}
                </View>
              );
            })}
          </View>
        );

      case 'code':
        return <CodeBlock key={key} node={node} index={index} />;

      case 'quote':
        return (
          <View key={key} style={styles.quote}>
            <Text style={styles.quoteText}>
              {renderInlineNodes(node.children || [], `${key}-quote`)}
            </Text>
          </View>
        );

      case 'link':
        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.7}
            onPress={() => node.url && Linking.openURL(node.url)}>
            <Text style={styles.link}>
              {renderInlineNodes(node.children || [], `${key}-link`)}
            </Text>
          </TouchableOpacity>
        );

      case 'image':
        return <ResponsiveImage node={node} index={index} />;

      default:
        if (node.children?.length) {
          return (
            <View key={key} style={styles.unknownBlock}>
              {node.children.map((child, idx) =>
                renderElementNode(child, idx, `${key}-fallback`),
              )}
            </View>
          );
        }
        return null;
    }
  };

  if (!normalizedContent?.root?.children) return null;

  return (
    <View style={[styles.container, style]}>
      {normalizedContent.root.children.map((node: TNode, index: number) =>
        renderElementNode(node, index),
      )}
    </View>
  );
};

const getStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: gGap(10),
    },

    paragraph: {
      fontSize: fontSizes.body,
      color: Colors.BodyText,
      lineHeight: gFontSize(24),
    },

    paragraphBlock: {
      gap: gGap(8),
    },

    emptyParagraph: {
      height: gGap(8),
    },

    blockInsideParagraph: {
      marginTop: gGap(4),
      marginBottom: gGap(4),
    },

    headingWrap: {
      marginTop: gGap(6),
      marginBottom: gGap(2),
    },

    heading1: {
      fontSize: gFontSize(28),
      lineHeight: gFontSize(36),
      fontWeight: '700',
      color: Colors.Heading || Colors.BodyText,
    },

    heading2: {
      fontSize: gFontSize(24),
      lineHeight: gFontSize(32),
      fontWeight: '700',
      color: Colors.Heading || Colors.BodyText,
    },

    heading3: {
      fontSize: gFontSize(20),
      lineHeight: gFontSize(28),
      fontWeight: '600',
      color: Colors.Heading || Colors.BodyText,
    },

    heading4: {
      fontSize: gFontSize(18),
      lineHeight: gFontSize(26),
      fontWeight: '600',
      color: Colors.Heading || Colors.BodyText,
    },

    codeBlock: {
      backgroundColor: '#111827',
      borderRadius: gBorderRadius(10),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#1F2937',
      marginVertical: gGap(4),
    },

    codeHeader: {
      paddingHorizontal: gGap(12),
      paddingVertical: gGap(8),
      borderBottomWidth: 1,
      borderBottomColor: '#1F2937',
      backgroundColor: '#0B1220',
    },

    codeLanguage: {
      color: '#9CA3AF',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    codeScrollContent: {
      paddingVertical: gGap(10),
      minWidth: '100%',
    },

    codeInner: {
      minWidth: '100%',
    },

    codeLineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: gGap(12),
      paddingVertical: 1,
    },

    codeLineNumber: {
      width: 32,
      color: '#6B7280',
      fontSize: 13,
      lineHeight: 22,
      textAlign: 'right',
      marginRight: gGap(12),
      fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },

    codeLineText: {
      flexShrink: 1,
      minWidth: 1,
      color: '#E5E7EB',
      fontSize: 13,
      lineHeight: 22,
      fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },

    codeText: {
      color: '#E5E7EB',
      fontSize: 13,
      lineHeight: 22,
      fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },

    quote: {
      borderLeftWidth: 4,
      borderLeftColor: Colors.Primary || Colors.BodyText,
      paddingLeft: 12,
      paddingVertical: gGap(10),
      borderTopRightRadius: gBorderRadius(8),
      borderBottomRightRadius: gBorderRadius(8),
      backgroundColor: Colors.BodyTextOpacity,
    },

    quoteText: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
      lineHeight: gFontSize(24),
    },

    list: {
      gap: gGap(8),
      marginVertical: gGap(4),
    },

    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    listMarkerWrap: {
      width: 28,
      paddingTop: 2,
      alignItems: 'flex-start',
    },

    listMarker: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
      lineHeight: gFontSize(24),
    },

    listContent: {
      flex: 1,
      gap: gGap(6),
    },

    listItemText: {
      color: Colors.BodyText,
      fontSize: fontSizes.body,
      lineHeight: gFontSize(24),
    },

    nestedBlock: {
      marginTop: gGap(2),
      marginLeft: gGap(2),
    },

    checkbox: {
      color: Colors.BodyText,
      marginTop: 1,
    },

    link: {
      color: '#2563EB',
      textDecorationLine: 'underline',
    },

    unknownBlock: {
      gap: gGap(8),
    },

    imageBase: {
      borderRadius: gBorderRadius(10),
      backgroundColor: '#E5E7EB',
      alignSelf: 'center',
    },
  });

export default LexicalTextRenderer;
