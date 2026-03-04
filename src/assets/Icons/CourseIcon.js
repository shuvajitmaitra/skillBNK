import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CourseIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        {...props}
    >
        <Path
            fill="#27AC1F"
            fillRule="evenodd"
            d="M9.678 2.797a.625.625 0 0 1 .644 0l8.333 5a.625.625 0 0 1 0 1.072l-8.333 5a.625.625 0 0 1-.644 0l-8.333-5a.625.625 0 0 1 0-1.072l8.333-5ZM2.882 8.333 10 12.604l7.118-4.27L10 4.061 2.882 8.333Z"
            clipRule="evenodd"
        />
        <Path
            fill="#27AC1F"
            fillRule="evenodd"
            d="M17.917 7.708a.625.625 0 0 1 .625.625v3.75a.625.625 0 0 1-1.25 0v-3.75a.625.625 0 0 1 .625-.625ZM5 9.792a.625.625 0 0 1 .625.625v3.333A1.875 1.875 0 0 0 7.5 15.625h5a1.875 1.875 0 0 0 1.875-1.875v-3.333a.625.625 0 1 1 1.25 0v3.333a3.125 3.125 0 0 1-3.125 3.125h-5a3.125 3.125 0 0 1-3.125-3.125v-3.333A.625.625 0 0 1 5 9.792Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default CourseIcon
