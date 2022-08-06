import { Button, DialogActions, DialogContent, DialogTitle, Modal, Paper } from "@mui/material"
import React, { useEffect, useState } from "react"
import { ICellAndRange } from "../../interfaces/simpleInterfaces";
import { IRawRouteTableData } from "./interfaces/RawRouteDataTable.interface";


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

interface WriteBackProps{
    rawRouteTableData: IRawRouteTableData;
    waypointOrder: number[];
}

const WriteBack: React.FC<WriteBackProps> = ({rawRouteTableData, waypointOrder}) => {

    const [open, setOpen] = useState(false)
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

    //use worksheet.getCell(x, y) to get the range of a cell

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



    return(<div>
        <Button onClick={() => {setOpen(!open)}}>
            Writeback
        </Button>

        <Modal open={open}>
            <Paper sx={style}>
                <DialogTitle>Writeback options</DialogTitle>
                <DialogContent>
                    Test
                    <Button onClick={() => {writeBackToSpreadsheet(writebackTable)}}>Write back</Button>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {setOpen(!open)}}>Close</Button>
                </DialogActions>
                
                
            </Paper>
        </Modal>
    </div>)
}

export default WriteBack;