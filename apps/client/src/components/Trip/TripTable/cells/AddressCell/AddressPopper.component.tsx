import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material"

import React, { useEffect, useState } from "react"
import { useTripStore } from "../../../../../Zustand/tripStore";

import HelpTooltip from "../../../../common/HelpTooltip.component";
import { ICell } from "../../../../common/CommonInterfacesAndEnums";
import { geocodeAddress } from "../../../../../Services/Trip.service";



interface IAddressCellPopperProps{
    closePopper : () => void;
    cellRef: ICell;
    //recalculateRoute(departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number): Promise<void>
}

const AddressPopper: React.FC<IAddressCellPopperProps> = (
    {
        closePopper, 
        cellRef,
    }) => {

    const [geoStatusAndRes, setGeoStatusAndRes] = useState(cellRef.geocodedDataAndStatus);

    const [selectedGeocodedAddressIndex, setSelectedGeocodedAddressIndex] = useState(cellRef.selectedGeocodedAddressIndex)
    const [textboxContent, setTextboxContent] = useState(cellRef.displayData)
    const [errorMessage, setErrorMessage] = useState("")



    const ZR_updateBodyCell = useTripStore(store => store.actions.updateBodyCell)
    const ZR_deleteRow = useTripStore((state) => state.actions.deleteRow)

    useEffect( () => {
        if(cellRef.geocodedDataAndStatus === null && cellRef.displayData)
        {
            generateGeocodeResults(cellRef.displayData)
        }
    }, [])

    function captureInput(input: string)
    {
      console.log(input)
      setTextboxContent(input)
    }

    async function generateGeocodeResults(address: string)
    {
        const geoRes = await geocodeAddress(address)
        setGeoStatusAndRes(geoRes) 
        if(geoRes.status !== google.maps.GeocoderStatus.OK)
        {
            setErrorMessage(geoRes.status.toString())
        }
      
    }

    function handleAddressSelection(index: string)
    {
      setSelectedGeocodedAddressIndex(parseInt(index))
      setErrorMessage("")
    }

    function handleSaveAndClose()
    {
        if(geoStatusAndRes?.results)
        {
            ZR_updateBodyCell({...cellRef, displayData: textboxContent, geocodedDataAndStatus: geoStatusAndRes, selectedGeocodedAddressIndex: selectedGeocodedAddressIndex, isAddressAccepted: true})
            closePopper()
        }
        else
        {
            setErrorMessage("Click Search to find address")
        }
        
    }

    async function handleDeleteRow(rowYCoord: number)
    {
        closePopper()
        ZR_deleteRow(rowYCoord)
    }

    //TODO delete button to remove address. View on map option to preview location
    return(
        <div className={"shadow-2xl bg-white"}>
            <div className={"bg-[#1976d2] w-full h-1"}></div>
            <div className={"p-4 space-y-4"}>


                <div className={"flex space-x-2 "}>
                    <div>
                        <div className={"text-[#1976d2] text-base"}>Address Checker</div> 
                    </div>
                    <div>
                        <HelpTooltip title={"Check the given address against Google Maps to confirm its validity and existence"}/>
                    </div>
                </div>

                <div>
                    <TextField 
                        onChange={(e)=> captureInput(e.target.value)}  
                        defaultValue={textboxContent} 
                        size="medium" 
                        label="Address"
                        fullWidth
                    />
                </div>
                <div>
                    <Button variant="contained" onClick={()=> generateGeocodeResults(textboxContent)}>Search</Button>
                </div>

                {geoStatusAndRes?.results  && (
                    <div>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Results:</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                onChange={(e) => handleAddressSelection(e.target.value)}
                                value={selectedGeocodedAddressIndex}
                            >
                                {geoStatusAndRes.results?.map((elem, idx) => {
                                    return <FormControlLabel key={idx} value={idx} control={<Radio />} label={elem.formatted_address} />
                                    })}
                            </RadioGroup>
                        </FormControl>
                    </div>
                    
                )}

                {errorMessage && (
                    <Box>
                        <p style={{color: "red"}}>{errorMessage}</p>
                    </Box>
                )}

                <div className="flex gap-2">
                    <Button variant="contained" onClick={() => handleSaveAndClose()}>Save</Button>
                    <Button variant="text" onClick={() => closePopper()}>Cancel</Button>
                    <Button variant="text" color="error" onClick={() => handleDeleteRow(cellRef.y)}>Delete Row</Button>
                </div>
            </div>
           
        </div>
    )
}

export default AddressPopper