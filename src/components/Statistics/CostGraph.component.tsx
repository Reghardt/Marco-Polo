import { Box, Button, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import axios from "axios";
import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { useRecoilState, useRecoilValue } from "recoil";
import { ITripDirections } from "../../interfaces/simpleInterfaces"
import { RSBearerToken, RSSelectedVehicle, RSWorkspaceID } from "../../state/globalstate";
import VehicleList from "../VehicleList/VehicleList.component";

interface ICostGraph{
    tripDirections: ITripDirections;
    fuelPrice: string;
    litersKm: string;
    setFuelPrice: React.Dispatch<React.SetStateAction<string>>;
    setLitersKm: React.Dispatch<React.SetStateAction<string>>;
}

const CostGraph: React.FC<ICostGraph> = ({tripDirections, fuelPrice, litersKm, setFuelPrice, setLitersKm}) => {

   const [R_selectedVehicle, R_setSelectedVehicle] = useRecoilState(RSSelectedVehicle)


    const [graphData, setGraphData] = useState<any>(null)

    const [roundTripCost, setRoundTripCost] = useState(0)
    const [averageCost, setAverageCost] = useState(0)

    const R_workspaceId = useRecoilValue(RSWorkspaceID)
    const R_bearer = useRecoilValue(RSBearerToken)

    function handleSetLitersKm(litersKm: string)
    {
        setLitersKm(litersKm)
        R_setSelectedVehicle(null)
    }

    function isFloat(val: string)
    {
        if(val === "")
        {
            return true
        }
        else
        {
            const regex = /^\d+\.?(\d+)?$/
            return regex.test(val)
        }  
    }

    function pricePerKm(petrol: string, liters: string)
    {

            let tempPetrol = parseFloat(petrol)
            let tempLiters = parseFloat(liters)
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
                    label: function(context)
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
            let legs = tripDirections.result.routes[0].legs
            let labels: string[] = []
            let dataValues: number[] = [];

            let totalCost = 0
            for(let i = 0; i < legs.length; i++)
            {
                let cost = (legs[i].distance.value / 1000) * pricePerKm(fuelPrice, litersKm)
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
            const data = {
                labels: labels,
                datasets: [
                    {
                    label: 'Cost per Address',
                    data: dataValues,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            };

            console.log(data)

            setGraphData(data)
        }

    }, [tripDirections, fuelPrice, litersKm])

    function saveFuelPrice()
    {
        console.log("save price", fuelPrice, isFloat(fuelPrice))
        if(isFloat(fuelPrice))
        {
            axios.post
            ("/api/workspace/saveFuelPrice", {
                workspaceId: R_workspaceId,
                fuelPrice: fuelPrice
            },
            {
                headers: {authorization: R_bearer} //for user id
            }).then(res => {
                console.log(res)

            }).catch(err => {
                console.error(err)
            }
            )
        }

        
    }


    return (
        <div>
            <Stack spacing={1}>
                <Box>
                    <Typography variant="body1">Total cost: R{(roundTripCost).toFixed(2)}</Typography>
                    <Typography variant="body1">Average cost per Address: R{(averageCost).toFixed(2)}</Typography>
                </Box>

                {graphData !== null && (
                    <Box>
                        <Bar options={options} data={graphData} />
                    </Box>
                )}

                <VehicleList/>

                {R_selectedVehicle && (
                    <Box>
                        <Typography variant="body1">Current Vehicle:</Typography>
                        <Typography variant="body1">{R_selectedVehicle.vehicleDescription} - {R_selectedVehicle.vehicleLicencePlate} - {R_selectedVehicle.vehicleClass}</Typography>

                    </Box>
                )}

                {R_selectedVehicle === null && (
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
                            <Button onClick={() => saveFuelPrice()} sx={{height: "100%"}} variant="outlined">Save Price</Button>
                        </Box>
                    </Stack>
                    
                </Box>

                
            </Stack>
        </div>
    )
 
}

export default CostGraph