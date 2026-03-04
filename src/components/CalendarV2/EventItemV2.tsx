import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {IEventV2, TColors} from '../../types';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {MaterialIcon} from '../../constants/Icons';

const EventItemV2 = ({
  item,
  onPress,
}: {
  item: IEventV2;
  onPress: () => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        ...styles.eventTypeContainer,
        ...{
          justifyContent: 'flex-start',
          overflow: 'hidden',
          paddingLeft: item.type !== 'task' ? 2 : undefined,
        },
      }}>
      {item.type === 'task' && (
        <MaterialIcon
          style={{marginTop: 2}}
          size={8}
          color={Colors.BodyText}
          name="task-alt"
        />
      )}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.eventTitleText}>
        {item?.title?.trim()}
      </Text>
    </TouchableOpacity>
  );
};

export default EventItemV2;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    eventTypeContainer: {
      width: '95%',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
      minHeight: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: 'row',
    },

    eventTitleText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: 12,
      paddingLeft: 2,
    },
  });
