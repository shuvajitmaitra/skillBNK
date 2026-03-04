import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  AntDesignIcon,
  EntypoIcon,
  IoniconsIcon,
} from '../../../constants/Icons';
import {useTheme} from '../../../context/ThemeContext';
import {TColors} from '../../../types';
import {gGap} from '../../../constants/Sizes';
import AiIcon2 from '../../../assets/Icons/AiIcon2';
type InputBottomProps = {
  onPlusPress: () => void;
};
const InputBottomSection = ({onPlusPress}: InputBottomProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={[styles.container, {justifyContent: 'space-between'}]}>
      <View style={styles.container}>
        <AntDesignIcon
          onPress={onPlusPress}
          name="pluscircleo"
          size={25}
          color={Colors.BodyText}
        />
        <AntDesignIcon name="pluscircleo" size={25} color={Colors.BodyText} />
        <EntypoIcon name="emoji-happy" size={25} color={Colors.BodyText} />
      </View>
      <View style={styles.container}>
        <AiIcon2 />
        <IoniconsIcon name="send" size={25} color={Colors.BodyText} />
      </View>
    </View>
  );
};

export default InputBottomSection;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
      backgroundColor: Colors.Background_color,
    },
  });
