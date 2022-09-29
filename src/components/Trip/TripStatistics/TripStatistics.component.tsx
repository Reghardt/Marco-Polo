import { Box, Button, Divider, InputAdornment, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useRecoilValue } from "recoil";
import { RSOriginalTripDirections, RSShortestTripDirections } from "../../../state/globalstate";


enum EAdditionalCostType{
    R_hr = "R_hr",
    R_100km = "R_100km",
}

interface ITripStatistics
{
    dist: number;
    time: number;
}

const TripStatistics: React.FC = () => {

    const R_shortestTripDirections = useRecoilValue(RSShortestTripDirections)
    const R_originalTripDirections = useRecoilValue(RSOriginalTripDirections)

    const [shortestTripStatistics, setShortestTripStatistics] = useState<ITripStatistics>(null)
    const [originalTripStatistics, setOriginalTripStatistics] = useState<ITripStatistics>(null)

    const [petrolPrice, setPetrolPrice] = useState("")
    const [litersKm, setLitersKm] = useState("")
    const [additionalCost, setAdditionalCost] = useState("")
    const [additionalCostType, setAdditionalCostType] = useState<EAdditionalCostType>(EAdditionalCostType.R_hr)

    const [statusText, setStatusText] = useState("")

    useEffect(() => {
        //TODO check if status is OK
        if(R_shortestTripDirections && R_originalTripDirections)
        {
            if(R_shortestTripDirections.status === google.maps.DirectionsStatus.OK && R_originalTripDirections.status === google.maps.DirectionsStatus.OK)
            {
                setShortestTripStatistics(generateRouteStatistics(R_shortestTripDirections.result, 0))
                setOriginalTripStatistics(generateRouteStatistics(R_originalTripDirections.result, 0))
            }
            else
            {
                console.error("Status not ok")
            }
        }

        
    }, [R_shortestTripDirections, R_originalTripDirections])

    function generateRouteStatistics(directions: google.maps.DirectionsResult, directionsIndex: number): ITripStatistics
    {
      let legs = directions.routes[directionsIndex].legs;
      let totalDistance = 0;
      let totalTime = 0;
      for(let i = 0; i < legs.length; i++)
      {
        totalDistance += legs[i].distance.value
        totalTime += legs[i].duration.value
      }

      return {dist: totalDistance, time: totalTime}
    }

    function unixTimeToHMFormat(unixTime: number)
    {
      //TODO check if longer than a day
      let minutes =  unixTime / 60;
      
      let hours = Math.floor(minutes / 60);

      minutes = Math.round(minutes - hours * 60)

      return hours + "h " + minutes + "m";
    }

    function metersToKM(meters: number)
    {
      return meters / 1000;
    }

    function distanceReductionPercentage()
    {
        let dif = originalTripStatistics.dist - shortestTripStatistics.dist
        let percent = dif / originalTripStatistics.dist;
        return (percent * 100)
    }

    function isFloat(val: string)
    {
        if(val === "")
        {
            return false
        }
        else
        {
            const regex = /^\d+\.?(\d+)?$/
            return !regex.test(val)
        }  
    }

    function pricePerKm(petrol: string, liters: string)
    {
        let tempPetrol = parseFloat(petrol)
        let tempLiters = parseFloat(liters)

        return tempPetrol * tempLiters / 100;
    }

    function randsPerHour(time: number, additionalCostsValue: number)
    {
        let minutes =  time / 60;
        let costPerMin = additionalCostsValue / 60
        return  minutes * costPerMin
    }

    function randsPer100km(distance: number, additionalCostsValue: number)
    {
        let costPerKm = additionalCostsValue / 100
        return costPerKm * distance / 1000
    }


    function calcOriginalRouteCost()
    {
        let totalCost = 0
        let perKm = pricePerKm(petrolPrice, litersKm)
        let originalRouteCost = metersToKM(originalTripStatistics.dist) * perKm;
        if(isNaN(originalRouteCost))
        {
            return 0
        }
        totalCost += originalRouteCost

        let additionalCostsValue = parseFloat(additionalCost)
        if(!isNaN(additionalCostsValue))
        {
            if(additionalCostType === EAdditionalCostType.R_hr)
            {
                totalCost += randsPerHour(originalTripStatistics.time, additionalCostsValue)
            }
            else
            {
                totalCost += randsPer100km(originalTripStatistics.dist, additionalCostsValue)
            }
        }
        return totalCost;
    }

    function calcOptimizedRouteCost()
    {
        let totalCost = 0
        let perKm = pricePerKm(petrolPrice, litersKm)
        let optimizedRouteCost = metersToKM(shortestTripStatistics.dist) * perKm;
        if(isNaN(optimizedRouteCost))
        {
            return 0
        }
        totalCost += optimizedRouteCost

        let additionalCostsValue = parseFloat(additionalCost)
        if(!isNaN(additionalCostsValue))
        {
            if(additionalCostType === EAdditionalCostType.R_hr)
            {
                totalCost += randsPerHour(shortestTripStatistics.time, additionalCostsValue)
            }
            else
            {
                totalCost += randsPer100km(shortestTripStatistics.dist, additionalCostsValue)
            }
        }
        return totalCost;
    }

    function calculateVehicleSavings()
    {
        let originalRouteCost = calcOriginalRouteCost();
        let optimizedRouteCost = calcOptimizedRouteCost()
        return (originalRouteCost - optimizedRouteCost).toFixed(2);
    }

    return(
        <Box>
            {/* <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Statistics</Typography> */}

            {shortestTripStatistics !== null && originalTripStatistics !== null && (
                <div>
                    <Typography variant="h6">Given Route:</Typography>
                    <Typography variant="body1" gutterBottom>
                        Distance: {metersToKM(originalTripStatistics.dist)}km, Time: {unixTimeToHMFormat(originalTripStatistics.time)} 
                    </Typography>

                    <Typography variant="h6">Optimised Route:</Typography>
                    <Typography variant="body1" gutterBottom>
                        Distance: {metersToKM(shortestTripStatistics.dist)}km, Time: {unixTimeToHMFormat(shortestTripStatistics.time)} 
                    </Typography >

                    <Typography variant="h6">Result:</Typography>
                    <Typography variant="body1" gutterBottom>
                        Distance Reduction: {metersToKM(originalTripStatistics.dist - shortestTripStatistics.dist)}km - {distanceReductionPercentage().toFixed(2)}%
                        Estimated Time Saved: {unixTimeToHMFormat(originalTripStatistics.time - shortestTripStatistics.time)}
                    </Typography>

                    <Typography variant="h6" gutterBottom>Vehicle Operating Costs:</Typography>
                    

                    <Stack
                    alignItems="left"
                    spacing={2}
                    >
                        <Box>
                            <Button variant="outlined">Saved Vehicles</Button>
                        </Box>
                        
                        <Box>
                            <TextField
                            label="Petrol Price"
                            id="outlined-size-small"
                            //defaultValue=""
                            size="small"
                            sx={{width: '25ch'}}
                            onChange={(e) => setPetrolPrice(e.target.value)}
                            value={petrolPrice}
                            error={isFloat(petrolPrice)}
                            InputProps={{startAdornment: <InputAdornment position="start">R</InputAdornment>}}
                            />
                        </Box>

                        <Box>
                            <TextField
                            label="Liters per 100 km"
                            id="outlined-size-small"
                            //defaultValue=""
                            size="small"
                            sx={{width: '25ch'}}
                            onChange={(e) => setLitersKm(e.target.value)}
                            value={litersKm}
                            error={isFloat(litersKm)}
                            InputProps={{startAdornment: <InputAdornment position="start">l/100km:</InputAdornment>}}
                            />
                        </Box>
                        
                        <Stack direction="row" spacing={2}>
                            <Box>
                                <TextField
                                label={ additionalCostType === EAdditionalCostType.R_hr ? "Additional cost per hour" : "Additional cost per 100km"}
                                id="outlined-size-small"
                                //defaultValue=""
                                size="small"
                                sx={{width: '25ch'}}
                                onChange={(e) => setAdditionalCost(e.target.value)}
                                value={additionalCost}
                                error={isFloat(additionalCost)}
                                InputProps={{startAdornment: <InputAdornment position="start">{ additionalCostType === EAdditionalCostType.R_hr ? "R/hr:" : "R/100km:"}</InputAdornment>}}
                                />
                            </Box>

                            <Box sx={{height:"100%"}}>
                                
                                <ToggleButtonGroup
                                sx={{maxHeight:"100%", height: "100%"}}
                                size="small"
                                color="primary"
                                value={additionalCostType}
                                exclusive
                                onChange={(_e, v) => {setAdditionalCostType(v)}}
                                aria-label="Additional costs"
                                >
                                    <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EAdditionalCostType.R_hr}>R/hr</ToggleButton>
                                    <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EAdditionalCostType.R_100km}>R/100km</ToggleButton>
                                </ToggleButtonGroup>
                            </Box> 
                        </Stack>
                        



                        <Typography variant="body1" gutterBottom>
                            Given Route Cost: R{calcOriginalRouteCost().toFixed(2)} <br/>
                            Optimised Route Cost: R{calcOptimizedRouteCost().toFixed(2)} <br/>
                            Savings: R{calculateVehicleSavings()} <br/>

                            {distanceReductionPercentage() < 7 && (
                                <div style={{color: "green"}}>Distance reduction less than 7% - Route Calculation is Free</div>
                            )}
                        </Typography>
                    </Stack>
                </div>
            )}

            {shortestTripStatistics === null && originalTripStatistics === null && (
                <Typography variant="body1" gutterBottom>Statistics will be generated and displayed here once a trip has been calculated.</Typography>
            )}
            
            
        </Box>
    )
}

export default TripStatistics;