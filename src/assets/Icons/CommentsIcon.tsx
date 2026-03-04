import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {TIcons} from '../../types';

function CommentsIcon({size, color}: TIcons) {
  const Colors = useTheme();
  return (
    <Svg
      width={size || 25}
      height={size || 25}
      viewBox="0 0 24 24"
      id="magicoon-Regular">
      <G id="comments-Regular">
        <Path
          id="comments-Regular-2"
          data-name="comments-Regular"
          d="M18 7.25h-.25V6A3.754 3.754 0 0014 2.25H6A3.754 3.754 0 002.25 6v10a.75.75 0 00.466.694.741.741 0 00.284.056.749.749 0 00.536-.225l1.739-1.775h.975V16A3.754 3.754 0 0010 19.75h8.725l1.739 1.775a.749.749 0 00.536.225.741.741 0 00.284-.056.75.75 0 00.466-.694V11A3.754 3.754 0 0018 7.25zm-13.04 6a.75.75 0 00-.536.225l-.674.688V6A2.252 2.252 0 016 3.75h8A2.252 2.252 0 0116.25 6v5A2.252 2.252 0 0114 13.25zm15.29 5.913l-.674-.688a.75.75 0 00-.536-.225H10A2.252 2.252 0 017.75 16v-1.25H14A3.754 3.754 0 0017.75 11V8.75H18A2.252 2.252 0 0120.25 11z"
          fill={color || Colors.BodyText}
        />
      </G>
    </Svg>
  );
}

export default CommentsIcon;
