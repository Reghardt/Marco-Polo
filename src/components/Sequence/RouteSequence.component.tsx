import { Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import HelpTooltip from "../common/HelpTooltip.component";
import { IRawRouteTableData } from "../routes/interfaces/RawRouteDataTable.interface";
import ResultTable from "../routes/ResultTable/ResultTable.component";

interface RouteSequenceProps{
    rawRouteTableData: IRawRouteTableData;
    waypointOrder: number[];
  }

enum EAddressType{
    Original,
    Google
}

const RouteSequence: React.FC<RouteSequenceProps> = ({rawRouteTableData, waypointOrder}) => {

    const [writebackTable, setWritebackTable] = useState<IRawRouteTableData>({headings: [], rows: []})
    const [addressType, setAddressType] = useState<EAddressType>(EAddressType.Original)

    useEffect(() => {
        createWritebackTable(rawRouteTableData, waypointOrder)
    },[])

    function createWritebackTable(rawRouteTableDataRef: IRawRouteTableData, waypointOrder: number[])
    {
        let tempWritebackTable = JSON.parse(JSON.stringify(rawRouteTableData)) as IRawRouteTableData;
        for(let i = 0; i< waypointOrder.length; i++)
        {
            const writebackRow = tempWritebackTable.rows[waypointOrder[i]];
            const referencekRow = rawRouteTableDataRef.rows[i];
            for(let j = 0; j < writebackRow.cells.length; j++)
            {
                writebackRow.cells[j].x = referencekRow.cells[j].x
                writebackRow.cells[j].y = referencekRow.cells[j].y
                console.log(writebackRow.cells[j])
            }
        }
        setWritebackTable(tempWritebackTable)
    }

    async function writeBackToSpreadsheet(writebackTableParam: IRawRouteTableData)
    {

        Excel.run(async (context) => {
            let sheet = context.workbook.worksheets.getActiveWorksheet()
            for(let i = 0; i< writebackTableParam.rows.length; i++)
            {
                const row = writebackTableParam.rows[i];
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
                
                <ResultTable rawRouteTableData={rawRouteTableData} waypointOrder={waypointOrder}/>
                <div style={{marginTop: "1em"}}>
                    {/* <WriteBack rawRouteTableData={writebackTable} waypointOrder={waypointOrder}/> */}
                    <Button onClick={() => {writeBackToSpreadsheet(writebackTable)}}>Write back</Button>
                    <Button>Reset Spreadsheet</Button>
                </div>
                
            </Paper>
        </div>)
}

export default RouteSequence