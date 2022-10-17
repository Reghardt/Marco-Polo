import { Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { geocodeAddress } from "../Trip.service";

interface IAddressSelectorPopup{
    title: string;
    address: google.maps.GeocoderResult;
    addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    toggleShow: () => void;
}

const AddressSelectorPopup: React.FC<IAddressSelectorPopup> = ({title, address, addressSetter, toggleShow}) => {
    
    const [localAddress, setLocalAddress] = useState<string>(address === null ? "" : address.formatted_address)
    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult>(null)

    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if(localAddress === "")
        {
          setLocalAddress("Specify Address")
        }
      }, [])

    function generateGeocodeResults()
    {
      geocodeAddress(localAddress).then(geocoded => {
          console.log(geocoded)
          if(geocoded.status === "OK")
          {
              console.log("OK")
              setGeocodedResults(geocoded.results)
              setErrorMessage("")
          }
          else
          {
            setErrorMessage("No results, try a more specific name or address")
          }
          setSelectedAddress(null)
      })
    }

    function handleAddressSelection(index: string)
    {
      console.log(geocodedResults[parseInt(index)])
      setSelectedAddress(geocodedResults[parseInt(index)]);
    }

    function captureInput(input: string)
      {
          setLocalAddress(input)
      }

      function saveAddress()
      {
        if(selectedAddress)
        {
          addressSetter(selectedAddress)
          setGeocodedResults([])
          toggleShow()
        }
        else
        {
          setErrorMessage("Please click search and make a selection")
        } 
      }

    function handleCancel()
    {
      toggleShow()
    }
    
    return(
        <Paper className="paper">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <br></br>
                <TextField defaultValue={address === null ? "" : address.formatted_address} onChange={(e)=> captureInput(e.target.value)} size="medium" label="Address" fullWidth></TextField>
                <br/>
                <Button onClick={()=> generateGeocodeResults()}>Search</Button>
                <br/>

                {geocodedResults.length > 0 &&  
                    (<FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Results:</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            onChange={(e) => handleAddressSelection(e.target.value)}
                        >
                            {geocodedResults.map((elem, idx) => {
                                return <FormControlLabel key={`dep-ret-${idx}`} value={idx} control={<Radio />} label={elem.formatted_address} />
                                })}
                        </RadioGroup>
                    </FormControl>

            )}
                {errorMessage && (
                    <p style={{color: "red"}}>{errorMessage}</p>
                )}
            </DialogContent>

            

            <DialogActions>
                <Button onClick={() => saveAddress()}>Save</Button>
                <Button onClick={() => {handleCancel()}}>Cancel</Button>
            </DialogActions>
        </Paper>
    )
}

export default AddressSelectorPopup