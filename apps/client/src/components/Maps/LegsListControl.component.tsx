import produce from "immer"
import { useEffect, useState } from "react"
import { TMouldedDirectionsSection } from "../../Services/GMap.service"

interface ILegsListControl{
    mouldedDirections: TMouldedDirectionsSection[],
    // setMouldedDirections: React.Dispatch<React.SetStateAction<TMouldedDirectionsSection[]>>
}

const LegsListControl: React.FC<ILegsListControl> = ({mouldedDirections}) => {

    console.log("Legs list control rerendered", mouldedDirections)

    // const Z_rows = useTripStore(store => store.data.rows)
    // const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
    // const Z_linkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)

    const [visibility, setVisibility ] = useState(new Array<boolean>(mouldedDirections.length).fill(true))

    useEffect(() => {
        setPolylineOpacity()
    }, [visibility])

    function setPolylineOpacity()
    {
        for(let i = 0; i < mouldedDirections.length; i++)
        {
            const section = mouldedDirections[i];
            const vis = visibility[i]
            if(section)
            {
                for(let j = 0; j < section.legs.length; j++)
                {
                    const leg = section.legs[j]
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
        if(mouldedDirections.length > 0)
        {
            return <div className={" cursor-default text-sm "}>
                {mouldedDirections.map((section, index) => {

  
                    return (
                        <div key={`leg-control-${index}`} className={"flex justify-between items-center p-1 hover:bg-slate-100"}>
                                
                            {section.legs[0] && section.legs[1]
                                ?   (() => { 
                                        const legControl = <div>{index + 1} -&gt; {index + 1}</div>
                                        return legControl
                                    })()
                                :   
                                
                                    index !== mouldedDirections.length - 1 
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