import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';
const ChatIconBig = ({size, color, ...props}: TIcons) => {
  return (
    <Svg width={size || 30} height={size || 30} fill="none" {...props}>
      <Path
        stroke={color || '#fff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M27.5 12.5v3.75c0 5-2.5 7.5-7.5 7.5h-.625c-.387 0-.762.188-1 .5l-1.875 2.5c-.825 1.1-2.175 1.1-3 0l-1.875-2.5c-.2-.275-.662-.5-1-.5H10c-5 0-7.5-1.25-7.5-7.5V10C2.5 5 5 2.5 10 2.5h7.5"
      />
      <Path
        fill={color || '#fff'}
        d="M24.375 8.75a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25Z"
      />
      <Path
        stroke={color || '#fff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M19.996 13.75h.01M14.994 13.75h.011M9.993 13.75h.011"
      />
    </Svg>
  );
};
export default ChatIconBig;
