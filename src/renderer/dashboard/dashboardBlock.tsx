import React, { useEffect, useState } from 'react'
import { Dashboard } from './data/dashboard'
import { GenericEmbedded } from '../embedded/GenericEmbedded'
import { GLOBAL_STYLE } from '../style/style'
import ButtonForMouse from '../components/ButtonForMouse'
import { GLOBAL_COLOR } from '../style/color'
import { AiFillCloseCircle } from "react-icons/ai";

const DashboardBlock: React.FC<{
	item: Dashboard,
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
      pEmbedded={item.embedded} 
    >
      {!item.isEmbeddedLocked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // zIndex: 1000,
            background: GLOBAL_COLOR.TRANSPARENT,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: GLOBAL_STYLE.GLOBAL_GAP,
          }}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <ButtonForMouse
            style={{
              position: 'absolute',
              top: `-${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
              right: `-${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
            }}
            styleHover={{
              transform: "scale(1.2)"
            }}
            onClick={() => {}}
          >
            <AiFillCloseCircle size={24} color={GLOBAL_COLOR.CAUTION} />
          </ButtonForMouse>
        </div>
      )}
      {item.template.instrumentComponent.getLogicElement({
        getUIElement: item.template.instrumentComponent.getUIElement,
        params: () => {
          const params: any = {}
          item.controlList?.forEach((each, index) => {
            params[`controlId${index}`] = each.id
          })
          return params
        }
      })}
    </GenericEmbedded>
  )
}

export default DashboardBlock
