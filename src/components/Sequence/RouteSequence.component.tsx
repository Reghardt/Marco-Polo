import { Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { IRawRouteTableData } from "../routes/interfaces/RawRouteDataTable.interface";
import ResultTable from "../routes/ResultTable/ResultTable.component";

interface RouteSequenceProps{
    rawRouteTableData: IRawRouteTableData;
    waypointOrder: number[];
  }

const RouteSequence: React.FC<RouteSequenceProps> = ({rawRouteTableData, waypointOrder}) => {

    const [writebackTable, setWritebackTable] = useState<IRawRouteTableData>({headings: [], rows: []})

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
            <Paper sx={{padding: "10px"}} variant="elevation" elevation={5}>
                <Typography variant="h5" gutterBottom >Route Sequence Table</Typography>
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