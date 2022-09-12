import { Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { IRow } from "../../services/worksheet/row.interface";
import { RSJobBody, RSJobHeadings } from "../../state/globalstate";
import HelpTooltip from "../common/HelpTooltip.component";
import { IRawRouteTableData } from "../routes/interfaces/RawRouteDataTable.interface";
import ResultTable from "../routes/ResultTable/ResultTable.component";

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

    const [inSequenceJobBody, setInSequenceJobBody] = useState<IRow[]>([])

    useEffect(() => {
        createInSequenceJobBody(R_jobBody, waypointOrder)
    },[])

    function createInSequenceJobBody(jobBody: IRow[], waypointOrder: number[])
    {
        let jobBodyCopy = JSON.parse(JSON.stringify(jobBody)) 
        for(let i = 0; i< waypointOrder.length; i++)
        {
            const writebackRow = jobBodyCopy[waypointOrder[i]];
            const referenceRow = jobBody[i];
            for(let j = 0; j < writebackRow.cells.length; j++)
            {
                writebackRow.cells[j].x = referenceRow.cells[j].x
                writebackRow.cells[j].y = referenceRow.cells[j].y
                console.log(writebackRow.cells[j])
            }
        }
        setInSequenceJobBody(jobBodyCopy)
    }

    async function writeBackToSpreadsheet(body: IRow[])
    {

        Excel.run(async (context) => {
            let sheet = context.workbook.worksheets.getActiveWorksheet()
            for(let i = 0; i< body.length; i++)
            {
                const row = body[i];
                for(let j = 0; j < row.cells.length; j++)
                {
                    let range = sheet.getCell(row.cells[j].y - 1, row.cells[j].x - 1)
                    range.values = [[row.cells[j].data]]
                    range.format.autofitColumns();
                }
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