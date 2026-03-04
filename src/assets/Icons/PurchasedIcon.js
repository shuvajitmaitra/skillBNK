import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PurchasedIcon(props) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.375 9.587V8.375c0-2.813 2.262-5.575 5.075-5.838 3.35-.325 6.175 2.313 6.175 5.6v1.725M11.25 27.5h7.5c5.025 0 5.925-2.012 6.188-4.462l.937-7.5C26.212 12.488 25.337 10 20 10H10c-5.337 0-6.212 2.488-5.875 5.537l.938 7.5c.262 2.45 1.162 4.463 6.187 4.463z"
        stroke="#fff"
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.37 15h.01M10.618 15h.011"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default PurchasedIcon;
