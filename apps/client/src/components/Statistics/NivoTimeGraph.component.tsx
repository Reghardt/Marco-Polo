import { TextField } from "@mui/material";
import { ResponsiveLine } from "@nivo/line"
import { TMouldedDirections } from "../../Services/GMap.service"

interface INivodurationGraphProps{
    tripDirections: TMouldedDirections
}

const NivoTimeGraph: React.FC<INivodurationGraphProps> = ({tripDirections}) => {

    interface ITripLineGraphData{
        id: string;
        color: string;
        data: {
            x: string;
            y: number;
        }[];
    }

    function secondsToH_M(value: number)
    {
        const minutes = value / 60
        
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = Math.floor(minutes % 60)
        return hours + "h:" + remainingMinutes + "m"
    }

    const lineDraphData: ITripLineGraphData = {
        id: "legs",
        color: "red",
        data: []
    }

    let comulativeduration = 0
    for(let i = 0; i < tripDirections.legGroups.length; i++)
    {
        const legs = tripDirections.legGroups[i]?.legs
        if(legs)
        {
            if(legs[0] && legs[1])
            {
                comulativeduration += legs[0].duration.value 
                lineDraphData.data.push({x: `${i + 1}->`, y: comulativeduration})
                comulativeduration +=legs[1].duration.value
                lineDraphData.data.push({x: `->${i + 1}`, y: comulativeduration})
            }
            else if(legs[0]?.duration)
            {
                if(i === tripDirections.legGroups.length - 1)
                {
                    comulativeduration += legs[0].duration.value
                    lineDraphData.data.push({x: `return`, y: comulativeduration})
                }
                else
                {
                    comulativeduration += legs[0].duration.value
                    lineDraphData.data.push({x: `${i + 1}`, y: comulativeduration})
                }

            }
            
        }
    }

    return(
        <div className={"h-80"}>
            
        <ResponsiveLine
            data={[lineDraphData]}
            margin={{ bottom: 50, left: 65, right: 10, top: 10 }}
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
                legend: 'Duration',
                legendOffset: -60,
                legendPosition: 'middle',
                format: v => secondsToH_M(v)
                
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            tooltip={({point}) => {
                return <div>
                    <div>{secondsToH_M(parseInt(point.data.y.toString()))}</div>
                    <div>{}</div>
                </div>
            }}
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

            <TextField
            label="Average Address Busy Time"
            id="outlined-size-small"
            //defaultValue=""
            size="small"
            sx={{width: '25ch'}}

            />
        </div>
    )
   
}

export default NivoTimeGraph