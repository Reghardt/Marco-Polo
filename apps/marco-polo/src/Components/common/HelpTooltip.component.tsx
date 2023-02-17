import { Help } from "@mui/icons-material"
import Tooltip from "@mui/material/Tooltip"

interface IHelpTooltipProps {
    title: NonNullable<React.ReactNode>
}

const HelpTooltip: React.FC<IHelpTooltipProps> = ({title}) => {
    return(
        <Tooltip arrow title={title} PopperProps={{sx: {TextTransform: "lowercase"}}}>
            <Help sx={{color:"gray"}}/>
        </Tooltip>
    )
}

export default HelpTooltip