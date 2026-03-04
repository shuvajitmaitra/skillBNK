import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function ChatIcon({size, color, ...props}) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 15v-3m0 0V9m0 3H9m3 0h3m-3 9a8.96 8.96 0 01-4.49-1.198c-.13-.075-.196-.113-.257-.13a.475.475 0 00-.167-.017 1.12 1.12 0 00-.258.07l-2.31.769h-.002c-.487.163-.731.245-.893.187a.5.5 0 01-.304-.304c-.057-.162.024-.405.186-.892v-.003l.77-2.306.002-.005c.042-.129.064-.194.068-.256a.478.478 0 00-.017-.168 1.228 1.228 0 00-.127-.252l-.003-.005A9 9 0 1112 21z"
        stroke={color || Colors.BodyText}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChatIcon;
