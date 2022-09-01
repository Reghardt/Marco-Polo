import { Help } from "@mui/icons-material"
import Tooltip from "@mui/material/Tooltip"
import React from "react"

interface IHelpTooltipProps {
    title: string
}

const HelpTooltip: React.FC<IHelpTooltipProps> = ({title}) => {
    return(
        <Tooltip arrow title={<p style={{textTransform: "none", margin: "0"}}>{title}</p>} PopperProps={{sx: {TextTransform: "lowercase"}}}>
            <Help sx={{color:"gray"}}/>
        </Tooltip>
    )
}

export default HelpTooltip