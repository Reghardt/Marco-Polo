import { Box } from "@mui/material";
import React from "react"

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

export function a11yProps(index: number) {
return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
};
}

const TabPanel: React.FC<ITabPanelProps> = ({index, value, children, ...other}) => {
    return(
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box sx={{ pt: "0.5em" }}>
                    {children}
                </Box>
            )}
        </div>
    )
}

export default TabPanel