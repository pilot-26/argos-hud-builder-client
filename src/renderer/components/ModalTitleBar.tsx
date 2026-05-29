import React, { useState } from 'react'
import { AiOutlineClose, } from "react-icons/ai"
import { ModalTitleBarStyle } from "./ModalTitleBarStyle"

const ModalTitleBar: React.FC<{
	onClose: () => void
}> = ({
	onClose
}) => {
		const [hoveredButton, setHoveredButton] = useState<string | null>(null)

		return (
			<div style={ModalTitleBarStyle.titleBarStyle}>
				<div style={ModalTitleBarStyle.titleBarControlsStyle}>
					<button
						style={{
							...ModalTitleBarStyle.titleBarButtonStyle,
							...(hoveredButton === 'close' ? ModalTitleBarStyle.closeButtonHoverStyle : {})
						}}
						onClick={onClose}
						onMouseEnter={() => setHoveredButton('close')}
						onMouseLeave={() => setHoveredButton(null)}
					>
						<AiOutlineClose />
					</button>
				</div>
			</div>
		)
	}

export default ModalTitleBar