import { Box, Button, InputAdornment, Stack, TextField, Typography } from "@mui/material"
//import axios from "axios";
import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"

import { useAccountStore } from "../../Zustand/accountStore";
import { useTripStore } from "../../Zustand/tripStore";
import { ITripDirections } from "../common/CommonInterfacesAndEnums";
import VehicleList from "../VehicleList/VehicleList.component";
import { isFloat } from "../../Services/Statistics.service";
import { useSetFuelPriceMutation } from "../../trpc-hooks/trpcHooks";



interface ICostGraph{
    tripDirections: ITripDirections | null;
    fuelPrice: string;
    litersKm: string;
    setFuelPrice: React.Dispatch<React.SetStateAction<string>>;
    setLitersKm: React.Dispatch<React.SetStateAction<string>>;
}

const CostGraph: React.FC<ICostGraph> = ({tripDirections, fuelPrice, litersKm, setFuelPrice, setLitersKm}) => {

//    const [R_selectedVehicle, R_setSelectedVehicle] = useRecoilState(RSSelectedVehicle)

    const vehicle = useTripStore(state => state.data.vehicle)


    const [graphData, setGraphData] = useState<any>(null)

    const [roundTripCost, setRoundTripCost] = useState(0)
    const [averageCost, setAverageCost] = useState(0)

    const ZF_setVehicle = useTripStore(state => state.reducers.setVehicle)

    const TM_fuelPriceMutation = useSetFuelPriceMutation()

    // const R_workspaceId = useRecoilValue(RSWorkspaceID)
    // const R_bearer = useRecoilValue(RSBearerToken)

    function handleSetLitersKm(litersKm: string)
    {
        setLitersKm(litersKm)
        ZF_setVehicle(null)

    }

    function pricePerKm(petrol: string, liters: string)
    {

            const tempPetrol = parseFloat(petrol)
            const tempLiters = parseFloat(liters)
            if(isNaN(tempPetrol) || isNaN(tempLiters))
            {
                return 0
            }
            else
            {
                return tempPetrol * tempLiters / 100;
            }   
    }

    const options = {
        responsive: true,
        animation: {
            duration: 0
        },
        plugins: {
          legend: {
            position: 'top' as const,
          },
          tooltip: {
            callbacks: {
                    label: function(context: any)
                    {
                        // console.log(context.parsed)
                        return "R" + (context.parsed.y as number).toFixed(2)
                    }
                }
            }
        },
      };

    useEffect(() => {
        if(tripDirections && tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            const legs = tripDirections?.result?.routes[0].legs
            const labels: string[] = []
            const dataValues: number[] = [];

            let totalCost = 0
            if(legs)
            {
                for(let i = 0; i < legs.length; i++)
                {
                    const cost = ((legs[i]?.distance?.value ?? 0) / 1000) * pricePerKm(fuelPrice, litersKm)
                    console.log(i, legs[i].distance, cost)
                    
                    totalCost += cost;
                    labels.push(i.toString())
                    dataValues.push(cost)
    
                }
                labels.shift()
                console.log(labels)
                setRoundTripCost(totalCost)
                setAverageCost(totalCost / legs.length)
                labels.push("Return")
                //labels[0] = "D"
                
                console.log(dataValues)
            }
            
            const data = {
                labels: labels,
                datasets: [
                    {
                    label: 'Cost per Address',
                    data: dataValues,
                    borderColor: "#1976d2",
                    backgroundColor: "#1976d2",
                    },
                ],
            };

            console.log(data)

            setGraphData(data)
        }
    }, [tripDirections, fuelPrice, litersKm])


    function handleUseSetFuelPriceMutation(fuelPrice: string)
    {
        if(isFloat(fuelPrice))
        {
            TM_fuelPriceMutation.mutate({workspaceId: useAccountStore.getState().values.workspaceId, fuelPrice: fuelPrice})
        }
    }

    return (
        <Stack spacing={1}>
            <Box>
                <Typography variant="body1">Total cost: R{(roundTripCost).toFixed(2)}</Typography>
                <Typography variant="body1">Average cost per Address: R{(averageCost).toFixed(2)}</Typography>
            </Box>

            {graphData !== null && (
                <Box>
                    <Bar style={{height: "100%"}} options={options} data={graphData} />
                </Box>
            )}

            {graphData === null && (
                <Box>
                    Graph will show once a route has been calculated
                </Box>
            )}

            <VehicleList/>

            {vehicle && (
                <Box>
                    <Typography variant="body1">Current Vehicle:</Typography>
                    <Typography variant="body1">{vehicle.vehicleDescription} - {vehicle.vehicleLicencePlate} - {vehicle.vehicleClass}</Typography>

                </Box>
            )}

            {vehicle === null && (
                <Box>
                    <Typography variant="body1">Current Vehicle:</Typography>
                    <Typography variant="body1" sx={{fontStyle: "italic"}}>custom</Typography>

                </Box>
            )}

            <Box>
                <TextField
                label="Liters per 100 km"
                id="outlined-size-small"
                //defaultValue=""
                size="small"
                sx={{width: '25ch'}}
                onChange={(e) => handleSetLitersKm(e.target.value)}
                value={litersKm}
                error={!isFloat(litersKm)}
                InputProps={{startAdornment: <InputAdornment position="start">l/100km:</InputAdornment>}}
                />
            </Box>

            <Box>
                <Stack direction={"row"} spacing={1}>
                    <Box>
                        <TextField
                        label="Fuel Price"
                        id="outlined-size-small"
                        //defaultValue=""
                        size="small"
                        sx={{width: '25ch'}}
                        onChange={(e) => setFuelPrice(e.target.value)}
                        value={fuelPrice}
                        error={!isFloat(fuelPrice)}
                        InputProps={{startAdornment: <InputAdornment position="start">R</InputAdornment>}}
                        />
                    </Box>
                    <Box>
                        <Button onClick={() => handleUseSetFuelPriceMutation(fuelPrice)} sx={{height: "100%"}} variant="outlined">Save Price</Button>
                    </Box>
                </Stack>
                
            </Box>

            
        </Stack>

    )
 
}

export default CostGraph