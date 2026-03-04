import * as React from "react"
import Svg, { Path } from "react-native-svg"
const NotificationIconBig = (props) => (
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
            strokeMiterlimit={10}
            strokeWidth={2}
            d="M15.025 3.638a7.506 7.506 0 0 0-7.5 7.5v3.612c0 .763-.325 1.925-.712 2.575l-1.438 2.388c-.887 1.475-.275 3.112 1.35 3.662 5.388 1.8 11.2 1.8 16.588 0 1.512-.5 2.175-2.287 1.35-3.662l-1.438-2.388c-.375-.65-.7-1.812-.7-2.575v-3.612c0-4.125-3.375-7.5-7.5-7.5Z"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={2}
            d="M17.337 4a8.442 8.442 0 0 0-4.625 0 2.482 2.482 0 0 1 2.313-1.575c1.05 0 1.95.65 2.312 1.575Z"
        />
        <Path
            stroke="#fff"
            strokeMiterlimit={10}
            strokeWidth={2}
            d="M18.775 23.825a3.761 3.761 0 0 1-3.75 3.75 3.763 3.763 0 0 1-2.65-1.1 3.763 3.763 0 0 1-1.1-2.65"
        />
    </Svg>
)
export default NotificationIconBig
