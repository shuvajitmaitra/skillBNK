import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CalenderIconBig = props => (
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
      d="M10 2.5v3.75M20 2.5v3.75M4.375 11.363h21.25M26.25 10.625V21.25c0 3.75-1.875 6.25-6.25 6.25H10c-4.375 0-6.25-2.5-6.25-6.25V10.625c0-3.75 1.875-6.25 6.25-6.25h10c4.375 0 6.25 2.5 6.25 6.25Z"
    />
    <Path
      stroke={props.color || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M19.618 17.125h.011M19.618 20.875h.011M14.994 17.125h.011M14.994 20.875h.011M10.368 17.125h.011M10.368 20.875h.011"
    />
  </Svg>
);
export default CalenderIconBig;
