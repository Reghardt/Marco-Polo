import { Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { ICell } from "../../../../../services/worksheet/cell.interface";
import { IRow } from "../../../../../services/worksheet/row.interface";
import { RSAddresColumnIndex, RSDepartureAddress, RSReturnAddress, RSTripRows, } from "../../../../../state/globalstate";

import { geocodeAddress } from "../../../../Trip/Trip.service";
import { deleteRow } from "../../MasterSequence.service";

interface IAddressCellPopperProps{
    currentAddress: string;
    closePopper : () => void;
    saveAndClose: (cell: ICell) => void;
    cellRef: ICell;
    recalculateRoute(departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number): Promise<void>
}

const AddressPopper: React.FC<IAddressCellPopperProps> = (
    {
        currentAddress, 
        closePopper, 
        saveAndClose, 
        cellRef,
        recalculateRoute
    }) => {

    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>([]);
    const [selectedGeocodedAddressIndex, setSelectedGeocodedAddressIndex] = useState(-1)

    const [textboxContent, setTextboxContent] = useState(currentAddress)
    
    const [R_tripRows, R_setTripRows] = useRecoilState(RSTripRows)
    const [errorMessage, setErrorMessage] = useState("")

    const R_departureAddress = useRecoilValue(RSDepartureAddress);
    const R_returnAddress = useRecoilValue(RSReturnAddress);
    const R_addressColumnIndex = useRecoilValue(RSAddresColumnIndex)

    function captureInput(input: string)
    {
      console.log(input)
      setTextboxContent(input)
    }

    function generateGeocodeResults(address: string)
    {
      geocodeAddress(address).then(geocoded => {
          console.log(geocoded.results)
          if(geocoded.status === "OK")
          {
              console.log("OK")
              setGeocodedResults(geocoded.results)
              setErrorMessage("")
              setSelectedGeocodedAddressIndex(-1)
          }
          else
          {
            setSelectedGeocodedAddressIndex(-1)
            setGeocodedResults([])
            setErrorMessage("No results, try a more specific name or address")
          }
          //TODO on not ok
        //   setShow(false);
        //   setShouldReopen(true);
      })
      
    }

    function handleAddressSelection(index: string)
    {
      console.log(geocodedResults[parseInt(index)])
      setSelectedGeocodedAddressIndex(parseInt(index))
      setErrorMessage("")
    }

    function handleSaveAndClose()
    {
        if(selectedGeocodedAddressIndex > -1)
        {
            const tempCell = JSON.parse(JSON.stringify(cellRef)) as ICell;
            tempCell.data = geocodedResults[selectedGeocodedAddressIndex].formatted_address;
            tempCell.geocodedAddressRes = geocodedResults[selectedGeocodedAddressIndex];
            tempCell.geocodedResults = geocodedResults;
            tempCell.selectedGeocodedAddressIndex = selectedGeocodedAddressIndex;
            saveAndClose(tempCell)
        }
        else if(geocodedResults.length > 0)
        {
            setErrorMessage("Please select an address option ")
        }
        else
        {
            setErrorMessage("Click Search to find address")
        }
        
    }

    async function handleDeleteRow(rowYCoord: number, rows: IRow[])
    {
        closePopper()
        let postDeletionRows = await deleteRow(rowYCoord, rows)
        if(R_departureAddress && R_returnAddress)
        {
            recalculateRoute(R_departureAddress.formatted_address, R_returnAddress.formatted_address, postDeletionRows, R_addressColumnIndex)
        }
        R_setTripRows(postDeletionRows)
    }

    //TODO delete button to remove address. View on map option to preview location
    return(
        <Paper variant="elevation" elevation={20}>
            <DialogTitle sx={{paddingTop: "0.5em", paddingBottom: 0}}>Address Checker</DialogTitle>
            <DialogContent sx={{padding: "0.8em"}}>
                <br></br>
                <TextField 
                    onChange={(e)=> captureInput(e.target.value)}  
                    defaultValue={textboxContent} 
                    size="medium" 
                    label="Address"
                    sx={{width: "33em"}}
                />
                <br/>
                <Button onClick={()=> generateGeocodeResults(textboxContent)}>Search</Button>
                <br/>

                {geocodedResults.length > 0 &&  
                (<FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Results:</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        onChange={(e) => handleAddressSelection(e.target.value)}
                        value={selectedGeocodedAddressIndex}
                    >
                        {geocodedResults.map((elem, idx) => {
                            return <FormControlLabel key={idx} value={idx} control={<Radio />} label={elem.formatted_address} />
                            })}
                    </RadioGroup>
                </FormControl>)}
                {errorMessage && (
                        <p style={{color: "red"}}>{errorMessage}</p>
                    )}
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={() => handleSaveAndClose()}>Save</Button>
                <Button variant="outlined" onClick={() => closePopper()}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleDeleteRow(cellRef.y, R_tripRows)}>Delete Row</Button>
            </DialogActions>
        </Paper>
    )
}

export default AddressPopper