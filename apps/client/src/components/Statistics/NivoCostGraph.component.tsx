import { ResponsiveBar } from '@nivo/bar'

import { TMouldedDirectionsLeg, TMouldedDirectionsLegGroup } from '../../Services/GMap.service'
import { tolls } from '../Maps/Tolls'


// const demoData = [
//     {
//       leg: "AD",
//       someVal: 166,
//     },
//     {
//       leg: "AE",
//       someVal: 100,
//     },
    
//   ]

interface ILegBarKeys extends Record<string, any>{
    leg: string
}

interface INivoCostGraphProps{
    tripDirections: TMouldedDirectionsLegGroup[],
    fuelPrice: string,
    litersKm: string
}

const NivoCostGraph: React.FC<INivoCostGraphProps> = ({tripDirections, fuelPrice, litersKm}) => {



    

    function pricePerKm(petrol: string, liters: string)
    {

        const tempPetrol = parseFloat(petrol)
        const tempLiters = parseFloat(liters)
        if(isNaN(tempPetrol) || isNaN(tempLiters))
        {
            return 0
        }
        else
        {
            return tempPetrol * tempLiters / 100;
        }   
    }



    // const vehicle = useTripStore(state => state.data.vehicle)

    function addKeyToKeys(key: string, keys: string[])
    {
        for(let i = 0; i < keys.length; i++)
        {
            if(keys[i] === key)
            {
                return;
            }
        }
        keys.push(key)
    }


    function createGraphBarFromLeg(legend: string, leg: TMouldedDirectionsLeg, barKeys: string[])
    {
        const legData: ILegBarKeys = {leg: legend, "Fuel Cost": (leg.distance.value / 1000 * pricePerKm(fuelPrice, litersKm)).toFixed(2)}
        tolls.forEach(toll => {
            toll.gateSection.forEach(gateSection => {
                if(google.maps.geometry.poly.isLocationOnEdge(gateSection.coordinates, leg.polyLine!, 10 * 10 **(-5)))
                {
                    const tollName = toll.name + gateSection.nameExtention
                    console.log("passes", tollName)
                    addKeyToKeys(tollName, barKeys)
                    legData[tollName] = gateSection.tarrif.c1
                }
                else
                {
                    console.log("does not pass", toll.name + gateSection.nameExtention)
                }
            })

        })
        console.log(legData)
        return legData
    }

    const barKeys: string[] = ["Fuel Cost"]
    const costGraphBars: ILegBarKeys[] = []
    if(tripDirections)
    {

        tripDirections.forEach((group, index) => {
            console.log("leg group")
            const leg0 = group.legs[0]
            const leg1 = group.legs[1]

            let label = (index + 1).toString()
            if(tripDirections.length - 1 === index)
            {
                label = "return"
            }

            if(leg0 && leg1)
            {
                costGraphBars.push(createGraphBarFromLeg(`${label}->`, leg0, barKeys))
                costGraphBars.push(createGraphBarFromLeg(`->${label}`, leg1, barKeys))
            }
            else if(leg0)
            {
                costGraphBars.push(createGraphBarFromLeg(`${label}`, leg0, barKeys))
            }
        })
    }


    console.log("nivo graph fired", costGraphBars)


    return(
        <div className={"h-80"}>

        
            <ResponsiveBar
                
                data={costGraphBars}
                keys={barKeys}
                indexBy="leg"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            maxValue={"auto"}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'leg',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'cost',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
            />
        </div>
        )    
}

export default NivoCostGraph