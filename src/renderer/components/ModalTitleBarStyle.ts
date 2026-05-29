export class ModalTitleBarStyle {
	static readonly titleBarStyle: React.CSSProperties = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '32px',
	}

	static readonly titleBarIconStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}

	static readonly titleBarTitleStyle: React.CSSProperties = {
		fontSize: '12px',
		fontWeight: 600,
		color: '#94a3b8',
		letterSpacing: '0.2px'
	}

	static readonly titleBarControlsStyle: React.CSSProperties = {
		display: 'flex',
	}

	static readonly titleBarButtonStyle: React.CSSProperties = {
		width: '46px',
		height: '32px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: 'none',
		backgroundColor: 'transparent',
		cursor: 'pointer',
		color: '#94a3b8',
		transition: 'background-color 0.15s ease'
	}

	static readonly titleBarButtonHoverStyle: React.CSSProperties = {
		backgroundColor: '#334155'
	}

	static readonly closeButtonHoverStyle: React.CSSProperties = {
		backgroundColor: '#ef4444',
		color: '#f8fafc'
	}
}
