import produce from "immer"
import { useEffect, useState } from "react"
import { isValidAddress } from "../../Services/GMap.service"
import { useTripStore } from "../../Zustand/tripStore"

interface ILegsListControl{
    polyLines: React.MutableRefObject<google.maps.Polyline[]>
}

const LegsListControl: React.FC<ILegsListControl> = ({polyLines}) => {

    const Z_rows = useTripStore(store => store.data.rows)
    const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
    const Z_linkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)

    const [visibility, setVisibility ] = useState(new Array<boolean>(Z_rows.length + 1).fill(true))

    useEffect(() => {
        setPolylineOpacity()
    }, [visibility])

    function setPolylineOpacity()
    {
        let polyLinesIndex = 0;
        if(Z_rows.length === visibility.length - 1)
        {
            for(let i = 0; i < Z_rows.length; i++)
            {
                const row = Z_rows[i]
                const vis = visibility[i]
                if(row && vis !== undefined)
                {
                    // console.log(i, row)
                    if(isValidAddress(row, Z_addressColumnIndex))
                    {
                        polyLines.current[polyLinesIndex]?.setOptions({
                            strokeOpacity: vis ? 1 : 0.2
                        })
                        polyLinesIndex++;
                    }
    
                    if(isValidAddress(row, Z_linkAddressColumnIndex))
                    {
 
                        polyLines.current[polyLinesIndex]?.setOptions({
                            strokeOpacity: vis ? 1 : 0.2
                        })
                        polyLinesIndex++;
                    }
                }
            }
    
            polyLines.current[polyLines.current.length - 1]?.setOptions({
                strokeOpacity: visibility[visibility.length - 1] ? 1 : 0.2
            })
        }

    }

    function createLegControlElements()
    {
        let addressCounter = 0
        if(Z_rows.length > 0)
        {
            return <div className={" cursor-default text-sm "}>
                {Z_rows.map((row, index) => {
                    return (
                        <div key={`leg-control-${index}`} className={"flex justify-between items-center p-1 hover:bg-slate-100"}>
                                
                            {isValidAddress(row, Z_addressColumnIndex) && isValidAddress(row, Z_linkAddressColumnIndex) 
                                ?   (() => { 
                                        const legControl = <div>{addressCounter + 1} -&gt; {addressCounter + 1}</div>
                                        addressCounter++
                                        return legControl
                                    })()
                                :   (() => { 
                                        const legControl = <div>{addressCounter + 1}</div>
                                        addressCounter++
                                        return legControl
                                    })() 
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
                    <div>Return</div>
                    <div>
                        <input type="checkbox"
                        checked={visibility[visibility.length - 1]}
                        onChange={(change) => {
                            setVisibility(
                                produce((draft) => {
                                    draft[draft.length - 1] = change.target.checked
                                })
                            )
                        }} />
                    </div>
                </div>

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
        <div className={"bg-white p-1 text-base"}>
            <div>Leg Visibility</div>
            {createLegControlElements()}

        </div>
        
    )
}

export default LegsListControl