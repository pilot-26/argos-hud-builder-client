import React, { useEffect, useState } from 'react'
import { GenericEmbedded } from '../embedded/GenericEmbedded'
import { GLOBAL_STYLE } from '../style/style'
import ButtonForMouse from '../components/ButtonForMouse'
import { GLOBAL_COLOR } from '../style/color'
import { AiFillCloseCircle, AiFillSetting } from "react-icons/ai"
import { Avionics } from './data/avionics'

const AvionicsBlock: React.FC<{
	item: Avionics,
  isLocked: boolean,
	onDelete?: (id: string) => void
}> = ({
	item,
	isLocked = true,
	onDelete
}) => {
	const [isHover, setIsHover] = useState(false)

	return (
    <GenericEmbedded 
      item={item.embedded}
      isLocked={isLocked}
    >
      {!isLocked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: GLOBAL_COLOR.TRANSPARENT,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: GLOBAL_STYLE.GLOBAL_GAP,
            boxSizing: 'border-box',
          }}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              zIndex: 120,
            }}
          >
            <ButtonForMouse
              styleHover={{
                transform: "scale(1.2)"
              }}
              onClick={() => {}}
            >
              <AiFillSetting size={24} color={GLOBAL_COLOR.MINIMUM} />
            </ButtonForMouse>
            <ButtonForMouse
              styleHover={{
                transform: "scale(1.2)"
              }}
              onClick={() => {}}
            >
              <AiFillCloseCircle size={24} color={GLOBAL_COLOR.MINIMUM} />
            </ButtonForMouse>
          </div>
        </div>
      )}
      {item.template.avionicsComponent.getLogicElement({
        getUIElement: item.template.avionicsComponent.getUIElement,
        params: () => {
          const params: any = {
            isActive: true
          }
          item.controlList?.forEach((each, index) => {
            params[`controlId${index}`] = each.id
          })
          return params
        }
      })}
    </GenericEmbedded>
  )
}

export default AvionicsBlock
