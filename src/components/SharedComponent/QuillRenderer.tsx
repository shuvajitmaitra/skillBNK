import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';

interface QuillAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  background?: string;
  link?: string;
}

interface QuillOp {
  insert: string;
  attributes?: QuillAttributes;
}

interface QuillDelta {
  ops: QuillOp[];
}

interface QuillRendererProps {
  delta: QuillDelta;
  style?: StyleProp<ViewStyle>;
}

const QuillRenderer: React.FC<QuillRendererProps> = ({delta, style}) => {
  const renderText = (op: QuillOp, index: number) => {
    const textStyles: any = {};
    const attributes = op.attributes || {};

    if (attributes.bold) textStyles.fontWeight = 'bold';
    if (attributes.italic) textStyles.fontStyle = 'italic';
    if (attributes.underline) textStyles.textDecorationLine = 'underline';
    if (attributes.strike) textStyles.textDecorationLine = 'line-through';
    if (attributes.color) textStyles.color = attributes.color;
    if (attributes.background)
      textStyles.backgroundColor = attributes.background;

    // Split text by newlines and render separately
    const parts = op.insert.split('\n');

    return parts.map((part, partIndex) => (
      <React.Fragment key={`${index}-${partIndex}`}>
        <Text style={[styles.baseText, textStyles]}>{part}</Text>
        {partIndex < parts.length - 1 && <View style={styles.lineBreak} />}
      </React.Fragment>
    ));
  };

  return (
    <View style={[styles.container, style]}>
      <Text selectable={true}>
        {delta.ops.map((op, index) => (
          <React.Fragment key={index}>{renderText(op, index)}</React.Fragment>
        ))}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  baseText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  lineBreak: {
    height: 24, // Matches lineHeight
    width: '100%',
  },
});

export default QuillRenderer;
