import { ResponsiveLine } from "@nivo/line"
import { TMouldedDirections } from "../../Services/GMap.service"

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

interface INivoDistanceGraphProps{
    tripDirections: TMouldedDirections
}

const NivoDistanceGraph: React.FC<INivoDistanceGraphProps> = ({tripDirections}) => {

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

    let comulativeDistance = 0
    for(let i = 0; i < tripDirections.legGroups.length; i++)
    {
        const legs = tripDirections.legGroups[i]?.legs
        if(legs)
        {
            if(legs[0]?.distance && legs[1]?.distance)
            {
                comulativeDistance += legs[0].distance.value + legs[1].distance.value
                lineDraphData.data.push({x: `${i + 1}->${i + 1}`, y: comulativeDistance})
            }
            else if(legs[0]?.distance)
            {
                comulativeDistance += legs[0].distance.value
                lineDraphData.data.push({x: `${i + 1}`, y: comulativeDistance})
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
                legend: 'Distance',
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

export default NivoDistanceGraph