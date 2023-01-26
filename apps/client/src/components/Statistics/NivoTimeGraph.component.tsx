import { ResponsiveLine } from "@nivo/line"
import { TMouldedDirectionsLegGroup } from "../../Services/GMap.service"

// const data = [
//     {
//       "id": "legs",
//       "color": "hsl(254, 70%, 50%)",
//       "data": [
//         {
//           "x": "plane2",
//           "y": 100
//         },
//         {
//           "x": "helicopter",
//           "y": 101
//         },
//         {
//           "x": "boat",
//           "y": 196
//         },
//         {
//           "x": "train",
//           "y": 274
//         },
//         {
//           "x": "subway",
//           "y": 191
//         },
//         {
//           "x": "bus",
//           "y": 144
//         },
//         {
//           "x": "car",
//           "y": 230
//         },
//         {
//           "x": "moto",
//           "y": 175
//         },
//         {
//           "x": "bicycle",
//           "y": 91
//         },
//         {
//           "x": "horse",
//           "y": 172
//         },
//         {
//           "x": "skateboard",
//           "y": 242
//         },
//         {
//           "x": "others",
//           "y": 117
//         }
//       ]
//     },   
//   ]

interface INivodurationGraphProps{
    tripDirections: TMouldedDirectionsLegGroup[]
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

    const lineDraphData: ITripLineGraphData = {
        id: "legs",
        color: "red",
        data: []
    }

    let comulativeduration = 0
    for(let i = 0; i < tripDirections.length; i++)
    {
        const legs = tripDirections[i]?.legs
        if(legs)
        {
            if(legs[0]?.duration && legs[1]?.duration)
            {
                comulativeduration += legs[0].duration.value + legs[1].duration.value
                lineDraphData.data.push({x: `${i + 1}->${i + 1}`, y: comulativeduration})
            }
            else if(legs[0]?.duration)
            {
                comulativeduration += legs[0].duration.value
                lineDraphData.data.push({x: `${i + 1}`, y: comulativeduration})
            }
            
        }
    }

    return(
        <div className={"h-80"}>
            
        <ResponsiveLine
            data={[lineDraphData]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
                legend: 'duration',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
        </div>
    )
   
}

export default NivoTimeGraph