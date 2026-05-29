import React, { useEffect, useRef, useState } from 'react'
import GenericOverlay from './GenericOverlay'
import { GLOBAL_COLOR } from '../style/color'


const HOTASInput2Axis1: React.FC<{ overlayId: string }> = ({ overlayId }) => {

  useEffect(() => {

  }, [])

  return (
    <GenericOverlay overlayId={overlayId}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          border: `1px solid ${GLOBAL_COLOR.MINIMUM}`
        }}
      >
        
      </div>
    </GenericOverlay>
  )
}

export default HOTASInput2Axis1