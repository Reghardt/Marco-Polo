import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { usePopper } from "react-popper";

import PopperContainer from "../../common/PopperContainer.styled";
import { geocodeAddress } from "../Trip.service";
import { width } from "@mui/system";

type IAddressSelectorProps ={
    address: google.maps.GeocoderResult;
    addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    title: string;

}

const AddressSelector: React.FC<IAddressSelectorProps> = ({address, addressSetter, title}) =>
{

    const [show, setShow] = useState(false);
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState<any>(null);

    const [localAddress, setLocalAddress] = useState<string>(address === null ? "" : address.formatted_address)

    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult>()

    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
      if(localAddress === "")
      {
        setLocalAddress("Specify Address")
      }
    }, [])


    const { styles, attributes } = usePopper(
        buttonRef.current,
        popperRef.current,
        {
          modifiers: [
            {
              name: "arrow",
              options: {
                element: arrowRef
              }
            },
            {
              name: "offset",
              options: {
                offset: [0, 1]
              }
            }
          ]
        }
      );

      function captureInput(input: string)
      {
          setLocalAddress(input)
      }

      function saveAddress()
      {
        addressSetter(selectedAddress)
        setGeocodedResults([])
        setShow(!show)
      }

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
        })
      }

      function handleAddressSelection(index: string)
      {
        console.log(geocodedResults[parseInt(index)])
        setSelectedAddress(geocodedResults[parseInt(index)]);
      }
    
    return(
        <React.Fragment>

          <Stack spacing={0} sx={{margin: "0", padding: "0"}}>
            <Box>
              <Typography variant="body1">{title}: </Typography>
            </Box>
            
            <Box>
              <Button ref={buttonRef} onClick={()=> setShow(!show)} style={{textTransform: "none"}} sx={{fontStyle: (address === null ? "italic" : "normal")}}>
                {(address === null ? "click to specify address" : address.formatted_address)}
            </Button>
            </Box>

            {/* <Box>
              <HelpTooltip title="From where the vehicle will depart from initially"/>
            </Box> */}
          </Stack>

            {show && (
                <ClickAwayListener onClickAway={()=> setShow(!show)}>
                    <PopperContainer 
                        ref={popperRef}
                        style={{...styles.popper, width: "80%"}}
                        {...attributes.popper}
                        >
                            <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
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
                                    <Button>Cancel</Button>
                                </DialogActions>
                            </Paper>
                    </PopperContainer>
                </ClickAwayListener>)}
        </React.Fragment>
    )
}

export default AddressSelector;