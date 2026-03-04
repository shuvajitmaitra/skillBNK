import * as React from 'react';
import Svg, {Rect, Path, Defs, RadialGradient, Stop} from 'react-native-svg';
import {TIcons} from '../../types';

function InstagramIcon({size, ...props}: TIcons) {
  return (
    <Svg
      width={size || 25}
      height={size || 25}
      viewBox="0 0 32 32"
      fill="none"
      {...props}>
      <Rect
        x={2}
        y={2}
        width={28}
        height={28}
        rx={6}
        fill="url(#paint0_radial_87_7153)"
      />
      <Rect
        x={2}
        y={2}
        width={28}
        height={28}
        rx={6}
        fill="url(#paint1_radial_87_7153)"
      />
      <Rect
        x={2}
        y={2}
        width={28}
        height={28}
        rx={6}
        fill="url(#paint2_radial_87_7153)"
      />
      <Path d="M23 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 21a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 100-6 3 3 0 000 6z"
        fill="#fff"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 15.6c0-3.36 0-5.04.654-6.324a6 6 0 012.622-2.622C10.56 6 12.24 6 15.6 6h.8c3.36 0 5.04 0 6.324.654a6 6 0 012.622 2.622C26 10.56 26 12.24 26 15.6v.8c0 3.36 0 5.04-.654 6.324a6 6 0 01-2.622 2.622C21.44 26 19.76 26 16.4 26h-.8c-3.36 0-5.04 0-6.324-.654a6 6 0 01-2.622-2.622C6 21.44 6 19.76 6 16.4v-.8zM15.6 8h.8c1.713 0 2.878.002 3.778.075.877.072 1.325.202 1.638.361a4 4 0 011.748 1.748c.16.313.29.761.36 1.638.074.9.076 2.065.076 3.778v.8c0 1.713-.002 2.878-.075 3.778-.072.877-.202 1.325-.361 1.638a4 4 0 01-1.748 1.748c-.313.16-.761.29-1.638.36-.9.074-2.065.076-3.778.076h-.8c-1.713 0-2.878-.002-3.778-.075-.877-.072-1.325-.202-1.638-.361a4 4 0 01-1.748-1.748c-.16-.313-.29-.761-.36-1.638C8.001 19.278 8 18.113 8 16.4v-.8c0-1.713.002-2.878.075-3.778.072-.877.202-1.325.361-1.638a4 4 0 011.748-1.748c.313-.16.761-.29 1.638-.36.9-.074 2.065-.076 3.778-.076z"
        fill="#fff"
      />
      <Defs>
        <RadialGradient
          id="paint0_radial_87_7153"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(-55.376 27.916 .066) scale(25.5196)">
          <Stop stopColor="#B13589" />
          <Stop offset={0.79309} stopColor="#C62F94" />
          <Stop offset={1} stopColor="#8A3AC8" />
        </RadialGradient>
        <RadialGradient
          id="paint1_radial_87_7153"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(-65.136 29.766 6.89) scale(22.5942)">
          <Stop stopColor="#E0E8B7" />
          <Stop offset={0.444662} stopColor="#FB8A2E" />
          <Stop offset={0.71474} stopColor="#E2425C" />
          <Stop offset={1} stopColor="#E2425C" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="paint2_radial_87_7153"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(38.50003 -5.5 1.1764 8.23476 .5 3)">
          <Stop offset={0.156701} stopColor="#406ADC" />
          <Stop offset={0.467799} stopColor="#6A45BE" />
          <Stop offset={1} stopColor="#6A45BE" stopOpacity={0} />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export default InstagramIcon;
