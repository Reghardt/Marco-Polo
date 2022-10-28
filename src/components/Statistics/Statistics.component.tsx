import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import axios from "axios";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import React, { useEffect, useState } from "react"
import {useRecoilState, useRecoilValue } from "recoil";
import { IMember, IVehicleListEntry } from "../../interfaces/simpleInterfaces";
import { RSBearerToken, RSMemberData, RSSelectedVehicle, RSTripDirections, RSWorkspaceID } from "../../state/globalstate";
import CostGraph from "./CostGraph.component";
import DistanceGraph from "./DistanceGraph.component";
import TimeGraph from "./TimeGraph.component";

enum EGraphType{
    Distance,
    Time,
    Cost
}

const Statistics: React.FC = () => {

    console.log("refresh")

    const R_tripDirections = useRecoilValue(RSTripDirections)
    const [graphType, setGraphType] = useState<EGraphType>(EGraphType.Time)

    const [fuelPrice, setFuelPrice] = useState("")
    const [litersKm, setLitersKm] = useState("")

    const R_bearer = useRecoilValue(RSBearerToken)
    const R_workspaceId = useRecoilValue(RSWorkspaceID)

    const R_memberData = useRecoilValue(RSMemberData)

    const [R_selectedVehicle, R_setSelectedVehicle] = useRecoilState(RSSelectedVehicle)

    ChartJS.register(CategoryScale, LinearScale,PointElement, LineElement, BarElement, Title, Tooltip, Legend)

    function secondsToH_M(value: number)
    {
        const minutes = value / 60
        
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = Math.floor(minutes % 60)
        return hours + "h:" + remainingMinutes + "m"
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function calculateSimpleStatistics()
    {
        if(R_tripDirections && R_tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            const legs = R_tripDirections?.result?.routes[0].legs
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

    

    function handleMostRecentVehicleAndFuelPrice(member: IMember)
    {
        
      if(member.lastUsedFuelPrice)
      {
        //TODO set fuel price
        setFuelPrice(member.lastUsedFuelPrice.toString())
      }

      if(member.lastUsedVehicleId)
      {
        axios.post<{vehicle: IVehicleListEntry}>
        ("/api/workspace/getVehicleById", {
            workspaceId: R_workspaceId,
            vehicleId: member.lastUsedVehicleId
          },
          {
            headers: {authorization: R_bearer} //for user id
          }
        )
        .then(res => {
            console.log(res)
          if(res.data.vehicle)
          {
            R_setSelectedVehicle(res.data.vehicle)
          }
          
          
        })
        .catch(err => {
          console.log(err)
        })
      }
    }

    useEffect(() => {
        if(R_memberData)
        {
            handleMostRecentVehicleAndFuelPrice(R_memberData)
        }
    },[R_memberData])

    useEffect(() => {
        if(R_selectedVehicle)
        {
            setLitersKm(R_selectedVehicle.litersPer100km.toString())
        }
        
    }, [R_selectedVehicle])



    console.log("fire stats")
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


            {graphType === EGraphType.Distance && (
                <DistanceGraph tripDirections={R_tripDirections}/>
            )}

            {graphType === EGraphType.Time && (

                <TimeGraph tripDirections={R_tripDirections}/>
            )}

            {graphType === EGraphType.Cost && (
                <CostGraph tripDirections={R_tripDirections} fuelPrice={fuelPrice} litersKm={litersKm} setFuelPrice={setFuelPrice} setLitersKm={setLitersKm}/>
            )}

        </Box>
    )
}

export default Statistics