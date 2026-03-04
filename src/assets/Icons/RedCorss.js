import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"

function RedCross({ width = 18, height = 17, ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 17"
      fill="none"
      {...props}
    >
      <G>
        <Circle
          cx={8.99994}
          cy={8.73529}
          r={8.23529}
          fill="#F34141"
          fillOpacity={0.1}
        />
      </G>
      <Path
        d="M7 7l4 4M7 11l4-4"
        stroke="#F34141"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Defs></Defs>
    </Svg>
  )
}

export default RedCross
