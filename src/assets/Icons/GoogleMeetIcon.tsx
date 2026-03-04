import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {TIcons} from '../../types';

function GoogleMeetIcon({size}: TIcons) {
  return (
    <Svg
      width={size || 35}
      height={size || 35}
      viewBox="0 0 32 32"
      data-name="Layer 1">
      <Path d="M24 21.45V25a2.006 2.006 0 01-2 2H9v-6h9v-5z" fill="#00ac47" />
      <Path fill="#31a950" d="M24 11L24 21.45 18 16 18 11 24 11z" />
      <Path fill="#ea4435" d="M9 5L9 11 3 11 9 5z" />
      <Path fill="#4285f4" d="M3 11H9V22H3z" />
      <Path
        d="M24 7v4h-.5L18 16v-5H9V5h13a2.006 2.006 0 012 2z"
        fill="#ffba00"
      />
      <Path d="M9 21v6H5a2.006 2.006 0 01-2-2v-4z" fill="#0066da" />
      <Path
        d="M29 8.26v15.48a.999.999 0 01-1.67.74L24 21.45 18 16l5.5-5 .5-.45 3.33-3.03a.999.999 0 011.67.74z"
        fill="#00ac47"
      />
      <Path fill="#188038" d="M24 10.55L24 21.45 18 16 23.5 11 24 10.55z" />
    </Svg>
  );
}

export default GoogleMeetIcon;
