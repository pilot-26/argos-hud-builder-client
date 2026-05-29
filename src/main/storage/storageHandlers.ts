import { ipcMain } from 'electron'
import { FileStorage } from './fileStorage'
import { IInstrument } from '../instrument/data/types'
import { IOverlay } from '../overlay/data/types'

const INSTRUMENT_LIST_FILENAME = 'instrumentList.json'
const OVERLAYS_DIR = 'overlays'

ipcMain.handle('storage:getInstrumentList', () => {
  return FileStorage.readJson<IInstrument[]>(INSTRUMENT_LIST_FILENAME) || []
})

ipcMain.handle('storage:setInstrumentList', (_, instrumentList: IInstrument[]) => {
  FileStorage.writeJson(INSTRUMENT_LIST_FILENAME, instrumentList)
})

ipcMain.handle('storage:getOverlay', (_, id: string) => {
  const overlayFilename = `${OVERLAYS_DIR}/${id}.json`
  return FileStorage.readJson<IOverlay>(overlayFilename)
})

ipcMain.handle('storage:setOverlay', (_, overlay: IOverlay) => {
  const overlayFilename = `${OVERLAYS_DIR}/${overlay.id}.json`
  FileStorage.writeJson(overlayFilename, overlay)
})
