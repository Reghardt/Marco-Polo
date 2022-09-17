import { Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { IRow } from "../../services/worksheet/row.interface";
import { RSAddresColumIndex, RSJobBody } from "../../state/globalstate";
import HelpTooltip from "../common/HelpTooltip.component";

import ResultTable from "./ResultTable/ResultTable.component";
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
        setInSequenceJobBody(createInSequenceJobBody(R_jobBody, waypointOrder, R_addresColumIndex))
        
    },[])

    

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
        <div>
            <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
                <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Sequence Table</Typography>

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
                
                <ResultTable inSequenceJobBody={inSequenceJobBody} waypointOrder={waypointOrder}/>
                <div style={{marginTop: "1em"}}>
                    <Button onClick={() => {writeBackToSpreadsheet(inSequenceJobBody)}}>Write back</Button>
                    <Button>Reset Spreadsheet</Button>
                </div>
                
            </Paper>
        </div>)
}

export default RouteSequence