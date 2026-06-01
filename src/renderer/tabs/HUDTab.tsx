import React, { useEffect } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { IInstrumentTemplate, } from '../instrument/types'
import { INSTRUMENT_CONST } from '../instrument/const'
import HUDBlock from '../HUD/HUDBlock'
import { HUDStorage } from '../HUD/util/HUDStorage'
import { HUD } from '../HUD/data/HUD'
import { HUDOption } from '../HUD/data/HUDOption'
import { OverlayStorage } from '../overlay/util/overlayStorage'
import { Overlay } from '../overlay/data/overlay'

const HUDTab: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [selectedHUDList, setSelectedHUDList] = React.useState<HUD[]>([])

  const loadInstrument = async () => {
    const saved = await HUDStorage.list()
    setSelectedHUDList(saved)
  }

  const handleHUDDelete = async (id: string) => {
    await HUDStorage.remove(id)
    loadInstrument()
  }

  const handleInstrumentAdd = async (item: IInstrumentTemplate) => {
    const newInstrumentOption = new HUDOption(item).build()
    const newOverlay = new Overlay(newInstrumentOption.overlayOption)
    OverlayStorage.set(newOverlay)
    
    const newInstrument = new HUD(newInstrumentOption)
    await newInstrument.build()
    HUDStorage.set(newInstrument)

    loadInstrument()

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
        {selectedHUDList.map((item) => (
          <HUDBlock
            key={item.id}
            item={item}
            onDelete={handleHUDDelete}
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
                {INSTRUMENT_CONST.INSTRUMENT_TEMPLATE_PRESET.map((item) => (
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

export default HUDTab
