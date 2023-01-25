import { Box,Typography } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import React from "react"
import { useTripStore } from "../../Zustand/tripStore";
import NivoCostGraph from "./NivoCostGraph.component";
import NivoDistanceGraph from "./NivoDistanceGraph.component";
// import { useGetMemberDataQuery, useGetVehicleByIdQuery } from "../../trpc-hooks/trpcHooks";
// import { useTripStore } from "../../Zustand/tripStore";


// import CostGraph from "./CostGraph.component";
// import DistanceGraph from "./DistanceGraph.component";
// import TimeGraph from "./TimeGraph.component";

// enum EGraphType{
//     Distance,
//     Time,
//     Cost
// }

const Statistics: React.FC = () => {

    const Z_tripDirections = useTripStore(state => state.data.tripDirections)
    // const [graphType, setGraphType] = useState<EGraphType>(EGraphType.Time)

    // const [fuelPrice, setFuelPrice] = useState("")
    // const [litersKm, setLitersKm] = useState("")

    // const ZF_setVehicle = useTripStore(state => state.actions.setVehicle)
    // const Z_vehicle = useTripStore(state => state.data.vehicle)

    ChartJS.register(CategoryScale, LinearScale,PointElement, LineElement, BarElement, Title, Tooltip, Legend)

    // if(Z_tripDirections)
    // {
    //     Z_tripDirections.forEach(section => {
    //         section.legs.forEach(leg => {
    //             console.log(leg)

    //             tolls.forEach(toll => {
    //                 if(google.maps.geometry.poly.isLocationOnEdge(toll.coordinates, leg.polyLine!, 10e-4))
    //                 {
    //                     console.log("passes", toll.name)
    //                 }
    //                 else
    //                 {
    //                     console.log("does not pass", toll.name)
    //                 }
    //             })
                
    //         })
    //     })
    // }
    

    // function secondsToH_M(value: number)
    // {
    //     const minutes = value / 60
        
    //     const hours = Math.floor(minutes / 60)
    //     const remainingMinutes = Math.floor(minutes % 60)
    //     return hours + "h:" + remainingMinutes + "m"
    // }


    // function calculateSimpleStatistics()
    // {
    //     console.log("calculate trip directions fired")
    //     if(Z_tripDirections)
    //     {
    //         const legs = Z_tripDirections?.result?.routes[0]?.legs
    //         let roundTripDistance = 0;
    //         let roundTripTime = 0;

    //         if(legs)
    //         {
    //             for(let i = 0; i < legs.length; i++)
    //             {
    //                 roundTripDistance += legs[i]?.distance?.value ?? 0
    //                 roundTripTime += legs[i]?.duration?.value ?? 0
    //             }
    //         }

    //         return(
    //             <React.Fragment>
    //                 <Stack sx={{marginBottom: "0.5em"}}>
    //                     <Box>
    //                         <Typography variant="body1">Round Trip Distance: {Math.floor(roundTripDistance / 1000) + "km"}</Typography>
    //                     </Box>
    //                     <Box>
    //                         <Typography variant="body1">Estimated Round Trip Time: {secondsToH_M(roundTripTime)}</Typography>
    //                     </Box>
    //                 </Stack>
                    
    //             </React.Fragment>
                
    //         )
    //     }
    //     else
    //     {
    //         return <></>
    //     }
        
    // }

    // const memberQuery = useGetMemberDataQuery()
    // const vehicleQuery = useGetVehicleByIdQuery(memberQuery.data?.lastUsedVehicleId ? memberQuery.data.lastUsedVehicleId : "")

    // useEffect( () => {
    //     if(vehicleQuery.data?.vehicle)
    //     {
    //         ZF_setVehicle(vehicleQuery.data.vehicle)
    //         setLitersKm(vehicleQuery.data.vehicle.litersPer100km.toString())
    //     }
    // }, [vehicleQuery.isFetched])

    // useEffect(() => {
    //     if(Z_vehicle)
    //     {
    //         setLitersKm(Z_vehicle.litersPer100km.toString())
    //     }
        
    // }, [Z_vehicle])

    // useEffect(() => {
    //     if(memberQuery.data?.lastUsedFuelPrice)
    //     {
    //         setFuelPrice(memberQuery.data?.lastUsedFuelPrice.toString())
    //     }

    // }, [memberQuery.isFetched])
    
    return(
        <Box>
            <Typography variant="h6" gutterBottom sx={{color:"#1976d2"}}>Trip Statistics</Typography>

            {/* {calculateSimpleStatistics()} */}

            {/* <ToggleButtonGroup
                sx={{marginBottom: "0.5em"}}
                size="small"
                color="primary"
                value={graphType}
                exclusive
                onChange={(_e, v) => {
                    if(v !== null)
                    {
                        setGraphType(v)
                    } 
                }}
                aria-label="Address Type"
                >
                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EGraphType.Time}>Time</ToggleButton>
                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EGraphType.Distance}>Distance</ToggleButton>
                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EGraphType.Cost}>Cost</ToggleButton>
            </ToggleButtonGroup> */}

            {/* {graphType === EGraphType.Time && (
                <TimeGraph tripDirections={Z_tripDirections}/>
            )}

            {graphType === EGraphType.Distance && (
                <DistanceGraph tripDirections={Z_tripDirections}/>
            )}

            {graphType === EGraphType.Cost && (
                <CostGraph tripDirections={Z_tripDirections} fuelPrice={fuelPrice} litersKm={litersKm} setFuelPrice={setFuelPrice} setLitersKm={setLitersKm}/>
            )} */}

            <NivoCostGraph/>
            {Z_tripDirections && <NivoDistanceGraph tripDirections={Z_tripDirections}/>}
            

        </Box>
    )
}

export default Statistics