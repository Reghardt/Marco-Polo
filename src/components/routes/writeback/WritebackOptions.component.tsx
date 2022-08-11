import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { IRawRouteTableData } from "../interfaces/RawRouteDataTable.interface";
import ResultTable from "../ResultTable/ResultTable.component";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    // bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

interface WritebackOptionsProps{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    rawRouteTableData: IRawRouteTableData;
    waypointOrder: number[];
}

const WritebackOptions: React.FC<WritebackOptionsProps> = ({open, setOpen, rawRouteTableData, waypointOrder}) => {

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
            setOpen(!open)
        })


    }

    return(
    <Paper sx={style}>
        {/* <DialogTitle>Writeback options</DialogTitle> */}
        <DialogContent>
        <Typography variant="h5" gutterBottom>Route Sequence Table</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Postal Code" />
                <FormControlLabel control={<Checkbox defaultChecked />} label="Country" />
            </FormGroup>
            <ResultTable rawRouteTableData={rawRouteTableData} waypointOrder={waypointOrder}/>
            
            <Button onClick={() => {writeBackToSpreadsheet(writebackTable)}} sx={{marginTop: "1em"}}>Write back</Button>
        </DialogContent>

        <DialogActions>
            <Button onClick={() => {setOpen(!open)}}>Close</Button>
        </DialogActions>
        
        
    </Paper>)
}

export default WritebackOptions