import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

function LinkIcon(props) {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G
                clipPath="url(#clip0_538_4095)"
                stroke="#17855F"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <Path d="M8.332 10.834a4.166 4.166 0 006.283.45l2.5-2.5a4.167 4.167 0 00-5.891-5.892L9.79 4.317" />
                <Path d="M11.668 9.167a4.167 4.167 0 00-6.284-.45l-2.5 2.5a4.167 4.167 0 005.892 5.892l1.425-1.425" />
            </G>
            <Defs>
                <ClipPath id="clip0_538_4095">
                    <Path fill="#fff" d="M0 0H20V20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default LinkIcon;
