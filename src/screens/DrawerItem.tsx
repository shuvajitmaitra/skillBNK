import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';

type IconRenderProps = {color: string; size: number};
type IconRenderer = (props: IconRenderProps) => React.ReactNode;

type Props = {
  label: string;
  onPress: () => void;
  icon?: IconRenderer | (() => React.ReactNode);
  focused?: boolean;
  color?: string; // icon default color
  size?: number; // icon default size
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  right?: React.ReactNode; // optional right content (badge etc.)
};

export default function DrawerItem({
  label,
  onPress,
  icon,
  focused = false,
  color = '#FFFFFF',
  size = 24,
  labelStyle,
  containerStyle,
  right,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: 'rgba(255,255,255,0.08)'}}
      style={({pressed}) => [
        styles.row,
        focused && styles.focused,
        pressed && Platform.OS === 'ios' ? {opacity: 0.7} : null,
        containerStyle,
      ]}>
      <View style={styles.left}>
        {!!icon && (
          <View style={styles.iconWrap}>
            {/* icon can be (props)=>node OR ()=>node */}
            {icon.length > 0
              ? (icon as IconRenderer)({color, size})
              : (icon as () => React.ReactNode)()}
          </View>
        )}

        <Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Text>
      </View>

      {!!right && <View style={styles.right}>{right}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focused: {
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 28,
    alignItems: 'center',
    marginRight: 14,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  right: {
    marginLeft: 10,
  },
});
