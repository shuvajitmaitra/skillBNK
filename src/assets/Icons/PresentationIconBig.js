import * as React from "react"
import Svg, { Path } from "react-native-svg"
const PresentationIconBig = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={30}
        height={30}
        fill="none"
        {...props}
    >
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21.25 16.75v3.75c0 5-2 7-7 7H9.5c-5 0-7-2-7-7v-4.75c0-5 2-7 7-7h3.75"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21.25 16.75h-4c-3 0-4-1-4-4v-4l8 8ZM14.5 2.5h5M8.75 6.25A3.745 3.745 0 0 1 12.5 2.5h3.275M27.5 10v7.738a3.516 3.516 0 0 1-3.513 3.512M27.5 10h-3.75C20.937 10 20 9.062 20 6.25V2.5l7.5 7.5Z"
        />
    </Svg>
)
export default PresentationIconBig
