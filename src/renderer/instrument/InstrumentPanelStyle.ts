import { GLOBAL_COLOR } from "../style/color"
import { GLOBAL_STYLE } from "../style/style"

export const instrumentPanelStyle = {
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