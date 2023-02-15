import { Button} from "@mui/material"

import React from "react"
import { useTripStore } from "../../../../../Zustand/tripStore";

import HelpTooltip from "../../../../common/HelpTooltip.component";
import { IAddress, ICell } from "../../../../common/CommonInterfacesAndEnums";
import GAutoComplete from "../../../../Experiments/GAutoComplete.component";




interface IAddressCellPopperProps{
    closePopper : () => void;
    cell: ICell;
    //recalculateRoute(departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number): Promise<void>
}

const AddressPopper: React.FC<IAddressCellPopperProps> = (
    {
        closePopper, 
        cell,
    }) => {

    const ZF_updateBodyCell = useTripStore(store => store.actions.updateBodyCell)
    const ZF_deleteRow = useTripStore((state) => state.actions.deleteRow)

    function handleUpdateBodyCell(address: IAddress | null)
    {
        //
        if(address)
        {
            ZF_updateBodyCell({...cell, displayData: address.formatted_address ? address.formatted_address : cell.displayData, address: address})
            closePopper()
        }

    }

    async function handleDeleteRow(rowYCoord: number)
    {
        closePopper()
        ZF_deleteRow(rowYCoord)
    }

    function acceptAddress()
    {
        if(cell.address.latLng)
        {
          ZF_updateBodyCell({...cell, address: {...cell.address, isAddressAccepted: true}})
        }

    }



    //TODO delete button to remove address. View on map option to preview location
    return(
        <div className={"shadow-2xl bg-white"}>
            <div className={"bg-[#1976d2] w-full h-1"}></div>
            <div className={"p-4 space-y-4"}>


                <div className={"flex space-x-2 "}>
                    <div>
                        <div className={"text-[#1976d2] text-base"}>Address Finder</div> 
                    </div>
                    <div>
                        <HelpTooltip title={"Check the given address against Google Maps to confirm its validity and existence"}/>
                    </div>
                </div>

                <div>
                    <div className="text-sm ">
                        Click in textbox to see results:
                    </div>
                    <div>
                        <GAutoComplete setAddress={handleUpdateBodyCell} currentAddress={cell.displayData}/>
                    </div>
                    
                </div>


                {!cell.address.latLng && (
                    <div>
                        <p style={{color: "red"}}>Address not valid</p>
                    </div>
                )}

                {cell.address.latLng && cell.address.isAddressAccepted === false && (
                    <div>
                        <p style={{color: "red"}}>Address not confirmed, click "CONFIRM" to do so.</p>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="contained" onClick={() => acceptAddress()}>Confirm</Button>
                    <Button variant="text" onClick={() => closePopper()}>Cancel</Button>
                    <Button variant="text" color="error" onClick={() => handleDeleteRow(cell.y)}>Delete Row</Button>
                </div>
            </div>
           
        </div>
    )
}

export default AddressPopper