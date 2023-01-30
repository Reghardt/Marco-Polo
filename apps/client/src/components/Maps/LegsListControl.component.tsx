import produce from "immer"
import { useEffect, useState } from "react"
import { TMouldedDirections } from "../../Services/GMap.service"

interface ILegsListControl{
    mouldedDirections: TMouldedDirections,
    // setMouldedDirections: React.Dispatch<React.SetStateAction<TMouldedDirectionsSection[]>>
}

const LegsListControl: React.FC<ILegsListControl> = ({mouldedDirections}) => {

    console.log("Legs list control rerendered", mouldedDirections)

    // const Z_rows = useTripStore(store => store.data.rows)
    // const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
    // const Z_linkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)

    const [visibility, setVisibility ] = useState(new Array<boolean>(mouldedDirections.legGroups.length).fill(true))

    useEffect(() => {
        setPolylineOpacity()
    }, [visibility])

    function setPolylineOpacity()
    {
        for(let i = 0; i < mouldedDirections.legGroups.length; i++)
        {
            const group = mouldedDirections.legGroups[i];
            const vis = visibility[i]
            if(group)
            {
                for(let j = 0; j < group.legs.length; j++)
                {
                    const leg = group.legs[j]
                    if(leg)
                    {
                        leg.polyLine?.setOptions({
                            strokeOpacity: vis ? 1 : 0.2
                        })
                    }
                }
            }
        }
    }

    function createLegControlElements()
    {
        // let addressCounter = 0
        console.log(visibility)
        if(mouldedDirections.legGroups.length > 0)
        {
            return <div className={" cursor-default text-sm "}>
                {mouldedDirections.legGroups.map((group, index) => {

                    return (
                        <div key={`leg-control-${index}`} className={"flex justify-between items-center p-1 hover:bg-slate-100"}>
                                
                            {group.legs[0] && group.legs[1]
                                ?   (() => { 
                                        const legControl = <div>{index + 1} -&gt; {index + 1}</div>
                                        return legControl
                                    })()
                                :   
                                
                                    index !== mouldedDirections.legGroups.length - 1 
                                    ? 
                                    (() => { 
                                        const legControl = <div>{index + 1}</div>
                                        return legControl
                                    })()
                                    :
                                    <div>Return</div>
                            }

                            <div>
                                <input type="checkbox" checked={visibility[index]} onChange={(change) => {
                                    console.log(change.target.checked)
                                    setVisibility(produce(draft => {
                                            draft[index] = change.target.checked
                                        }))
                                    }}
                                />
                            </div>
                        </div>  
                    )
                })}

                <div className={"flex justify-between items-center p-1 hover:bg-slate-100"}>
                    <div>Toggle</div>
                    <div>
                        <input type="checkbox"
                        checked={(
                            () => {
                                for(let i = 0; i < visibility.length; i++)
                                {
                                    if(visibility[i] === false)
                                    {
                                        return false
                                    }
                                }
                                return true
                            })()
                        }
                        onChange={(change) => {
                            setVisibility(
                                produce((draft) => {
                                    for(let i = 0; i < draft.length; i++)
                                    {
                                        draft[i] = change.target.checked
                                    }
                                })
                            )
                        }} />
                    </div>
                </div>
                
                
            </div>
        }
        else
        {
            return <></>
        } 
    }

    return (
        <div className={"bg-white p-1 text-base mt-8"}>
            <div>Leg Visibility</div>
            {createLegControlElements()}

        </div>
        
    )
}

export default LegsListControl