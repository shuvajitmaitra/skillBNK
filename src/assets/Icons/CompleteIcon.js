import * as React from "react"
import Svg, { Circle } from "react-native-svg"

function CompleteIcon({ width = 9, height = 9, ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 9 9"
      fill="none"
      {...props}
    >
      <Circle
        cx={4.73047}
        cy={4.86566}
        r={4}
        fill="#27AC1F"
        fillOpacity={0.2}
      />
      <Circle
        cx={4.73307}
        cy={4.86595}
        r={2.66667}
        fill="#27AC1F"
        fillOpacity={0.2}
      />
      <Circle cx={4.72786} cy={4.86538} r={1.33333} fill="#27AC1F" />
    </Svg>
  )
}

export default CompleteIcon
