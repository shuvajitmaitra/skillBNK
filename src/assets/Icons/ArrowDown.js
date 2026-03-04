import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowDown(props) {
    return (
        <Svg
            width={15}
            height={16}
            viewBox="0 0 11 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M1 7.333l4.167 4.166 4.166-4.166M5.166 11.5v-10"
                stroke="#27AC1F"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default ArrowDown;
