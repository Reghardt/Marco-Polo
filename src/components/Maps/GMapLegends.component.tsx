import { Box, Stack, Typography } from "@mui/material"
import React from "react"

const GMapLegends: React.FC = () => {
    return(
        <Stack>
            <Box>
                <Typography variant="h6">Map Legends </Typography>
            </Box>
            <Box>
                <Typography variant="body2">A, B, C.. = In Sequence Of Original Route </Typography>
            </Box>
            <Box>
                <Typography variant="body2">1, 2, 3.. = In Sequence Of Fastest Route </Typography>
            </Box>
            <Box>
                <Typography variant="body2">DEP = Departure, RET = Return, D+R = Departure + Return Address </Typography>
            </Box>
        </Stack>
    )
}

export default GMapLegends