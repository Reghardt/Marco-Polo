import { Box } from "@mui/material";
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2";
import { ITripDirections } from "../../interfaces/simpleInterfaces";

interface ICostGraph{
    tripDirections: ITripDirections | null;
}

const DistanceGraph : React.FC<ICostGraph> = ({tripDirections}) =>
{

    const [graphData, setGraphData] = useState<any>(null)

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
                    labels.push(i.toString())

                    totalVal += (legs[i]?.distance?.value ?? 0) / 1000
                    dataValues.push(totalVal)
    
                }
            }
            
            labels.push("Return")
            labels[0] = "Depart"

            const data = {
                labels,
                datasets: [
                    {
                    label: 'Distance in Km',
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
                <Box sx={{height: "28em"}}>
                    <Line style={{height: "100%"}} options={options} data={graphData} />
                </Box>
            )}
        </div>
    )
}

export default DistanceGraph