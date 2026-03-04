import * as React from "react";
import Svg, { Path } from "react-native-svg";

function TrashIcon(props) {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M2.5 5h15"
                stroke="#FD282B"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.835 5v11.666a1.667 1.667 0 01-1.667 1.667H5.835a1.667 1.667 0 01-1.667-1.667V4.999m2.5 0V3.333a1.667 1.667 0 011.667-1.667h3.333a1.667 1.667 0 011.667 1.667v1.666M8.332 9.166v5M11.668 9.166v5"
                stroke="#FD282B"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default TrashIcon;
