import { Paper, Typography } from "@mui/material";
import React from "react"
import { IRawRouteTableData } from "../routes/interfaces/RawRouteDataTable.interface";
import ResultTable from "../routes/ResultTable/ResultTable.component";
import WriteBack from "../routes/writeback/Writeback.component";

interface RouteSequenceProps{
    rawRouteTableData: IRawRouteTableData;
    waypointOrder: number[];
  }

const RouteSequence: React.FC<RouteSequenceProps> = ({rawRouteTableData, waypointOrder}) => {
    return(
        <div>
            <Paper sx={{padding: "10px"}} variant="elevation" elevation={5}>
                <Typography variant="h5" gutterBottom >Route Sequence Table</Typography>
                <ResultTable rawRouteTableData={rawRouteTableData} waypointOrder={waypointOrder}/>
                <div style={{marginTop: "1em"}}>
                    <WriteBack rawRouteTableData={rawRouteTableData} waypointOrder={waypointOrder}/>
                </div>
                
            </Paper>
        </div>)
}

export default RouteSequence