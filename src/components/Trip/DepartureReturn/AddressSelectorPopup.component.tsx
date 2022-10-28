import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Stack, TextField} from "@mui/material"
import React, { useState } from "react"
import { geocodeAddress } from "../Trip.service";
import AddressBookDialog from "./AddressBookDialog.component";

interface IAddressSelectorPopup{
    title: string;
    address: google.maps.GeocoderResult;
    addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    toggleShow: () => void;
}

const AddressSelectorPopup: React.FC<IAddressSelectorPopup> = ({title, address, addressSetter, toggleShow}) => {
    
    const [physicalAddressStr, setPhysicalAddressStr] = useState<string>(address === null ? "" : address.formatted_address)
    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>([]);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0)

    const [errorMessage, setErrorMessage] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false)

    // useEffect(() => {
    //     if(physicalAddressStr === "")
    //     {
    //       setPhysicalAddressStr("Specify Address")
    //     }
    //   }, [])

    function generateGeocodeResults(address: string)
    {
      if(address)
        {
          geocodeAddress(address).then(geocoded => {
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
            setSelectedAddressIdx(0)
          })
        }
        else
        {
          setErrorMessage("Please enter an address")
        }

      
    }

    function handleAddressSelection(index: string)
    {
      console.log(geocodedResults[parseInt(index)])
      setSelectedAddressIdx(parseInt(index));
    }

    function captureInput(input: string)
      {
          setPhysicalAddressStr(input)
      }

      function saveAddress()
      {
        if(geocodedResults.length > 0)
        {
          addressSetter(geocodedResults[selectedAddressIdx])
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

    function applyAddressBookSelection(address: string)
    {
      console.log("address book selection fired", address)
      setIsModalOpen(!isModalOpen);
      generateGeocodeResults(address);
      setPhysicalAddressStr(address)
    }

    
    return(
        <Paper elevation={15}>
            <DialogTitle variant="h5" gutterBottom sx={{color:"#1976d2"}}>{title}</DialogTitle>
            <DialogContent>
              <Stack spacing={1}>
                <Box>
                  <Button variant="outlined" onClick={() => setIsModalOpen(!isModalOpen)}>Address Book</Button>
                </Box>
                <Box>
                  <TextField value={physicalAddressStr} onChange={(e)=> captureInput(e.target.value)} size="medium" label="Address" fullWidth></TextField>
                </Box>

                <Box>
                  <Button onClick={()=> generateGeocodeResults(physicalAddressStr)}>Search</Button>
                </Box>

                {geocodedResults.length > 0 && (
                  <Box>
                    <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">Results:</FormLabel>
                      <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          onChange={(e) => handleAddressSelection(e.target.value)}
                          value={selectedAddressIdx}
                      >
                          {geocodedResults.map((elem, idx) => {
                              return <FormControlLabel key={`dep-ret-${idx}`} value={idx} control={<Radio />} label={elem.formatted_address} />
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

              </Stack>

              <Dialog
               PaperProps={{sx: {width: "80%", minHeight: "90%"}}}
                open={isModalOpen}
                scroll={"body"}
                //onClose={}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <AddressBookDialog setIsModalOpen={setIsModalOpen} applyAddressBookSelection={applyAddressBookSelection}/>
              </Dialog>

                

                
            </DialogContent>

            

            <DialogActions>
                <Button variant="outlined" onClick={() => saveAddress()}>Save</Button>
                <Button variant="outlined" onClick={() => {handleCancel()}}>Cancel</Button>
            </DialogActions>
        </Paper>
    )
}

export default AddressSelectorPopup