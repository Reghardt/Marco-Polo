import {  Button, Dialog, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material"
import React, { useState } from "react"
import { geocodeAddress } from "../../../Services/Trip.service";
import AddressBookDialog from "./AddressBookDialog.component";

interface IAddressSelectorPopup{
    title: string;
    address: google.maps.GeocoderResult | null;
    //addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    addressSetter: (address: google.maps.GeocoderResult) => void
    toggleShow: () => void;
}

const AddressSelectorPopup: React.FC<IAddressSelectorPopup> = ({title, address, addressSetter, toggleShow}) => {
    
    const [physicalAddressStr, setPhysicalAddressStr] = useState<string>(address === null ? "" : address.formatted_address)
    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>([]);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0)

    const [errorMessage, setErrorMessage] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false)

    function generateGeocodeResults(address: string)
    {
      if(address)
        {
          geocodeAddress(address).then(geocoded => {
            console.log(geocoded)
            if(geocoded.status === "OK")
            {
                console.log("OK")
                setGeocodedResults(geocoded.results ?? [])
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
        const geoResult = geocodedResults[selectedAddressIdx]
        if(geocodedResults.length > 0 && geoResult)
        {
          addressSetter(geoResult)
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

      <div className={"shadow-2xl bg-white"}>
        <div className={"bg-[#1976d2] w-full h-1"}></div>
        <div className={"p-4 text-[#1976d2] text-base mb-4"}>
          <div className={""}>{title}</div>

          <div className={"space-y-4"}>
            <div>
              <Button variant="contained" onClick={() => setIsModalOpen(!isModalOpen)}>Address Book</Button>
            </div>
            <div>
              <TextField style={{marginTop: "4px", width: "30em"}} value={physicalAddressStr} onChange={(e)=> captureInput(e.target.value)} size="medium" label="Address"></TextField>
            </div>

            <div>
              <Button variant="contained" onClick={()=> generateGeocodeResults(physicalAddressStr)}>Search</Button>
            </div>

            {geocodedResults.length > 0 && (
              <div>
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
              </div>
            )}

            {errorMessage && (
              <div>
                <p style={{color: "red"}}>{errorMessage}</p>
              </div> 
            )}

          <div>
            <Button variant="text" onClick={() => saveAddress()}>Save</Button>
            <Button variant="text" color="error" onClick={() => {handleCancel()}}>Cancel</Button>
          </div>

          </div>

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
        </div>
      </div>
    )
}

export default AddressSelectorPopup