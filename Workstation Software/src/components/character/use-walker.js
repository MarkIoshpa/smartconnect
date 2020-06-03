import { useState, useEffect } from "react"
import useEventListener from "@use-it/event-listener"

import { DIRECTION, MAX_STEP } from "../../constants"

export default function useWalker() {
  const [facing, setFacing] = useState({
    current: DIRECTION.DOWN,
    previous: DIRECTION.DOWN
  })
  const [step, setStep] = useState(0)

  useEventListener("keydown", ({ code }) => {
    if (code.indexOf("Arrow") === -1) return
    const direction = DIRECTION[code.replace("Arrow", "").toUpperCase()]

    setFacing(prev => ({
      current: direction,
      previous: prev.current
    }))
  })

  useEffect(() => {
    if (facing.current === facing.previous) {
      setStep(prev => (prev < MAX_STEP - 1 ? prev + 1 : 0))
    } else {
      setStep(0)
    }
  }, [facing])

  return {
    facing,
    step
  }
}
