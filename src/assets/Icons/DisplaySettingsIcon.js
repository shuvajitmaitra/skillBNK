import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';

function DisplaySettingsIcon(props) {
  const Colors = useTheme();

  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <Path
          d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
          fillRule="nonzero"
          transform="translate(-1200) translate(1200)"
        />
        <Path
          d="M18 4a1 1 0 10-2 0v1H4a1 1 0 000 2h12v1a1 1 0 102 0V7h2a1 1 0 100-2h-2V4zM4 11a1 1 0 100 2h2v1a1 1 0 102 0v-1h12a1 1 0 100-2H8v-1a1 1 0 00-2 0v1H4zm-1 7a1 1 0 011-1h12v-1a1 1 0 112 0v1h2a1 1 0 110 2h-2v1a1 1 0 11-2 0v-1H4a1 1 0 01-1-1z"
          fill={Colors.BodyText}
          transform="translate(-1200) translate(1200)"
        />
      </G>
    </Svg>
  );
}

export default DisplaySettingsIcon;
