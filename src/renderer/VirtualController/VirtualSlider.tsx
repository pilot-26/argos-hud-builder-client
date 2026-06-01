import React, { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react'
import { VIRTUAL_CONST } from '../../main/virtual/virtualConst'
import { EVCommandType, EVControlType, IVCommandMessage } from '../../main/virtual/types'
import { ILogicElementParam } from '../instrument/data/types'

export interface IVirtualSliderParam extends ILogicElementParam {
  args: any,
  isDummy: boolean,
  getUIElement: (
    isTooLow: boolean,
    normalizedValue: number,
    axisValue: number,
    setAxisValue: Dispatch<SetStateAction<number>>
  ) => JSX.Element
}

export class VirtualSlider {
  static getLogicElement(param: IVirtualSliderParam) {
    return (
      <VirtualSliderComponent
        args={param.args}
        isDummy={param.isDummy}
        getUIElement={param.getUIElement}
      />
    )
  }
}

const VirtualSliderComponent: React.FC<IVirtualSliderParam> = ({
  args,
  isDummy = false,
  getUIElement
}) => {
  const [axisId] = useState<string>(args.controlId0)
  const [axisValue, setAxisValue] = useState<number>(0)

  useEffect(() => {
    if (isDummy) return
    initController()
  }, [])
  useEffect(() => {
    if (isDummy) return
    sendInput()
  }, [axisValue])

  const initController = async () => {
    try {
      await window.virtualAPI.connect("127.0.0.1", VIRTUAL_CONST.DEFAULT_PORT)
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