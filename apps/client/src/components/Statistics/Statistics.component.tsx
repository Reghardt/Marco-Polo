import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import React, {useEffect, useState } from "react"
import { useGetMemberDataQuery, useGetVehicleByIdQuery } from "../../trpc-hooks/trpcHooks";
import { useTripStore } from "../../Zustand/tripStore";


import CostGraph from "./CostGraph.component";
import DistanceGraph from "./DistanceGraph.component";
import TimeGraph from "./TimeGraph.component";

enum EGraphType{
    Distance,
    Time,
    Cost
}

const Statistics: React.FC = () => {

    const R_tripDirections = useTripStore(state => state.data.tripDirections)
    const [graphType, setGraphType] = useState<EGraphType>(EGraphType.Time)

    const [fuelPrice, setFuelPrice] = useState("")
    const [litersKm, setLitersKm] = useState("")

    const ZF_setVehicle = useTripStore(state => state.reducers.setVehicle)
    const Z_vehicle = useTripStore(state => state.data.vehicle)

    // const R_bearer = useAccountStore(state => state.values.bearer)
    // const R_workspaceId = useAccountStore(state => state.values.workspaceId)

    //const R_memberData = useRecoilValue(RSMemberData)

    //const [R_selectedVehicle, R_setSelectedVehicle] = useRecoilState(RSSelectedVehicle)

    ChartJS.register(CategoryScale, LinearScale,PointElement, LineElement, BarElement, Title, Tooltip, Legend)

    function secondsToH_M(value: number)
    {
        const minutes = value / 60
        
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = Math.floor(minutes % 60)
        return hours + "h:" + remainingMinutes + "m"
    }


    function calculateSimpleStatistics()
    {
        if(R_tripDirections && R_tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            const legs = R_tripDirections?.result?.routes[0]?.legs
            let roundTripDistance = 0;
            let roundTripTime = 0;

            if(legs)
            {
                for(let i = 0; i < legs.length; i++)
                {
                    roundTripDistance += legs[i]?.distance?.value ?? 0
                    roundTripTime += legs[i]?.duration?.value ?? 0
                }
            }

            return(
                <React.Fragment>
                    <Stack sx={{marginBottom: "0.5em"}}>
                        <Box>
                            <Typography variant="body1">Round Trip Distance: {Math.floor(roundTripDistance / 1000) + "km"}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1">Estimated Round Trip Time: {secondsToH_M(roundTripTime)}</Typography>
                        </Box>
                    </Stack>
                    
                </React.Fragment>
                
            )
        }
        else
        {
            return <></>
        }
        
    }

    const memberQuery = useGetMemberDataQuery()
    const vehicleQuery = useGetVehicleByIdQuery(memberQuery.data?.lastUsedVehicleId ? memberQuery.data.lastUsedVehicleId : "")

    useEffect( () => {
        if(vehicleQuery.data?.vehicle)
        {
            ZF_setVehicle(vehicleQuery.data.vehicle)
            setLitersKm(vehicleQuery.data.vehicle.litersPer100km.toString())
        }
    }, [vehicleQuery.isFetched])

    useEffect(() => {
        if(Z_vehicle)
        {
            setLitersKm(Z_vehicle.litersPer100km.toString())
        }
        
    }, [Z_vehicle])

    useEffect(() => {
        if(memberQuery.data?.lastUsedFuelPrice)
        {
            setFuelPrice(memberQuery.data?.lastUsedFuelPrice.toString())
        }

    }, [memberQuery.isFetched])
    
    return(
        <Box sx={{height: "55em"}}>
            <Typography variant="h6" gutterBottom sx={{color:"#1976d2"}}>Trip Statistics</Typography>

            {calculateSimpleStatistics()}

            <ToggleButtonGroup
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
            </ToggleButtonGroup>

            {graphType === EGraphType.Time && (
                <TimeGraph tripDirections={R_tripDirections}/>
            )}

            {graphType === EGraphType.Distance && (
                <DistanceGraph tripDirections={R_tripDirections}/>
            )}

            {graphType === EGraphType.Cost && (
                <CostGraph tripDirections={R_tripDirections} fuelPrice={fuelPrice} litersKm={litersKm} setFuelPrice={setFuelPrice} setLitersKm={setLitersKm}/>
            )}

        </Box>
    )
}

export default Statistics