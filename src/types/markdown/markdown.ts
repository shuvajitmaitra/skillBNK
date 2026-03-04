import {ImageStyle, TextStyle, ViewStyle} from 'react-native';

export interface MarkdownStylesProps {
  [key: string]: TextStyle | ViewStyle | ImageStyle;
}
