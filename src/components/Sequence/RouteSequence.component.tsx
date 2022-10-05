// import { Box, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react"
// import { useRecoilValue } from "recoil";
// import { IRow } from "../../services/worksheet/row.interface";
// import { RSAddresColumIndex, RSInSequenceTripRows, RSTripRows } from "../../state/globalstate";

// import SequenceTable from "./SequenceTable/SequenceTable.component";



// const RouteSequence: React.FC = () => {

//     const R_inSequenceTripRows = useRecoilValue(RSInSequenceTripRows)

    



//     return(

//         <Box>
//             {/* <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Sequence Table</Typography> */}

//             {R_inSequenceTripRows.length > 0 && (
//                 <div>
//                     <SequenceTable/>
                    
//                 </div>
//             )}

//             {R_inSequenceTripRows.length === 0 && (
//                 <Typography variant="body1" gutterBottom>Once a trip has been generated the addresses and corresponding data will be displayed here in order of the shortest route. The data may then also be written back to Excel in that order.</Typography>
//             )}

            
            
//         </Box>
//     )
// }

// export default RouteSequence