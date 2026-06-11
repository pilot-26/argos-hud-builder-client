import React, { useEffect } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { Panel } from './data/panel'
import { Avionics } from '../avionics/data/avionics'
import { IAvionicsTemplate } from '../avionics/types'
import AvionicsBlock from '../avionics/AvionicsBlock'
import { AVIONICS_CONST } from '../avionics/const'
import { OverlayLowProfile } from '../overlay/OverlayLowProfile'

enum EDIT_STAGE {
  PLACEMENT = "PLACEMENT",
  CONTENT = "CONTENT"
}

export const PanelEditComponent: React.FC<{
  overlayId: string,
  panelId: string
}> = ({
  overlayId,
  panelId
}) => {
  const [showBackgroundModal, setBackgroundModal] = React.useState(false)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [selectedAvionicsList, setSelectedAvionicsList] = React.useState<Avionics[]>([])
  const [panel, setPanel] = React.useState<Panel>()
  const [editStage, setEditStage] = React.useState<EDIT_STAGE>(EDIT_STAGE.PLACEMENT)
  
  useEffect(() => {
    loadPanel()
  }, [])

  const loadPanel = async () => {
    const panelFromStorage = await Panel.getFromId(panelId)
    if (!panelFromStorage) return
    await panelFromStorage.build()
    setPanel(panelFromStorage)
    setSelectedAvionicsList(panelFromStorage.avionicsList)
    console.log("panelFromStorage.avionicsList = " + JSON.stringify(selectedAvionicsList))
  }

  const handleAvionicsDelete = async (id: string) => {
    await panel?.removeAvionics(id)
    loadPanel()
  }

  const handleAvionicsAdd = async (template: IAvionicsTemplate) => {
    console.log("addAvionics")
    await panel?.addAvionics(template)
    loadPanel()
    setShowAddModal(false)
  }

  const handleBackground = () => {

  }

  const handleAdd = () => {
    setShowAddModal(true)
  }

  const handleDone = async () => {
    if (!panel) return
    await window.storage.flush()
    window.overlay.close(panel?.overlayOptionId)
  }

	const handleNext = async () => {
    setEditStage(EDIT_STAGE.CONTENT)
		window.overlay.pin(overlayId, true)
	}

  const handlePrevious = async () => {
    window.overlay.pin(overlayId, false)
    setEditStage(EDIT_STAGE.PLACEMENT)
  }

  return (
    <OverlayLowProfile
      overlayId={overlayId}
    >
      <div
        style={{
          ...GLOBAL_STYLE.GLOBAL_TEXT_TITLE,
          color: GLOBAL_COLOR.MINIMUM,
          position: 'absolute',
          top: `${GLOBAL_STYLE.GLOBAL_PADDING}`,
          left: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
          display: "flex",
          flexDirection: "row",
          gap: GLOBAL_STYLE.GLOBAL_GAP,
          zIndex: 1001,
        }}
      >
        <ButtonForMouse
          style={{
            ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
          }}
          styleHover={{
            background: GLOBAL_COLOR.BRAND_LITE,
          }}
          onClick={handleDone}
        >
          Done
        </ButtonForMouse>
        {editStage === EDIT_STAGE.PLACEMENT && (
          <ButtonForMouse
            style={{
              ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
            }}
            styleHover={{
              background: GLOBAL_COLOR.BRAND_LITE,
            }}
            onClick={handleNext}
          >
            Next
          </ButtonForMouse>
        )}
        {editStage === EDIT_STAGE.CONTENT && (
          <ButtonForMouse
            style={{
              ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_NEGATIVE,
            }}
            styleHover={{
              background: GLOBAL_COLOR.BRAND_LITE,
            }}
            onClick={handlePrevious}
          >
            Previous
          </ButtonForMouse>
        )}
      </div>
      {editStage === EDIT_STAGE.PLACEMENT && (
				<div // RESIZE AREA
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",

            background: GLOBAL_COLOR.BLACK,
            border: `1px solid ${GLOBAL_COLOR.MINIMUM}`,
            pointerEvents: "none",

						zIndex: 999,

						gap: GLOBAL_STYLE.GLOBAL_GAP,
						alignItems: "center",
						color: GLOBAL_COLOR.MINIMUM,
						textAlign: "center",
						alignSelf: "center",
					}}
					>
						<div style={{
							...GLOBAL_STYLE.GLOBAL_TEXT_PRIMARY,
							color: GLOBAL_COLOR.MINIMUM,
							}}
						>
							Left-click to drag
						</div>
						<div style={{
							...GLOBAL_STYLE.GLOBAL_TEXT_PRIMARY,
							color: GLOBAL_COLOR.MINIMUM,
							}}
						>
							Right-click to show menu
						</div>
					</div>
      )}
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: GLOBAL_COLOR.WHITE,
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      >
        {selectedAvionicsList.map((item) => (
          <AvionicsBlock
            key={item.id}
            isLocked={false}
            item={item}
            onDelete={handleAvionicsDelete}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            top: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
            right: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            zIndex: 0
          }}
        >
          {/* <ButtonForMouse
            style={{
              ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
            }}
            styleHover={{
              background: GLOBAL_COLOR.BRAND_LITE,  
            }}
            onClick={() => {}}
          >
            Background
          </ButtonForMouse> */}
          <ButtonForMouse
            style={{
              ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
            }}
            styleHover={{
              background: GLOBAL_COLOR.BRAND_LITE,
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
            background: GLOBAL_COLOR.MASK,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'white',
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
                        background: GLOBAL_COLOR.MINIMUM,
                      }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        handleAvionicsAdd(item)
                      }}
                    >
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', transform: 'scale(0.5)' }}>
                        {item.avionicsComponent.getUIElement()}
                      </div>
                      <div style={GLOBAL_STYLE.GLOBAL_TEXT_SECONDARY}>{item.name}</div>
                    </ButtonForMouse>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OverlayLowProfile>
  )
}