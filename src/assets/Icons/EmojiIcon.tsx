import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
const EmojiIcon = ({size, ...props}: TIcons) => {
  const Colors = useTheme();
  const iconSize = size || 20;
  return (
    <Svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        d="M11.652 11.652a3.753 3.753 0 01-5.304 0M16.5 9a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0zM7.125 7.125c0 .345-.14.625-.313.625-.172 0-.312-.28-.312-.625s.14-.625.313-.625c.172 0 .312.28.312.625zm-.313 0h.007v.013h-.006v-.013zm4.688 0c0 .345-.14.625-.313.625-.172 0-.312-.28-.312-.625s.14-.625.313-.625c.172 0 .312.28.312.625zm-.313 0h.007v.013h-.007v-.013z"
        stroke={Colors.BodyText}
        strokeOpacity={1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default EmojiIcon;
