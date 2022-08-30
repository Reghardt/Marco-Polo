import { Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import PopperContainer from "../../common/PopperContainer.styled";
import { usePopper } from "react-popper";
import { IGeocoderResult } from "../../../interfaces/simpleInterfaces";
import { geocodeAddress } from "../Route.service";

type StartAddressProps ={
    startAddress: string;
    setStartAddress: React.Dispatch<React.SetStateAction<string>>;

}

const StartAddress: React.FC<StartAddressProps> = ({startAddress, setStartAddress}) =>
{

    const [show, setShow] = useState(false);
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [arrowRef, setArrowRef] = useState<any>(null);

    const [localStartAddress, setLocalStartAddress] = useState(startAddress)

    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>(null);
    const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult>()


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
          setLocalStartAddress(input)
      }

      function saveStartAddress()
      {
        setStartAddress(selectedAddress.formatted_address)
        setShow(!show)
      }

      function generateGeocodeResults()
      {
        geocodeAddress(localStartAddress).then(geocoded => {
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
            
            Start Address:
            <Button ref={buttonRef} onClick={()=> setShow(!show)} style={{textTransform: "none"}}>
                {startAddress}
            </Button>

            {show && (
                <ClickAwayListener onClickAway={()=> setShow(!show)}>
                    <PopperContainer 
                        ref={popperRef}
                        style={styles.popper}
                        {...attributes.popper}
                        >
                            <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                            <Paper className="paper" >
                                <DialogTitle>Start Address Selector</DialogTitle>
                                <DialogContent>
                                    <br></br>
                                    <TextField defaultValue={startAddress} onChange={(e)=> captureInput(e.target.value)} autoFocus size="medium" label="Start Address"></TextField>
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
                                    <Button onClick={() => saveStartAddress()}>Save</Button>
                                    <Button>Cancel</Button>
                                </DialogActions>
                            </Paper>
                    </PopperContainer>
                </ClickAwayListener>)}
        </React.Fragment>
    )
}

export default StartAddress;