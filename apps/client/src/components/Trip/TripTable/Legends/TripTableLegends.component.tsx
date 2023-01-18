import { Grid, Stack} from "@mui/material"
import React from "react"

const TripTableLegends: React.FC = () => {
    return(
        <div>
            {/* <div className={"text-sm"}>Table Legends:</div> */}
            <div className={"flex flex-wrap"}>
                <Grid item xs="auto" sx={{margin: 0, padding: 0, marginRight: "0.5em"}}>
                    <Stack direction={"row"} spacing={0.1} alignItems="center">
                        <div className={"text-sm"}>
                            <div>Needs attention:</div>
                        </div>
                        <div className={" bg-orange-400 h-3 w-3"}>
                            
                        </div>
                    </Stack>
                </Grid>
                <Grid item xs="auto" sx={{margin: 0, padding: 0, marginRight: "0.5em"}}>
                    <Stack direction={"row"} spacing={0.1} alignItems="center">
                        <div className={"text-sm"}>
                            <div>Solved Address:</div>
                        </div>
                        <div className={" bg-green-700 h-3 w-3"}>
                            
                        </div>
                    </Stack>
                </Grid>

                <Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                    <Stack direction={"row"} spacing={0.1} alignItems="center">
                        <div className={"text-sm"}>
                            
                            <div>Data (Draggable):</div>
                        </div>
                        <div className={" bg-[#1976d2] h-3 w-3"}>
                            
                        </div>
                    </Stack>
                </Grid>
            </div>
        </div>
        
    )
}

export default TripTableLegends