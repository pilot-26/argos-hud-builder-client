import React, { useEffect } from 'react'
import { Panel } from './data/panel'
import { Avionics } from '../avionics/data/avionics'
import AvionicsBlock from '../avionics/AvionicsBlock'
import { OverlayLowProfile } from '../overlay/OverlayLowProfile'

export const PanelComponent: React.FC<{
  overlayId: string,
  panelId: string
}> = ({
  overlayId,
  panelId
}) => {
  const [selectedAvionicsList, setSelectedAvionicsList] = React.useState<Avionics[]>([])
  const [panel, setPanel] = React.useState<Panel>()

  useEffect(() => {
    const loadPanel = async () => {
      const panelFromStorage = await Panel.getFromId(panelId)
      if (!panelFromStorage) return
      await panelFromStorage.build()
      setPanel(panelFromStorage)
      setSelectedAvionicsList(panelFromStorage.avionicsList)
      console.log("selectedAvionicsList = " + JSON.stringify(selectedAvionicsList))
    }
    loadPanel()
  }, [])

  if (panel) return (
    <OverlayLowProfile
      overlay={panel.overlay}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {selectedAvionicsList.map((item) => (
          <AvionicsBlock
            key={item.id}
            isLocked={true}
            item={item}
          />
        ))}
      </div>
    </OverlayLowProfile>
  )
}