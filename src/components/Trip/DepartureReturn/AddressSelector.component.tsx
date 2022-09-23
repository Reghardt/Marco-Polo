import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { usePopper } from "react-popper";

import PopperContainer from "../../common/PopperContainer.styled";
import { geocodeAddress } from "../Trip.service";

type IAddressSelectorProps ={
    address: string;
    addressSetter: React.Dispatch<React.SetStateAction<string>>;
    title: string;

}

const AddressSelector: React.FC<IAddressSelectorProps> = ({address, addressSetter, title}) =>
{

    const [show, setShow] = useState(false);
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState<any>(null);

    const [localAddress, setLocalAddress] = useState(address)

    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>(null);
    const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult>()

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
        addressSetter(selectedAddress.formatted_address)
        setShow(!show)
      }

      function generateGeocodeResults()
      {
        geocodeAddress(localAddress).then(geocoded => {
            console.log(geocoded.results)
            if(geocoded.status === "OK")
            {
                console.log("OK")
                setGeocodedResults(geocoded.results)
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
              <Button ref={buttonRef} onClick={()=> setShow(!show)} style={{textTransform: "none"}} sx={{fontStyle: (address === "" ? "italic" : "normal")}}>
                {(address === "" ? "click to specify address" : address)}
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
                        style={styles.popper}
                        {...attributes.popper}
                        >
                            <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                            <Paper className="paper" >
                                <DialogTitle>{title}</DialogTitle>
                                <DialogContent>
                                    <br></br>
                                    <TextField defaultValue={address} onChange={(e)=> captureInput(e.target.value)} autoFocus size="medium" label="Address"></TextField>
                                    <br/>
                                    <Button onClick={()=> generateGeocodeResults()}>Search</Button>
                                    <br/>

                                    {geocodedResults &&  
                                        (<FormControl>
                                            <FormLabel id="demo-radio-buttons-group-label">Results:</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                defaultValue="female"
                                                name="radio-buttons-group"
                                                onChange={(e) => handleAddressSelection(e.target.value)}
                                            >
                                                {geocodedResults.map((elem, idx) => {
                                                    return <FormControlLabel key={idx} value={idx} control={<Radio />} label={elem.formatted_address} />
                                                    })}
                                            </RadioGroup>
                                        </FormControl>
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