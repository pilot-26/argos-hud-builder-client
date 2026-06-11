import React, { useEffect, useState } from 'react'
import { EVCommandType, EVControlType, IVCommandMessage } from '../../../main/virtual/types'
import { IAvionicsComponentArg } from '../types'

export const getVirtualSlider = (args: IAvionicsComponentArg) => {
  return (
    <VirtualSlider {...args}/>
  )
}

export const VirtualSlider: React.FC<IAvionicsComponentArg> = ({
  params,
  getUIElement
}) => {
  const [isActive, setIsActive] = useState<boolean>(Boolean(params.isActive) || false)

  const [axisId] = useState<string>(params.controlId0)
  const [axisValue, setAxisValue] = useState<number>(0)

  useEffect(() => {
    if (!isActive) return

    initController()
  }, [])
  useEffect(() => {
    if (!isActive) return

    sendInput()
  }, [axisValue])

  const initController = async () => {
    try {
      await window.virtualAPI.connect()
      const message: IVCommandMessage = {
        VCommandType: EVCommandType.REGISTER,
        VControlId: axisId,
        VControlType: EVControlType.AXIS
      }
      await window.virtualAPI.send(JSON.stringify(message) + "#")
    } catch (error) {
      console.error('Failed to create virtual controller:', error)
    }
  }

  const sendInput = async () => {
    try {
      const message: IVCommandMessage = {
        VCommandType: EVCommandType.SEND_INPUT,
        VControlId: axisId,
        VControlType: EVControlType.AXIS,
        axisValue: axisValue
      }
      await window.virtualAPI.send(JSON.stringify(message) + "#")
    } catch (error) {
      console.error('Failed to send input:', error)
    }
  }

  const normalizedValue = (axisValue + 1) / 2
  const isTooLow = axisValue < -0.5

  const jsxElement = getUIElement(
    isTooLow,
    normalizedValue,
    axisValue,
    setAxisValue
  )

  return (jsxElement)
}