import { InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react"
import { IRouteStatistics } from "../../interfaces/simpleInterfaces";

interface RouteStatisticsProps
{
    routeStatisticsData: IRouteStatistics;
}

const RouteStatistics: React.FC<RouteStatisticsProps> = ({routeStatisticsData}) => {

    const [petrolPrice, setPetrolPrice] = useState(0)
    const [litersKm, setLitersKm] = useState(0)

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
        let dif = routeStatisticsData.origional.dist - routeStatisticsData.optimized.dist
        let percent = dif / routeStatisticsData.origional.dist;
        return (percent * 100).toFixed(2);
    }

    function handlePetrolPrice(priceStr: string)
    {
        let price = parseFloat(priceStr)
        if(Number.isNaN(price))
        {
            setPetrolPrice(0)
        }
        else
        {
            setPetrolPrice(price)
        }
    }

    function handleLitersKm(litersStr: string)
    {
        let litersP100 = parseFloat(litersStr)
        if(Number.isNaN(litersP100))
        {
            setLitersKm(0)
        }
        else
        {
            setLitersKm(litersP100)
        }
        
    }

    function calcOriginalRouteCost()
    {
        let perKm = petrolPrice * litersKm / 100;
        let originalRouteCost = metersToKM(routeStatisticsData.origional.dist) * perKm;
        return originalRouteCost;
    }

    function calcOptimizedRouteCost()
    {
        let perKm = petrolPrice * litersKm / 100;
        let optimizedRouteCost = metersToKM(routeStatisticsData.optimized.dist) * perKm;
        return optimizedRouteCost;
    }

    function calculateVehicleSavings()
    {
        let originalRouteCost = calcOriginalRouteCost();
        let optimizedRouteCost = calcOptimizedRouteCost()
        return (originalRouteCost - optimizedRouteCost).toFixed(2);
    }

    return(
        <Paper sx={{padding: "10px"}} variant="elevation" elevation={5}>
            <Typography variant="h5" gutterBottom >Route Statistics</Typography>
            
            <Typography variant="h6">Given Route:</Typography>
            <Typography variant="body1" gutterBottom>
                Distance: {metersToKM(routeStatisticsData.origional.dist)}km, Time: {unixTimeToHMFormat(routeStatisticsData.origional.time)} <br/>
            </Typography>

            <Typography variant="h6">Optimised Route:</Typography>
            <Typography variant="body1" gutterBottom>
                Distance: {metersToKM(routeStatisticsData.optimized.dist)}km, Time: {unixTimeToHMFormat(routeStatisticsData.optimized.time)} <br/>
            </Typography >

            <Typography variant="h6">Result:</Typography>
            <Typography variant="body1" gutterBottom>
                Distance Reduction: {metersToKM(routeStatisticsData.origional.dist - routeStatisticsData.optimized.dist)}km - {distanceReductionPercentage()}% <br/>
                Estimated Time Saved: {unixTimeToHMFormat(routeStatisticsData.origional.time - routeStatisticsData.optimized.time)}
            </Typography>

            <Typography variant="h6" gutterBottom>Vehicle Savings:</Typography>
            
            <div>
            <Stack
            
            spacing={2}
            >
                <TextField
                label="Petrol Price"
                id="outlined-size-small"
                defaultValue=""
                size="small"
                sx={{width: '25ch'}}
                onChange={(e) => handlePetrolPrice(e.target.value)}
                InputProps={{startAdornment: <InputAdornment position="start">R</InputAdornment>}}
                />

                <TextField
                label="Liters per 100 km"
                id="outlined-size-small"
                defaultValue=""
                size="small"
                sx={{width: '25ch'}}
                onChange={(e) => handleLitersKm(e.target.value)}
                InputProps={{startAdornment: <InputAdornment position="start">l/km</InputAdornment>}}
                />

                <Typography variant="body1" gutterBottom>
                    Given Route Cost: R{calcOriginalRouteCost().toFixed(2)} <br/>
                    Optimised Route Cost: R{calcOptimizedRouteCost().toFixed(2)} <br/>
                    Savings: R{calculateVehicleSavings()}
                </Typography>
            </Stack>

            </div>
            
  
        </Paper>
    )
}

export default RouteStatistics;