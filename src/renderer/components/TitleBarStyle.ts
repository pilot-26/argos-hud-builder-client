export class TitleBarStyle {
    static readonly titleBarStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '32px',
        background: '#1e293b',
        borderBottom: '1px solid #334155',
    }

    static readonly titleBarDragRegionStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 12px',
    }

    static readonly titleBarIconStyle: React.CSSProperties = {
        color: '#f8fafc',
        fontSize: '14px',
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
        background: 'transparent',
        cursor: 'pointer',
        color: '#94a3b8',
        transition: 'background-color 0.15s ease'
    }

    static readonly titleBarButtonHoverStyle: React.CSSProperties = {
        background: '#334155'
    }

    static readonly closeButtonHoverStyle: React.CSSProperties = {
        background: '#ef4444',
        color: '#f8fafc'
    }
}
