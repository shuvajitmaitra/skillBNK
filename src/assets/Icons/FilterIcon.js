import * as React from "react"
import Svg, { Path } from "react-native-svg"
const FilterIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        {...props}
    >
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.8}
            d="M15.834 18.333V9.166M15.834 5.833V1.666M10 18.333v-4.167M10 10.833V1.666M4.166 18.333V9.166M4.166 5.833V1.666M2.5 9.166h3.333M14.166 9.166h3.333M8.334 10.834h3.333"
        />
    </Svg>
)
export default FilterIcon

