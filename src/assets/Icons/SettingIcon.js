import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SettingIcon(props) {
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
        d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke="#27AC1F"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.667 10.733V9.267c0-.867.708-1.584 1.583-1.584 1.508 0 2.125-1.066 1.367-2.375A1.583 1.583 0 015.2 3.15l1.442-.825c.658-.392 1.508-.158 1.9.5l.091.158c.75 1.309 1.984 1.309 2.742 0l.092-.158c.391-.658 1.241-.892 1.9-.5l1.441.825a1.582 1.582 0 01.584 2.158c-.759 1.309-.142 2.375 1.366 2.375.867 0 1.584.709 1.584 1.584v1.466c0 .867-.709 1.584-1.584 1.584-1.508 0-2.125 1.066-1.366 2.375a1.58 1.58 0 01-.584 2.158l-1.441.825c-.659.392-1.509.158-1.9-.5l-.092-.158c-.75-1.309-1.983-1.309-2.742 0l-.091.158c-.392.658-1.242.892-1.9.5L5.2 16.85a1.582 1.582 0 01-.583-2.158c.758-1.309.141-2.375-1.367-2.375a1.588 1.588 0 01-1.583-1.584z"
        stroke="#27AC1F"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SettingIcon