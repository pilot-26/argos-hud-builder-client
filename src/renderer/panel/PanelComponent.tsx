import React, { useEffect } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { Panel } from './data/penal'
import { Avionics } from '../avionics/data/avionics'
import { IAvionicsTemplate } from '../avionics/types'
import AvionicsBlock from '../avionics/AvionicsBlock'
import { RetroMFD } from './background/RetroMFD'
import { AVIONICS_CONST } from '../avionics/const'

export const PanelComponent: React.FC<{
  panelId: string
}> = (
{
  panelId
}) => {
  const [showBackgroundModal, setBackgroundModal] = React.useState(false)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [isLocked, setIsLocked] = React.useState(false)
  const [selectedAvionicsList, setSelectedAvionicsList] = React.useState<Avionics[]>([])
  const [panel, setPanel] = React.useState<Panel>()

  const loadPanel = async () => {
    const panelFromStorage = await Panel.getFromId(panelId)
    if (!panelFromStorage) return
    await panelFromStorage.build()
    setPanel(panelFromStorage)
    setSelectedAvionicsList(panelFromStorage.avionicsList)
  }

  const handleAvionicsDelete = async (id: string) => {
    await panel?.removeAvionics(id)
    loadPanel()
  }

  const handleAvionicsAdd = async (template: IAvionicsTemplate) => {
    await panel?.addAvionics(template)
    loadPanel()
    setShowAddModal(false)
  }

  useEffect(() => {
    loadPanel()
  }, [showAddModal])

  const handleLock = () => {
    setIsLocked(true)
    for (const item of selectedAvionicsList) {
      item.embedded.isLocked = true
      item.save()
    }
    setSelectedAvionicsList(selectedAvionicsList)
  }
  const handleUnlock = () => {
    setIsLocked(false)
    for (const item of selectedAvionicsList) {
      item.embedded.isLocked = false
      item.save()
    }
    setSelectedAvionicsList(selectedAvionicsList)
  }
  const handleBackground = () => {

  }

  const handleAdd = () => {
    setShowAddModal(true)
  }

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {selectedAvionicsList.map((item) => (
        <AvionicsBlock
          key={item.id}
          item={item}
          onDelete={handleAvionicsDelete}
        />
      ))}
      {/* <RetroMFD /> */}
      <div
        style={{
          position: 'absolute',
          bottom: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
          right: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <ButtonForMouse
          style={{
            ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
          }}
          styleHover={{
            backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
          }}
          onClick={() => {}}
        >
          Enable
        </ButtonForMouse>
        <ButtonForMouse
          style={{
            ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
          }}
          styleHover={{
            backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
          }}
          onClick={() => {}}
        >
          Background
        </ButtonForMouse>
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
      </div>
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: GLOBAL_COLOR.MASK,
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
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: "10px",
                gap: GLOBAL_STYLE.GLOBAL_PADDING,
              }}>
                {AVIONICS_CONST.AVIONICS_TEMPLATE_PRESET.map((item) => (
                  <ButtonForMouse
                    key={item.name}
                    style={{
                      position: "relative",
                      border: "none",
                      borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS_SMALL,
                      padding: GLOBAL_STYLE.GLOBAL_PADDING,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                    }}
                    styleHover={{
                      backgroundColor: GLOBAL_COLOR.MINIMUM,
                    }}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handleAvionicsAdd(item)
                    }}
                  >
                    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', transform: 'scale(0.5)' }}>
                      {item.avionicsComponent.getUIElement()}
                    </div>
                    <div style={GLOBAL_STYLE.GLOBAL_FONT_SECONDARY}>{item.name}</div>
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