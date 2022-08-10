import { Button, DialogActions, DialogContent, DialogTitle, Modal, Paper } from "@mui/material"
import React, { useEffect, useState } from "react"
import { ICellAndRange } from "../../../interfaces/simpleInterfaces";
import { IRawRouteTableData } from "../interfaces/RawRouteDataTable.interface";
import WritebackOptions from "./WritebackOptions.component";




interface WriteBackProps{
    rawRouteTableData: IRawRouteTableData;
    waypointOrder: number[];
}

const WriteBack: React.FC<WriteBackProps> = ({rawRouteTableData, waypointOrder}) => {

    const [open, setOpen] = useState(false)


    //use worksheet.getCell(x, y) to get the range of a cell



    return(<div>
        <Button onClick={() => {setOpen(!open)}}>
            Writeback
        </Button>

        <Modal open={open}>
            <div>
                <WritebackOptions open={open} setOpen={setOpen} rawRouteTableData={rawRouteTableData} waypointOrder={waypointOrder}/>
            </div>
                
        </Modal>
    </div>)
}

export default WriteBack;