import React from "react"

import useWalker from "./use-walker"

import { SIZE } from "../../constants"

export default function Character() {
  const offset = { left: 0, top: 0 }
  const { facing, step } = useWalker()

  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        background: `url(/characters.png) -${offset.left +
          step * SIZE}px -${offset.top + facing.current}px`
      }}
    />
  )
}
