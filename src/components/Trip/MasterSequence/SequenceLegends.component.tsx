import { Box, Grid, Stack, Typography } from "@mui/material"
import React from "react"

const SequenceLegends: React.FC = () => {
    return(
        <Box>
            <Typography variant="body2">Table Legends:</Typography>
            <Grid container sx={{paddingTop: "0.3em"}}>
                <Grid item xs="auto" sx={{margin: 0, padding: 0, marginRight: "0.5em"}}>
                    <Stack direction={"row"} spacing={0.1} alignItems="center">
                        <Box>
                            <Typography variant="body2">Needs attention:</Typography>
                        </Box>
                        <Box sx={{backgroundColor: "#ff9800", height: "1em", width: "1em"}}>
                            
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs="auto" sx={{margin: 0, padding: 0, marginRight: "0.5em"}}>
                    <Stack direction={"row"} spacing={0.1} alignItems="center">
                        <Box>
                            <Typography variant="body2">Solved Address:</Typography>
                        </Box>
                        <Box sx={{backgroundColor: "green", height: "1em", width: "1em"}}>
                            
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                    <Stack direction={"row"} spacing={0.1} alignItems="center">
                        <Box>
                            
                            <Typography variant="body2">Data (Draggable):</Typography>
                        </Box>
                        <Box sx={{backgroundColor: "#1976d2", height: "1em", width: "1em"}}>
                            
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
        
    )
}

export default SequenceLegends