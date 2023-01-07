import { Box } from "@mui/material";
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2";
import { ITripDirections } from "../common/CommonInterfacesAndEnums";


interface ITimeGraph{
    tripDirections: ITripDirections | null;
}

const TimeGraph : React.FC<ITimeGraph> = ({tripDirections}) => {

    const [graphData, setGraphData] = useState<any>(null)

    function secondsToH_M(value: number)
    {
        const minutes = value / 60
        
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = Math.floor(minutes % 60)
        return hours + "h:" + remainingMinutes + "m"
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
                        return "Time: " +  secondsToH_M(context.parsed.y)
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value: any, _index: any, _ticks: any) {
                        
                        return secondsToH_M(value)
                    }
                }
            }
        },
    };

    useEffect(() => {
        if(tripDirections && tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            const legs = tripDirections.result?.routes[0].legs
            const labels: string[] = []
            const dataValues: number[] = [];
            dataValues.push(0)
            let totalVal = 0
            if(legs)
            {
                for(let i = 0; i < legs.length; i++)
                {
                    //console.log(legs[i])
                    labels.push(i.toString())

                    totalVal += legs[i]?.duration?.value ?? 0
                    dataValues.push(totalVal)
                }
                labels.push("Return")
                labels[0] = "Depart"
            }

            const data = {
                labels,
                datasets: [
                    {
                    label: 'Time in hours and minutes',
                    data: dataValues.map((val) => {return val}),
                    borderColor: "#1976d2",
                    backgroundColor: "#1976d2",
                    },
                ],
            };

            setGraphData(data)
        }
    }, [tripDirections])

    return(
        <div>
            {graphData !== null && (
                <Box>
                    <Line style={{height: "100%"}} options={options} data={graphData} />
                </Box>
            )}

            {graphData === null && (
                <Box>
                    Graph will show once a route has been calculated
                </Box>
            )}
        </div>
    )
}

export default TimeGraph