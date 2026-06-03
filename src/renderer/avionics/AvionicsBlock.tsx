import React, { useEffect, useState } from 'react'
import { GenericEmbedded } from '../embedded/GenericEmbedded'
import { GLOBAL_STYLE } from '../style/style'
import ButtonForMouse from '../components/ButtonForMouse'
import { GLOBAL_COLOR } from '../style/color'
import { AiFillCloseCircle, AiFillSetting } from "react-icons/ai"
import { Avionics } from './data/avionics'

const AvionicsBlock: React.FC<{
	item: Avionics,
	onDelete?: (id: string) => void
}> = ({
	item,
	onDelete
}) => {
	const [isHover, setIsHover] = useState(false)

  const styles = {
    panelContent: {
      padding: '20px',
    },
    instrumentControlButton: {
      backgroundColor: GLOBAL_COLOR.TRANSPARENT,
      color: GLOBAL_COLOR.WHITE,
      border: "none",
      padding: GLOBAL_STYLE.GLOBAL_PADDING_SMALL,
      fontWeight: "normal",
      lineHeight: "20px",
      fontSize: GLOBAL_STYLE.GLOBAL_FONT_SECONDARY.fontSize,
    },
    instrumentControlButtonHover: {
      fontWeight: "bold",
      fontSize: GLOBAL_STYLE.GLOBAL_FONT_PRIMARY.fontSize,
    }
  }

	return (
    <GenericEmbedded 
      item={item.embedded} 
    >
      {!item.embedded.isLocked && (
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
          }}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <div
            style={{
              position: 'absolute',
              // top: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
              // right: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
              top: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1000,
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
