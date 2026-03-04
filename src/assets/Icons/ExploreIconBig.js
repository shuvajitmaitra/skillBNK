import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ExploreIconBig = (props) => (
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
            d="M15 27.5c6.904 0 12.5-5.596 12.5-12.5S21.904 2.5 15 2.5 2.5 8.096 2.5 15 8.096 27.5 15 27.5Z"
        />
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m20.3 9.7-2.65 7.95L9.7 20.3l2.65-7.95L20.3 9.7Z"
        />
    </Svg>
)
export default ExploreIconBig
