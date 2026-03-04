import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';
const MicIcon = ({size, ...props}: TIcons) => {
  const Colors = useTheme();
  return (
    <Svg
      fill={Colors.BodyText}
      width={size || 20}
      height={size || 20}
      viewBox="0 0 72 72"
      {...props}>
      <Path d="M36 54c6.893 0 12.5-5.607 12.5-12.5v-26C48.5 8.607 42.893 3 36 3S23.5 8.607 23.5 15.5v26C23.5 48.393 29.107 54 36 54zm-8.5-38.5c0-4.687 3.812-8.5 8.5-8.5 4.688 0 8.5 3.813 8.5 8.5v26c0 4.686-3.813 8.5-8.5 8.5-4.687 0-8.5-3.814-8.5-8.5v-26z" />
      <Path d="M30.5 24a1 1 0 001-1v-8.518c0-2.303 2.094-2.482 2.851-2.482h.774a1 1 0 100-2h-.774c-3.126 0-4.851 1.801-4.851 4.482V23a1 1 0 001 1zM31.5 27v-1a1 1 0 10-2 0v1a1 1 0 102 0zM55.5 37a2 2 0 00-2 2v1.159C53.5 49.829 45.324 58 36.091 58h-.212C26.421 58 18.5 49.663 18.5 40.158V39a2 2 0 00-4 0v1.159c0 11.032 8.324 20.464 19 21.7V65h-6.376a2 2 0 000 4h17.001a2 2 0 000-4H37.5v-3.055c10.973-.755 20-10.234 20-21.787V39a2 2 0 00-2-2z" />
    </Svg>
  );
};
export default MicIcon;
