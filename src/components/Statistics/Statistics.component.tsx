import { Checkbox, FormControlLabel } from "@mui/material";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2";
import {useRecoilValue } from "recoil";
import { RSTripDirections } from "../../state/globalstate";


const Statistics: React.FC = () => {

    const R_tripDirections = useRecoilValue(RSTripDirections)
    const [isCumulative, setIsCumulative] = useState(true)

    function createGraph()
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
                console.log(legs[i])
                labels.push(i.toString())
                if(isCumulative)
                {
                    totalVal += legs[i].distance.value / 1000
                    dataValues.push(totalVal)
                }
                else
                {
                    dataValues.push(legs[i].distance.value / 1000)
                }

                
            }
            labels.push("R")
            labels[0] = "D"

            const options = {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
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

    

    // useEffect(() => {
    //     //console.log(R_tripDirections)
        
    // }, [R_tripDirections])
    

    ChartJS.register(CategoryScale, LinearScale,PointElement, LineElement, Title, Tooltip, Legend)



    console.log("fire stats")
    return(
        <div>
            <FormControlLabel control={<Checkbox checked={isCumulative} onChange={(val) => {console.log(val.target.checked); setIsCumulative(val.target.checked)}} />} label="Cumulative" />
            {createGraph()}
        </div>
    )
}

export default Statistics