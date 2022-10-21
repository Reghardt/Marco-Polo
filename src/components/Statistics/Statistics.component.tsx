import { Box, Checkbox, FormControlLabel, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import React, { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2";
import {useRecoilValue } from "recoil";
import { RSTripDirections } from "../../state/globalstate";
import CostGraph from "./CostGraph.component";


enum EGraphStatistic{
    Distance,
    Time,
    Cost
}

const Statistics: React.FC = () => {

    const R_tripDirections = useRecoilValue(RSTripDirections)
    const [graphStatistic, setGraphStatistic] = useState<EGraphStatistic>(EGraphStatistic.Time)

    const [petrolPrice, setPetrolPrice] = useState("")
    const [litersKm, setLitersKm] = useState("")

    function createDistanceGraph()
    {
        if(R_tripDirections && R_tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            let legs = R_tripDirections.result.routes[0].legs
            let labels: string[] = []
            let dataValues: number[] = [];
            dataValues.push(0)
            let totalVal = 0
            for(let i = 0; i < legs.length; i++)
            {
                //console.log(legs[i])
                labels.push(i.toString())

                totalVal += legs[i].distance.value / 1000
                dataValues.push(totalVal)
   
            }
            labels.push("Return")
            labels[0] = "Depart"

            const options = {
                responsive: true,
                animation: {
                    duration: 0
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value, _index, _ticks) {
                                return value + "km";
                            }
                        }
                    }
                }
              };
        
        
            const data = {
                labels,
                datasets: [
                    {
                    label: 'Distance in Km',
                    data: dataValues.map((val) => {return val}),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],


            };

            return (
                <div>
                    
                    
                    <Line options={options} data={data} />
                </div>
 
            )
        }
        else
        {
            return <div>No graph data</div>
        }
    }

    function createTimeGraph()
    {
        if(R_tripDirections && R_tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            let legs = R_tripDirections.result.routes[0].legs
            let labels: string[] = []
            let dataValues: number[] = [];
            dataValues.push(0)
            let totalVal = 0
            for(let i = 0; i < legs.length; i++)
            {
                //console.log(legs[i])
                labels.push(i.toString())

                totalVal += legs[i].duration.value
                dataValues.push(totalVal)
   
            }
            labels.push("Return")
            labels[0] = "Depart"

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
                                return "Time: " +  secondsToH_M(context.parsed.y)
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value, _index, _ticks) {
                                
                                return secondsToH_M(value)
                            }
                        }
                    }
                },
                
              };
        
        
            const data = {
                labels,
                datasets: [
                    {
                    label: 'Time in hours and minutes',
                    data: dataValues.map((val) => {return val}),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],


            };

            return (
                <div>
                    
                    
                    <Line options={options} data={data} />
                </div>
 
            )
        }
        else
        {
            return <div>No graph data</div>
        }
    }


    function secondsToH_M(value: number)
    {
        let minutes = value / 60
        
        let hours = Math.floor(minutes / 60)
        let remainingMinutes = Math.floor(minutes % 60)
        return hours + "h:" + remainingMinutes + "m"
    }

    function calculateSimpleStatistics()
    {
        if(R_tripDirections && R_tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            let legs = R_tripDirections.result.routes[0].legs
            let roundTripDistance = 0;
            let roundTripTime = 0;
            for(let i = 0; i < legs.length; i++)
            {
                roundTripDistance += legs[i].distance.value
                roundTripTime += legs[i].duration.value
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

    

    // useEffect(() => {
    //     //console.log(R_tripDirections)
        
    // }, [R_tripDirections])
    

    ChartJS.register(CategoryScale, LinearScale,PointElement, LineElement, BarElement, Title, Tooltip, Legend)



    console.log("fire stats")
    return(
        <Box sx={{marginBottom: "20em"}}>
            <Typography variant="h6" gutterBottom sx={{color:"#1976d2"}}>Trip Statistics</Typography>

            {calculateSimpleStatistics()}

            <ToggleButtonGroup
                sx={{maxHeight:"100%", height: "100%", marginBottom: "0.5em"}}
                size="small"
                color="primary"
                value={graphStatistic}
                exclusive
                onChange={(_e, v) => {
                    if(v !== null)
                    {
                        setGraphStatistic(v)
                    }
                    
                }}
                aria-label="Address Type"
                >
                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EGraphStatistic.Time}>Time</ToggleButton>
                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EGraphStatistic.Distance}>Distance</ToggleButton>
                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EGraphStatistic.Cost}>Cost</ToggleButton>
            </ToggleButtonGroup>


            {graphStatistic === EGraphStatistic.Distance && (
                createDistanceGraph()
            )}

            {graphStatistic === EGraphStatistic.Time && (
                createTimeGraph()
            )}

            {graphStatistic === EGraphStatistic.Cost && (
                <CostGraph tripDirections={R_tripDirections} petrolPrice={petrolPrice} litersKm={litersKm} setPetrolPrice={setPetrolPrice} setLitersKm={setLitersKm}/>
            )}

        </Box>
    )
}

export default Statistics