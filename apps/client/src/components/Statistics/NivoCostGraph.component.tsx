import { ResponsiveBar } from '@nivo/bar'

import { TMouldedDirections, TMouldedDirectionsLeg } from '../../Services/GMap.service'

interface ILegBarKeys extends Record<string, any>{
    leg: string,
    "Fuel Cost": number
}

interface INivoCostGraphProps{
    tripDirections: TMouldedDirections,
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
        const legData: ILegBarKeys = {leg: legend, "Fuel Cost": (leg.distance.value / 1000 * pricePerKm(fuelPrice, litersKm))}

        leg.passThroughTolls.forEach(tollAndGateIndex => {
            const gateSection = tollAndGateIndex.toll.gateSection[tollAndGateIndex.gateIndex]
            if(gateSection)
            {
                const tollName = tollAndGateIndex.toll.name + gateSection.nameExtention
                addKeyToKeys(tollName, barKeys)
                legData[tollName] = gateSection.tarrif.c1
            }
                


        })
        //console.log(legData)
        return legData
    }

    const barKeys: string[] = ["Fuel Cost"]
    const costGraphBars: ILegBarKeys[] = []
    if(tripDirections)
    {

        tripDirections.legGroups.forEach((group, index) => {
            // console.log("leg group")
            const leg0 = group.legs[0]
            const leg1 = group.legs[1]

            let label = (index + 1).toString()
            if(tripDirections.legGroups.length - 1 === index)
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
        <div>
            <div className={" text-base"}>Trip Cost:</div>
            <div className={"h-80"}>
                <ResponsiveBar
                    data={costGraphBars}
                    keys={barKeys}
                    indexBy="leg"
                    margin={{bottom: 50, left: 60, top: 20 }}
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
                        legendOffset: 32,
                        // format: (value => value + " test")
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Cost (Rands)',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    valueFormat={value => `R${value.toFixed(2)}`}
                    // legends={[
                    //     {
                    //         dataFrom: 'keys',
                    //         anchor: 'bottom-right',
                    //         direction: 'column',
                    //         justify: false,
                    //         translateX: 120,
                    //         translateY: 0,
                    //         itemsSpacing: 2,
                    //         itemWidth: 100,
                    //         itemHeight: 20,
                    //         itemDirection: 'left-to-right',
                    //         itemOpacity: 0.85,
                    //         symbolSize: 20,
                    //         effects: [
                    //             {
                    //                 on: 'hover',
                    //                 style: {
                    //                     itemOpacity: 1
                    //                 }
                    //             }
                    //         ]
                    //     }
                    // ]}
                    role="application"
                    ariaLabel="Trip cost by leg"
                    barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
                    />
                </div>

                <div className={"flex flex-wrap gap-1"}>
                    {costGraphBars.map((bar, index) => {
                        let totalCost = 0;
                        barKeys.forEach(key => {
                            const value: number = bar[key]
                            if(value !== undefined)
                            {
                                totalCost += value
                            }
                        })
                        return( 
                            <div key={`leg-bar-${index}`} className={"p-2 bg-slate-100 rounded-xl cursor-default"}>
                                <div className={"text-xs font-bold"}>Leg: {bar.leg}</div>
                                <div className={"grid gap-x-1 gap-y-1 "} style={{gridTemplateColumns: "auto auto auto"}}>

                                    <div className={"text-xs"}>Toll Tarrifs:</div> 
                                    <div className={"text-xs"}>R</div>
                                    <div className={" text-xs flex justify-end"}>{(totalCost - bar['Fuel Cost']).toFixed(2)}</div>

                                    <div className={"text-xs"}>Fuel Cost:</div> 
                                    <div className={"text-xs"}>R</div>
                                    <div className={" text-xs flex justify-end"}>{bar['Fuel Cost'].toFixed(2)}</div>

                                    <div className={"text-xs"}>Total:</div> 
                                    <div className={"text-xs"}>R</div>
                                    <div className={" text-xs flex justify-end"}>{totalCost.toFixed(2)}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>

        </div>
        
        )    
}

export default NivoCostGraph