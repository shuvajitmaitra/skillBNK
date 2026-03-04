import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const ProgramIconBig = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}>
    <Path
      stroke={props.color || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M10.625 18.125 14.875 15l-4.25-3.125v6.25Z"
    />
    <Path
      stroke={props.color || '#fff'}
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M27.5 15c0-6.904-5.596-12.5-12.5-12.5S2.5 8.096 2.5 15 8.096 27.5 15 27.5 27.5 21.904 27.5 15Z"
    />
    <Path
      stroke={props.color || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M12.5 8.75 21.25 15l-8.75 6.25"
    />
  </Svg>
);
export default ProgramIconBig;
