import { InputAdornment, TextField } from "@mui/material";
import { ResponsiveLine } from "@nivo/line"
import { useState } from "react";
import { TMouldedDirections } from "../../Services/GMap.service"

interface INivodurationGraphProps{
    tripDirections: TMouldedDirections
}

interface ICompositeLineData{
    id: string;
    data: {
        x: string;
        y: {time: number, distance: number};
    }[];
}

interface IDecomposedLineData{
    id: string;
    data: {
        x: string;
        y: number;
    }[];
}

const TimeDistanceGraph: React.FC<INivodurationGraphProps> = ({tripDirections}) => {

    const [units, setUnits] = useState<"time" | "distance">("time")

    const [averageBusyTime, setAverageBusyTime] = useState(0)

    function secondsToH_M(value: number)
    {
        const minutes = value / 60
        
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = Math.floor(minutes % 60)
        return hours + "h:" + remainingMinutes + "m"
    }

    function createCompositeLineData(tripDirections: TMouldedDirections)
    {
        let comulativeTime = 0
        let comulativeDistance = 0
        const compLineData: ICompositeLineData = {
            id: "legs",
            data: []
        }

        compLineData.data.push({x: `Start`, y: {time: comulativeTime, distance: comulativeDistance}})
        for(let i = 0; i < tripDirections.legGroups.length; i++)
        {
            const legs = tripDirections.legGroups[i]?.legs
            if(legs)
            {
                if(legs[0] && legs[1])
                {
                    comulativeTime += legs[0].duration.value + (averageBusyTime * 60);
                    comulativeDistance += legs[0].distance.value;
                    compLineData.data.push({x: `${i + 1}->`, y: {time: comulativeTime, distance: comulativeDistance}})

                    comulativeTime +=legs[1].duration.value + (averageBusyTime * 60);
                    comulativeDistance +=legs[1].distance.value
                    compLineData.data.push({x: `->${i + 1}`, y: {time: comulativeTime, distance: comulativeDistance}})
                }
                else if(legs[0]?.duration)
                {
                    if(i === tripDirections.legGroups.length - 1)
                    {
                        comulativeTime += legs[0].duration.value + (averageBusyTime * 60);
                        comulativeDistance += legs[0].distance.value
                        compLineData.data.push({x: `return`, y: {time: comulativeTime, distance: comulativeDistance}})
                    }
                    else
                    {
                        comulativeTime += legs[0].duration.value + (averageBusyTime * 60);
                        comulativeDistance += legs[0].distance.value
                        compLineData.data.push({x: `${i + 1}`, y: {time: comulativeTime, distance: comulativeDistance}})
                    }

                }
                
            }
        }
        return compLineData
    }

    const compositeLineData = createCompositeLineData(tripDirections)



    

    function decomposeCompositeLineData(compositeData: ICompositeLineData, select: "time" | "distance")
    {
        const transformedData: IDecomposedLineData = {
            id: compositeData.id,
            data: []
        }
        for(let i = 0; i < compositeData.data.length; i++)
        {
            transformedData.data.push({x: compositeData.data[i]!.x, y:  compositeData.data[i]!.y[select]})
        }

        return transformedData
    }



    return(
        <div className={"h-80 space-y-4"}>

            <div className="flex justify-center w-full text-base text-[#1976d2] font-bold">Time & Distance</div>

            <div className="flex gap-4">
                <div className="flex items-center space-x-1">
                    
                    <input type="checkbox" checked={units === "time"} className="accent-[#1976d2]" 
                        onChange={change => 
                            {
                                if(change.target.checked)
                                {
                                    setUnits("time")
                                }
                            }
                        }
                    />
                    <div>
                        Time
                    </div>
                    

                </div>
                
                <div className="flex items-center space-x-1">
                    <input type="checkbox" checked={units === "distance"} className="accent-[#1976d2]" 
                            onChange={change => 
                            {
                                if(change.target.checked)
                                {
                                    setUnits("distance")
                                }
                            }
                        }
                    />
                    <div>
                        Distance
                    </div>
                    
                </div>

            </div>

            <TextField
                label="Average Address Busy Time"
                id="outlined-size-small"
                //defaultValue=""
                size="small"

                onChange={(change) => {
                    console.log(change.target.value)
                    const parsed = parseInt(change.target.value)
                    if(!isNaN(parsed))
                    {
                        setAverageBusyTime(parsed)
                    }
                    else if(change.target.value === "")
                    {
                        setAverageBusyTime(0)
                    }
                    

                }}
                value={averageBusyTime}
                sx={{width: '25ch'}}
                InputProps={{startAdornment: <InputAdornment position="start">minutes:</InputAdornment>}}
            />
            
            
            <ResponsiveLine
                data={[decomposeCompositeLineData(compositeLineData, units)]}
                margin={{ bottom: 50, left: 65, right: 40, top: 10 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    // orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Legs',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    // orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: units === "time" ? "Time" : "Distance (km)",
                    legendOffset: -60,
                    legendPosition: 'middle',
                    format: (v) => {
                        if(units === "time")
                        {
                            return secondsToH_M(v)
                        }
                        else
                        {
                            return (v / 1000) + " km"
                        }
                        
                    }
                    
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                tooltip={({point}) => {
                    return (
                        <div className="p-2 rounded-lg bg-slate-50">
                            <div>{secondsToH_M(parseInt(compositeLineData.data[point.index]!.y.time.toString()))}</div>
                            <div>{Math.ceil(compositeLineData.data[point.index]!.y.distance / 1000)} km</div>
                        </div>
                    )
                }}
                colors={["#1976d2"]}
                // legends={[
                //     {
                //         anchor: 'bottom-right',
                //         direction: 'column',
                //         justify: false,
                //         translateX: 100,
                //         translateY: 0,
                //         itemsSpacing: 0,
                //         itemDirection: 'left-to-right',
                //         itemWidth: 80,
                //         itemHeight: 20,
                //         itemOpacity: 0.75,
                //         symbolSize: 12,
                //         symbolShape: 'circle',
                //         symbolBorderColor: 'rgba(0, 0, 0, .5)',
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemBackground: 'rgba(0, 0, 0, .03)',
                //                     itemOpacity: 1
                //                 }
                //             }
                //         ]
                //     }
                // ]}
            />


        </div>
    )
   
}

export default TimeDistanceGraph