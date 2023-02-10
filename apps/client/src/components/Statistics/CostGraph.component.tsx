import { ResponsiveBar } from '@nivo/bar'

import { TMouldedDirections, TMouldedDirectionsLeg } from '../../Services/GMap.service'
import { useTripStore } from '../../Zustand/tripStore'

interface IBar extends Record<string, any>{
    leg: string,
    "Fuel Cost": number
}

interface INivoCostGraphProps{
    tripDirections: TMouldedDirections,
    fuelPrice: string,
    litersKm: string
}

const CostGraph: React.FC<INivoCostGraphProps> = ({tripDirections, fuelPrice, litersKm}) => {

    const vehicle = useTripStore(state => state.data.vehicle)

    

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
        const legData: IBar = {leg: legend, "Fuel Cost": (leg.distance.value / 1000 * pricePerKm(fuelPrice, litersKm))}

        let vehicleClass: "c1" | "c2" | "c3" | "c4" = "c1"
        if(vehicle)
        {
            if(vehicle.vehicleClass === "Class 1")
            {
                
            }
            else if(vehicle.vehicleClass === "Class 2")
            {
                vehicleClass = "c2"
            }
            else if(vehicle.vehicleClass === "Class 3")
            {
                vehicleClass = "c3"
            }
            else
            {
                vehicleClass = "c4"
            }
        }

        leg.passThroughTolls.forEach(tollAndGateIndex => {
            const gateSection = tollAndGateIndex.toll.gateSection[tollAndGateIndex.gateIndex]
            if(gateSection)
            {
                const tollName = tollAndGateIndex.toll.name + gateSection.nameExtention
                addKeyToKeys(tollName, barKeys)
                legData[tollName] = gateSection.tarrif[vehicleClass]
                
            }
                


        })
        //console.log(legData)
        return legData
    }



    function createBarGroupsAndKeys(tripDirections: TMouldedDirections)
    {
        const barKeys: string[] = ["Fuel Cost"]
        const barGroups: IBar[][] = []
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
                    barGroups.push([createGraphBarFromLeg(`${label}->`, leg0, barKeys), createGraphBarFromLeg(`->${label}`, leg1, barKeys)])
                    
                }
                else if(leg0)
                {
                    barGroups.push([createGraphBarFromLeg(`${label}`, leg0, barKeys)])
                }
            })
        }

        return {barGroups, barKeys}
    }

    const {barGroups, barKeys} = createBarGroupsAndKeys(tripDirections)

    function unravelBarGroups(barGroups: IBar[][])
    {
        const unraveledBars: IBar[] = []
        for(let i = 0; i < barGroups.length; i++)
        {
            unraveledBars.push(...barGroups[i]!)
        }
        return unraveledBars
    }


    console.log("nivo graph fired", barGroups)

    let tripTotalCost = 0;
    let tripTotalFuelCost = 0;


    return(
        <div className='space-y-4'>
            <div className="flex justify-center w-full text-base text-[#1976d2] font-bold ">Cost</div>
            <div className={"h-80"}>
                <ResponsiveBar
                    data={unravelBarGroups(barGroups)}
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
                    role="application"
                    ariaLabel="Trip cost by leg"
                    
                    //barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
                />
            </div>

            <div className={"flex flex-wrap gap-1"}>
                {barGroups.map((barGroup, index) => {
                    
                    const bar_from = barGroup[0]
                    const bar_to = barGroup[1]

                    if(bar_from)
                    {
                        let fuelCost = 0
                        let totalCost = 0;
                        let label = `${index + 1}`

                        fuelCost += bar_from['Fuel Cost']
                        barKeys.forEach(key => {
                            const value: number = bar_from[key]
                            if(value !== undefined)
                            {
                                totalCost += value
                            }
                        })

                        if(bar_to)
                        {
                            label += `->${index + 1}`
                            fuelCost += bar_to['Fuel Cost']
                            barKeys.forEach(key => {
                                const value: number = bar_to[key]
                                if(value !== undefined)
                                {
                                    totalCost += value
                                }
                            })
                        }

                        if(index === barGroups.length - 1)
                        {
                            label = "return"
                        }

                        tripTotalCost += totalCost;
                        tripTotalFuelCost += fuelCost
                        
                        return( 
                            <div key={`leg-bar-${index}`} className={"p-2 bg-slate-100 rounded-xl cursor-default w-32"}>
                                <div className={"text-xs font-bold"}>Leg: {label}</div>
                                <div className={"grid gap-x-1 gap-y-1 "} style={{gridTemplateColumns: "auto auto auto"}}>

                                    <div className={"text-xs"}>Toll Tarrifs:</div> 
                                    <div className={"text-xs"}>R</div>
                                    <div className={" text-xs flex justify-end"}>{(totalCost - fuelCost).toFixed(2)}</div>

                                    <div className={"text-xs"}>Fuel Cost:</div> 
                                    <div className={"text-xs"}>R</div>
                                    <div className={" text-xs flex justify-end"}>{fuelCost.toFixed(2)}</div>

                                    <div className={"text-xs"}>Total:</div> 
                                    <div className={"text-xs"}>R</div>
                                    <div className={" text-xs flex justify-end"}>{totalCost.toFixed(2)}</div>
                                </div>
                            </div>
                        )
                    }
                    else
                    {
                        return(<></>)
                    }

                })}
            </div>

            <div className='grid items-baseline gap-x-2 w-min' style={{gridTemplateColumns: "80px 1fr 1fr"}}>

                <div className='text-sm '>Toll Total:</div>
                <div>R</div>
                <div className=' text-end'>{(tripTotalCost - tripTotalFuelCost).toFixed(2)}</div>
                    
                <div className='text-sm '>Fuel Total:</div>
                <div>R</div>
                <div className='text-end '>{tripTotalFuelCost.toFixed(2)}</div>

                <div className='text-sm '>Grand Total:</div>
                <div>R</div>
                <div className='font-bold text-end '>{tripTotalCost.toFixed(2)}</div>

                <div className='text-sm '>Average:</div>
                <div>R</div>
                <div className='text-end '>{(tripTotalCost / barGroups.length - 1).toFixed(2)}</div>
                        
            </div>
        </div>
        
        )    
}

export default CostGraph