import * as React from 'react';
import Svg, {G, Rect, Path, Defs, ClipPath} from 'react-native-svg';
import {TIcons} from '../../types';

function Twitter({size, color, ...props}: TIcons) {
  return (
    <Svg
      width={size || 18}
      height={size || 18}
      fill="none"
      viewBox="0 0 512 512"
      {...props}>
      <G clipPath="url(#clip0_84_15698)">
        <Rect width={512} height={512} rx={60} />
        <Path
          fill={color || '#000'}
          d="M355.904 100h52.928L293.2 232.16 429.232 412H322.72l-83.424-109.072L143.84 412H90.88l123.68-141.36L84.065 100H193.28l75.408 99.696L355.904 100zm-18.576 280.32h29.328L177.344 130.016h-31.472L337.328 380.32z"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_84_15698">
          <Path d="M0 0H512V512H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Twitter;
