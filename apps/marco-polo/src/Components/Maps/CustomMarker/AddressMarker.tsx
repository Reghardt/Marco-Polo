import {  autoUpdate, flip, offset, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import { useRef, useState } from "react";
import { createTripDirections } from "../../../Services/GMap.service";
import { useTripStore } from "../../../Zustand/tripStore";
import { ICell, IRow } from "../../common/CommonInterfacesAndEnums";


export enum EAddressMarkerType{
    DEP_RET,
    ADDRESS,
    CUSTOM
}

interface IAddressMarker{
    label: string,
    markerType: EAddressMarkerType;
    popperData: {cell: ICell, rowIndex: number} | null
}



const AddressMarker: React.FC<IAddressMarker> = ({label, markerType, popperData}) => {

    const selfRef = useRef<HTMLDivElement>(null)

    const Z_tripRows = useTripStore(store => store.data.rows)
    const ZF_setTripRows = useTripStore(store => store.actions.setTripRows)

    const [open, setOpen] = useState(false);

    const {x, y, reference, floating, strategy, context} = useFloating({
        middleware: [
          offset(-4),
          flip(),
        ],
        whileElementsMounted: autoUpdate,
        placement: "top",
        open,
        onOpenChange: handleSetOpen,
    
      });
    
      const dismiss = useDismiss(context);
      const {getReferenceProps, getFloatingProps} = useInteractions([
        dismiss,
      ]);

    function createNumericNameFromNumber(nr: number)
    { 
        const lastChar = nr.toString().at(-1)
        if(lastChar === '1' && nr < 4)
        {
            return nr + "st"
        }
        else if(lastChar === '2' && nr < 4)
        {
            return nr + "nd"
        }
        else if(lastChar === '3' && nr < 4)
        {
            return nr + "rd"
        }
        else 
        {
            return nr + "th"
        }
    }


    function getMarkerColor(markerType: EAddressMarkerType)
    {
        if(markerType === EAddressMarkerType.DEP_RET)
        {
            return "#00772e"
        }
        else if(markerType === EAddressMarkerType.ADDRESS)
        {
            return "#1976d2"
        }
        else if(markerType === EAddressMarkerType.CUSTOM)
        {
            return "#cf6e00"
        }
        else
        {
            return "#cf0000"
        }
    }

    function swap(list: IRow[], startIndex: number, endIndex: number )
    {

        const swapedRows: IRow[] = Array.from(list)
        var b = swapedRows[endIndex]!;
        swapedRows[endIndex] = swapedRows[startIndex]!;
        swapedRows[startIndex] = b;

        return swapedRows

    }

    function handleSetOpen(newState: boolean)
    {
        setOpen(() => {
            if(newState) //open
            {
                setZIndex(100)
                return true
            }
            else //close
            {
                setZIndex(1)
                return false
            }
        });
    }

    //changes z index of the anchor parent that is displayed on the map. The parent's z index is then chaged relative to the other marker's z indces
    function setZIndex(zIndex: number)
    {
        if(selfRef.current?.parentElement?.parentElement)
        {
            selfRef.current.parentElement.parentElement.style.zIndex = zIndex.toString()
        }
    }

    return (
        <div ref={selfRef}>
        <button 
        
            {...getReferenceProps()} 
            ref={reference} 
            onClick={()=> handleSetOpen(!open)} 
            className="w-8 h-8 text-white rounded-full"
            style={{backgroundColor: getMarkerColor(markerType)}}
        >
            <div>{label}</div>
        </button>

        {open && popperData && (
          <div 
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: '250px',
              zIndex: 1
            }}
            {...getFloatingProps()}
          >
            <div className="p-4 bg-white rounded-md shadow-2xl ">
                {popperData && (
                    <div className="flex flex-col gap-2">
                        <div>{popperData.cell.displayData}</div>
                        <div className="flex items-center space-x-2 text-base">
                            <div>Visit:</div>
                            <div>
                                <Select 
                                    size="small"
                                    value={popperData.rowIndex + 1}
                                    onChange={(change) => {
                                        console.log(change.target.value)
                                        handleSetOpen(!open)
                                        ZF_setTripRows(swap(Z_tripRows, popperData.rowIndex, (change.target.value as number) - 1))
                                        createTripDirections(false, true)
                                    }}
                                >
                                    {
                                        (() => {
                                            //dropdown options, choose 1st, 2nd, 3rd...
                                            const visitSequenceOptionItems: React.ReactElement[] =[]
                                            const nrOfRows = Z_tripRows.length
                                            for(let i = 0; i < nrOfRows; i++)
                                            {
                                                visitSequenceOptionItems.push(<MenuItem key={`menu-item-${i}`} value={i + 1}>{createNumericNameFromNumber(i + 1)}</MenuItem>)
                                            }
                                            return visitSequenceOptionItems
                                        })()
                                    }
                                </Select>
                            </div>
                        </div>
                        
                    </div>
                )}
                
            </div>

          </div>
        )}

        </div>

    )
}

export default AddressMarker