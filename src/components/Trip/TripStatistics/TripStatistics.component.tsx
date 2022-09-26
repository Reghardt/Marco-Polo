import { Box, Button, Divider, InputAdornment, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useState } from "react"
import { useRecoilValue } from "recoil";
import { ITripStatistics } from "../../../interfaces/simpleInterfaces";
import { RSTripStatisticsData } from "../../../state/globalstate";


enum EAdditionalCostType{
    R_hr = "R_hr",
    R_100km = "R_100km",
}

const RouteStatistics: React.FC = () => {

    const R_tripStatisticsData = useRecoilValue(RSTripStatisticsData)

    const [petrolPrice, setPetrolPrice] = useState("")
    const [litersKm, setLitersKm] = useState("")
    const [additionalCost, setAdditionalCost] = useState("")
    const [additionalCostType, setAdditionalCostType] = useState<EAdditionalCostType>(EAdditionalCostType.R_hr)

    const [statusText, setStatusText] = useState("")

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
        let dif = R_tripStatisticsData.origional.dist - R_tripStatisticsData.optimized.dist
        let percent = dif / R_tripStatisticsData.origional.dist;
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
        let originalRouteCost = metersToKM(R_tripStatisticsData.origional.dist) * perKm;
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
                totalCost += randsPerHour(R_tripStatisticsData.origional.time, additionalCostsValue)
            }
            else
            {
                totalCost += randsPer100km(R_tripStatisticsData.origional.dist, additionalCostsValue)
            }
        }
        return totalCost;
    }

    function calcOptimizedRouteCost()
    {
        let totalCost = 0
        let perKm = pricePerKm(petrolPrice, litersKm)
        let optimizedRouteCost = metersToKM(R_tripStatisticsData.optimized.dist) * perKm;
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
                totalCost += randsPerHour(R_tripStatisticsData.optimized.time, additionalCostsValue)
            }
            else
            {
                totalCost += randsPer100km(R_tripStatisticsData.optimized.dist, additionalCostsValue)
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

            {R_tripStatisticsData !== null && (
                <div>
                    <Typography variant="h6">Given Route:</Typography>
                    <Typography variant="body1" gutterBottom>
                        Distance: {metersToKM(R_tripStatisticsData.origional.dist)}km, Time: {unixTimeToHMFormat(R_tripStatisticsData.origional.time)} <br/>
                    </Typography>

                    <Typography variant="h6">Optimised Route:</Typography>
                    <Typography variant="body1" gutterBottom>
                        Distance: {metersToKM(R_tripStatisticsData.optimized.dist)}km, Time: {unixTimeToHMFormat(R_tripStatisticsData.optimized.time)} <br/>
                    </Typography >

                    <Typography variant="h6">Result:</Typography>
                    <Typography variant="body1" gutterBottom>
                        Distance Reduction: {metersToKM(R_tripStatisticsData.origional.dist - R_tripStatisticsData.optimized.dist)}km - {distanceReductionPercentage().toFixed(2)}% <br/>
                        Estimated Time Saved: {unixTimeToHMFormat(R_tripStatisticsData.origional.time - R_tripStatisticsData.optimized.time)}
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

            {R_tripStatisticsData === null && (
                <Typography variant="body1" gutterBottom>Statistics will be generated and displayed here once a trip has been calculated.</Typography>
            )}
            
            
        </Box>
    )
}

export default RouteStatistics;