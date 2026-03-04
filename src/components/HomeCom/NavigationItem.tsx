import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {PressableScale} from '../SharedComponent/PressableScale';
import {NavItem} from '../../screens/Main/Dashboard';
import {withOpacity} from '../ChatCom/Mention/utils';
import {gFontSize, gGap, gWidth} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';

interface NavigationItemProps {
  item: NavItem;
  index: number;
}

const DIRS = [
  {x: -14, y: 14}, // bottom-left
  {x: 14, y: 14}, // bottom-right
  {x: -14, y: -14}, // top-left
  {x: 14, y: -14}, // top-right
];

const NavigationItem: React.FC<NavigationItemProps> = React.memo(
  ({item, index}) => {
    const Colors: TColors = useTheme();
    const styles = useMemo(() => getStyles(Colors), [Colors]);
    const appear = useSharedValue(0); // 0 -> 1 (entry)
    const iconProgress = useSharedValue(0); // 0 -> 1 (press feedback)

    const dir = DIRS[index % DIRS.length];

    useEffect(() => {
      // stagger entrance
      appear.value = 0;
      appear.value = withDelay(
        index * 100,
        withTiming(1, {
          duration: 1000,
          easing: Easing.out(Easing.cubic),
        }),
      );
    }, [index, appear]);

    const cardAnimStyle = useAnimatedStyle(() => {
      const t = appear.value;
      return {
        opacity: t,
        transform: [
          {translateX: (1 - t) * dir.x},
          {translateY: (1 - t) * dir.y},
          {scale: 0.8 + 0.2 * t},
        ],
      };
    }, []);

    const iconAnimStyle = useAnimatedStyle(() => {
      const r = interpolate(iconProgress.value, [0, 1], [0, 30]); // subtle rotation
      const s = interpolate(iconProgress.value, [0, 1], [1, 1.08]); // subtle scale
      return {
        transform: [{rotate: `${r}deg`}, {scale: s}],
      };
    }, []);

    const onPressIn = () => {
      iconProgress.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.quad),
      });
    };

    const onPressOut = () => {
      iconProgress.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
    };

    return (
      <PressableScale
        onPress={item.onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        {/* Animate THIS view instead of PressableScale (prevents ref/native issues) */}
        <Animated.View
          style={[
            styles.navigationItemContainer,
            {
              backgroundColor: withOpacity(item.backgroundColor, 0.1),
              borderColor: withOpacity(item.backgroundColor, 0.2),
              overflow: 'hidden',
            },
            cardAnimStyle,
          ]}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: item.backgroundColor},
            ]}>
            <Animated.View style={iconAnimStyle}>{item.icon}</Animated.View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              flex: 1,
            }}>
            <Text style={styles.navigationItemText}>{item.title}</Text>
            {item.badge && (
              <View
                style={{
                  backgroundColor: withOpacity(item.backgroundColor, 0.3),
                  minWidth: gGap(18),
                  height: gGap(18),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <Text
                  style={{
                    color: item.backgroundColor,
                    fontWeight: '700',
                    fontSize: 11,
                  }}>
                  {item.badge}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.navigationItemSubTitle}>{item.subTitle}</Text>

          <View
            pointerEvents="none"
            style={{
              backgroundColor: withOpacity(item.backgroundColor, 0.07),
              width: 90,
              height: 90,
              borderRadius: 100,
              position: 'absolute',
              top: -30,
              right: -30,
              zIndex: -10,
            }}
          />
        </Animated.View>
      </PressableScale>
    );
  },
);

export default NavigationItem;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    navigationItemContainer: {
      borderRadius: 12,
      padding: gGap(16),
      gap: gGap(5),
      flex: 1,
      borderWidth: 1,
      backgroundColor: Colors.Foreground,
    },

    iconContainer: {
      borderRadius: gGap(10),
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: 50,
    },

    navigationItemText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: gFontSize(16),
    },

    navigationItemSubTitle: {
      width: gWidth(150),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
  });
