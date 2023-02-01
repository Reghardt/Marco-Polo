import { Box } from "@mui/material";
import React, { useState } from "react"
import { useTripStore } from "../../Zustand/tripStore";
import NivoCostGraph from "./NivoCostGraph.component";
import NivoDistanceGraph from "./NivoDistanceGraph.component";
import NivoTimeGraph from "./NivoTimeGraph.component";
import VehicleSelector from "./VehicleSelector.component";


const Statistics: React.FC = () => {

    const Z_tripDirections = useTripStore(state => state.data.tripDirections)
    // const [graphType, setGraphType] = useState<EGraphType>(EGraphType.Time)

    const [fuelPrice, setFuelPrice] = useState("")
    const [litersKm, setLitersKm] = useState("")
   
    return(
        <Box>
            {/* <Typography variant="h6" gutterBottom sx={{color:"#1976d2"}}>Trip Statistics</Typography> */}

            {/* {calculateSimpleStatistics()} */}

            

            



            {Z_tripDirections && Z_tripDirections.legGroups.length > 0 &&
                <div className={"space-y-4"}>
                    <NivoCostGraph fuelPrice={fuelPrice} litersKm={litersKm} tripDirections={Z_tripDirections}/>
                    <VehicleSelector setLitersKm={setLitersKm} setFuelPrice={setFuelPrice} fuelPrice={fuelPrice} litersKm={litersKm}/>
                    <NivoDistanceGraph tripDirections={Z_tripDirections}/>
                    <NivoTimeGraph tripDirections={Z_tripDirections}/>
                </div>
            }

        
        </Box>
    )
}

export default Statistics