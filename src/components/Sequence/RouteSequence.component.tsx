import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useRecoilValue } from "recoil";
import { IRow } from "../../services/worksheet/row.interface";
import { RSAddresColumIndex, RSJobBody } from "../../state/globalstate";

import SequenceTable from "./SequenceTable/SequenceTable.component";
import { createInSequenceJobBody } from "./RouteSequence.service";

interface IRouteSequenceProps{
    waypointOrder: number[];
  }

const RouteSequence: React.FC<IRouteSequenceProps> = ({waypointOrder}) => {

    //const [writebackTable, setWritebackTable] = useState<IRawRouteTableData>({columnDesignations: [], firstRowIsHeading: false, headings: null, rows: []})
    
    const R_jobBody = useRecoilValue(RSJobBody)

    const [inSequenceJobBody, setInSequenceJobBody] = useState<IRow[]>([])

    useEffect(() => {
        if(waypointOrder.length > 0)
        {
            setInSequenceJobBody(createInSequenceJobBody(R_jobBody, waypointOrder))
        }
    },[waypointOrder])

    



    return(

        <Box>
            {/* <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Sequence Table</Typography> */}

            {waypointOrder.length > 0 && (
                <div>
                    
                    
                    
                    <SequenceTable inSequenceJobBody={inSequenceJobBody} waypointOrder={waypointOrder}/>
                    
                </div>
            )}

            {waypointOrder.length === 0 && (
                <Typography variant="body1" gutterBottom>Once a trip has been generated the addresses and corresponding data will be displayed here in order of the shortest route. The data may then also be written back to Excel in that order.</Typography>
            )}

            
            
        </Box>
    )
}

export default RouteSequence