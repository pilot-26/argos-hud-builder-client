import React, { useEffect, useState } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { IInstrumentTemplate, EInstrumentType, IInstrument } from './data/types'
import { v4 as uuidv4 } from 'uuid'
import { INSTRUMENT_CONST } from './const/instrumentConst'
import InstrumentButton from './InstrumentButton'
import { OverlayStorage } from '../overlay/overlayStorage'
import { OVERLAY_CONST } from '../../main/overlay/const/overlayConst'
import { InstrumentStorage } from './instrumentStorage'
import { IOverlay } from '../overlay/data/types'

const instrumentTemplateList: IInstrumentTemplate[] = [
  {
    name: "HOTAS Input 2 Axis",
    type: EInstrumentType.HOTAS_INPUT,
    route: INSTRUMENT_CONST.HOTAS_INPUT_2_AXIS_1_ROUTE,
    isInteractable: false,
    fixedAspectRatio: 1,
  },
  {
    name: "HOTAS Input 3 Axis",
    type: EInstrumentType.HOTAS_INPUT,
    route: INSTRUMENT_CONST.HOTAS_INPUT_3_AXIS_1_ROUTE,
    isInteractable: false,
    fixedAspectRatio: 1,
  },
  {
    name: "Virtual Axis 1",
    type: EInstrumentType.VIRTUAL_CONTROLLER,
    route: INSTRUMENT_CONST.VIRTUAL_AXIS_1_ROUTE,
    isInteractable: true,
  }
]

const InstrumentPanel: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [selectedInstrumentList, setSelectedInstrumentList] = React.useState<IInstrument[]>([])

  const loadInstrument = async () => {
    const saved = await InstrumentStorage.getInstrumentList()
    setSelectedInstrumentList(saved)
  }

  const handleInstrumentDelete = (id: string) => {
    const newList = selectedInstrumentList.filter((item) => item.id !== id)
    InstrumentStorage.setInstrumentList(newList)
    loadInstrument()
  }

  const handleInstrumentAdd = (item: IInstrumentTemplate) => {
    const overlayId = uuidv4()
    const newOverlay: IOverlay = {
      isInteractable: item.isInteractable,
      id: overlayId,
      route: item.route,

      isEnabled: false,
      isPinned: false,
      isMaximized: false,
      width: OVERLAY_CONST.DEFAULT_WIDTH,
      height: OVERLAY_CONST.DEFAULT_HEIGHT,
      x: OVERLAY_CONST.DEFAULT_POSITION_X,
      y: OVERLAY_CONST.DEFAULT_POSITION_Y,
      fixedAspectRatio: item.fixedAspectRatio,
    }
    const newInstrument: IInstrument = {
      ...item,
      id: uuidv4(),
      overlayId: overlayId,
    }
    OverlayStorage.setOverlay(newOverlay)
    const newList = [...selectedInstrumentList, newInstrument]
    setSelectedInstrumentList(newList)
    InstrumentStorage.setInstrumentList(newList)

    setShowAddModal(false)
  }

  useEffect(() => {
    loadInstrument()
  }, [showAddModal])

  const handleAdd = () => {
    setShowAddModal(true)
  }

  return (
    <div style={{
      padding: GLOBAL_STYLE.GLOBAL_PADDING,
      display: "flex",
      flexDirection: "column",
      gap: GLOBAL_STYLE.GLOBAL_GAP,
    }}>
      <div style={{
        marginBottom: GLOBAL_STYLE.GLOBAL_PADDING,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: GLOBAL_STYLE.GLOBAL_GAP,
        gap: GLOBAL_STYLE.GLOBAL_GAP,
      }}>
        {selectedInstrumentList.map((item) => (
          <InstrumentButton
            key={item.id}
            item={item}
            onDelete={handleInstrumentDelete}
          />
        ))}
      </div>
      <ButtonForMouse
        style={{
          ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
        }}
        styleHover={{
          backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
        }}
        onClick={handleAdd}
      >
        Add
      </ButtonForMouse>
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: GLOBAL_COLOR.TRANSPARENT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS,
            width: '80%',
            height: '80%',
            overflow: 'auto',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
          }}>
            <ModalTitleBar onClose={() => setShowAddModal(false)} />
            <div style={{
              padding: GLOBAL_STYLE.GLOBAL_PADDING,
            }}>
              <div style={{
                marginBottom: GLOBAL_STYLE.GLOBAL_PADDING,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridGap: "10px",
                gap: GLOBAL_STYLE.GLOBAL_PADDING,
              }}>
                {instrumentTemplateList.map((item) => (
                  <ButtonForMouse
                    key={item.name}
                    style={{
                      border: "none",
                      borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS_SMALL,
                      padding: GLOBAL_STYLE.GLOBAL_PADDING_SMALL,
                      height: '50vh',
                    }}
                    styleHover={{
                      backgroundColor: GLOBAL_COLOR.MINIMUM,
                    }}
                    onClick={() => handleInstrumentAdd(item)}
                  >
                    {item.name}
                  </ButtonForMouse>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstrumentPanel
