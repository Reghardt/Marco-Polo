import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"

import React, { useEffect, useState } from "react"
import { useTripStore } from "../../../../../Zustand/tripStore";

import HelpTooltip from "../../../../common/HelpTooltip.component";
import { ICell } from "../../../../common/CommonInterfacesAndEnums";
import { geocodeAddress } from "../../../../../Services/Trip.service";



interface IAddressCellPopperProps{
    currentAddress: string;
    closePopper : () => void;
    cellRef: ICell;
    //recalculateRoute(departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number): Promise<void>
}

const AddressPopper: React.FC<IAddressCellPopperProps> = (
    {
        currentAddress, 
        closePopper, 
        cellRef,
    }) => {

    const [geoStatusAndRes, setGeoStatusAndRes] = useState(cellRef.geocodedDataAndStatus);

    const [selectedGeocodedAddressIndex, setSelectedGeocodedAddressIndex] = useState(cellRef.selectedGeocodedAddressIndex)
    const [textboxContent, setTextboxContent] = useState(currentAddress)
    const [errorMessage, setErrorMessage] = useState("")



    const ZR_updateBodyCell = useTripStore(store => store.reducers.updateBodyCell)
    const ZR_deleteRow = useTripStore((state) => state.reducers.deleteRow)

    useEffect( () => {
        if(cellRef.geocodedDataAndStatus === null)
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
            ZR_updateBodyCell({...cellRef, displayData: textboxContent, geocodedDataAndStatus: geoStatusAndRes, selectedGeocodedAddressIndex: selectedGeocodedAddressIndex, isAddressValidAndAccepted: true})
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
        <Paper variant="elevation" elevation={20}>
            <DialogTitle sx={{paddingTop: "0.5em", paddingBottom: 0}}>
                <Stack direction={"row"} alignItems="center" spacing={1}>
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{color:"#1976d2"}}>Address Checker</Typography> 
                    </Box>
                    <Box>
                        <HelpTooltip title={"Check the given address against Google Maps to confirm its validity and existence"}/>
                    </Box>
                </Stack>
            </DialogTitle>
            
            <DialogContent sx={{padding: "0.8em"}}>

                <Stack spacing={1} sx={{paddingTop: "1em"}}>
                    <Box>
                        <TextField 
                            onChange={(e)=> captureInput(e.target.value)}  
                            defaultValue={textboxContent} 
                            size="medium" 
                            label="Address"
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Button onClick={()=> generateGeocodeResults(textboxContent)}>Search</Button>
                    </Box>
                </Stack>

                {geoStatusAndRes?.results  && (
                    <Box>
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
                    </Box>
                    
                )}

                {errorMessage && (
                    <Box>
                        <p style={{color: "red"}}>{errorMessage}</p>
                    </Box>
                        
                    )}
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={() => handleSaveAndClose()}>Save</Button>
                <Button variant="outlined" onClick={() => closePopper()}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleDeleteRow(cellRef.y)}>Delete Row</Button>
            </DialogActions>
        </Paper>
    )
}

export default AddressPopper