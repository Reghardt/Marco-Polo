import { Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { IRow } from "../../services/worksheet/row.interface";
import { RSAddresColumIndex, RSJobBody } from "../../state/globalstate";
import HelpTooltip from "../common/HelpTooltip.component";

import SequenceTable from "./SequenceTable/SequenceTable.component";
import { createInSequenceJobBody, preSyncRowDataForWriteBack } from "./RouteSequence.service";

interface IRouteSequenceProps{
    waypointOrder: number[];
  }

enum EAddressType{
    Original,
    Google
}

const RouteSequence: React.FC<IRouteSequenceProps> = ({waypointOrder}) => {

    //const [writebackTable, setWritebackTable] = useState<IRawRouteTableData>({columnDesignations: [], firstRowIsHeading: false, headings: null, rows: []})
    
    const [addressType, setAddressType] = useState<EAddressType>(EAddressType.Original)

    
    const R_jobBody = useRecoilValue(RSJobBody)
    const R_addresColumIndex = useRecoilValue(RSAddresColumIndex)

    const [inSequenceJobBody, setInSequenceJobBody] = useState<IRow[]>([])

    useEffect(() => {
        if(waypointOrder.length > 0)
        {
            setInSequenceJobBody(createInSequenceJobBody(R_jobBody, waypointOrder, R_addresColumIndex))
        }
        
        
    },[waypointOrder])

    

    async function writeBackToSpreadsheet(body: IRow[])
    {

        Excel.run(async (context) => {
            let sheet = context.workbook.worksheets.getActiveWorksheet()
            for(let i = 0; i < body.length; i++)
            {
                preSyncRowDataForWriteBack(body[i], sheet)
            }
            

            await context.sync()
        })


    }

    return(

        <Box>
            {/* <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Sequence Table</Typography> */}

            {waypointOrder.length > 0 && (
                <div>
                    
                    <Stack spacing={1}>
                        <Box>
                            <Stack direction={"row"} spacing={1} alignItems="center">
                                <Box>
                                    <ToggleButtonGroup
                                        sx={{maxHeight:"100%", height: "100%"}}
                                        size="small"
                                        color="primary"
                                        value={addressType}
                                        exclusive
                                        onChange={(_e, v) => {setAddressType(v)}}
                                        aria-label="Address Type"
                                        >
                                            <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EAddressType.Original}>Original Addresses</ToggleButton>
                                            <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EAddressType.Google}>Google Maps Addresses</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                                <Box>
                                    <HelpTooltip title="Swap between the given addresses and the corresponding addresses found on google maps. The address type selected will be written back to the spreadsheet as shown in the table below."/>
                                </Box>
        
                            </Stack>
                        </Box>
                        <Box>
                            <Button variant="outlined">Reverse Order</Button>
                        </Box>
                    </Stack>
                    
                    <SequenceTable inSequenceJobBody={inSequenceJobBody} waypointOrder={waypointOrder}/>
                    <div style={{marginTop: "1em"}}>
                        <Button onClick={() => {writeBackToSpreadsheet(inSequenceJobBody)}}>Write back</Button>
                        <Button>Reset Spreadsheet</Button>
                    </div>
                </div>
            )}

            {waypointOrder.length === 0 && (
                <Typography variant="body1" gutterBottom>Once a trip has been generated the addresses and corresponding data will be displayed here in order of the shortest route. The data may then also be written back to Excel in that order.</Typography>
            )}

            
            
        </Box>
    )
}

export default RouteSequence