import { GLOBAL_COLOR } from "./color";

export const GLOBAL_STYLE = {
	GLOBAL_PADDING: '12px',
	GLOBAL_PADDING_SMALL: '8px',
	GLOBAL_BORDER_RADIUS: '6px',
	GLOBAL_BORDER_RADIUS_SMALL: '4px',
	GLOBAL_GAP: '12px',
	GLOBAL_FONT_PRIMARY: {
		fontSize: '14px',
		fontWeight: 600,
		color: GLOBAL_COLOR.PRIMARY,
		letterSpacing: '0.2px'
	},
	GLOBAL_FONT_SECONDARY: {
		fontSize: '12px',
		fontWeight: 400,
		color: GLOBAL_COLOR.SECONDARY,
		letterSpacing: '0.2px'
	},
	GLOBAL_FONT_TERTIARY: {
		fontSize: '10px',
		fontWeight: 400,
		color: GLOBAL_COLOR.TERTIARY,
		letterSpacing: '0.2px'
	},
	GLOBAL_FONT_MINIMUM: {
		fontSize: '6px',
		fontWeight: 400,
		color: GLOBAL_COLOR.MINIMUM,
		letterSpacing: '0.2px'
	},
	GLOBAL_BUTTON_TEXT_POSITIVE: {
		padding: '8px 16px',
		borderRadius: '6px',
		border: 'none',
		backgroundColor: GLOBAL_COLOR.BRAND,
		color: GLOBAL_COLOR.WHITE,
		cursor: 'pointer',
		transition: 'background-color 0.15s ease'
	},
	GLOBAL_BUTTON_TEXT_NEGATIVE: {
		padding: '8px 16px',
		borderRadius: '6px',
		border: `1px solid ${GLOBAL_COLOR.BRAND}`,
		backgroundColor: GLOBAL_COLOR.TRANSPARENT,
		color: GLOBAL_COLOR.BRAND,
		cursor: 'pointer',
		transition: 'background-color 0.15s ease'
	},
	GLOBAL_BUTTON_TEXT_CAUTION: {
		padding: '8px 16px',
		borderRadius: '6px',
		border: 'none',
		backgroundColor: GLOBAL_COLOR.CAUTION,
		color: GLOBAL_COLOR.WHITE,
		cursor: 'pointer',
		transition: 'background-color 0.15s ease'
	},
	GLOBAL_BOTTUN_ICON: {
		width: '24px',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
}