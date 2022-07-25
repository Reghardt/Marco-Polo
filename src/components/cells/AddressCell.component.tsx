import { Button, Checkbox, ClickAwayListener, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { usePopper } from "react-popper";
import { Cell } from "../../classes/cell.class";
import { GeocoderResult } from "../../interfaces/simpleInterfaces";
import PopperContainer from "../common/PopperContainer.styled";

type AddressCellProps = {
    i: number;
    j: number;
    cellRef: Cell;
    addressColIndex: number;
    geocodeAddress: (address: string) => Promise<GeocoderResult>;
    updateAddressCell: (i: number, j: number, address: string) => void;
  }

const AddressCell: React.FC<AddressCellProps> = ({i,j,cellRef, addressColIndex, geocodeAddress, updateAddressCell}) =>
{
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [show, setShow] = useState(false);

    const [arrowRef, setArrowRef] = useState<any>(null);
    const [cellAddress, setCellAddress] = useState(cellRef.data);
    const [geocodedResults, setGeocodedResults] = useState<google.maps.GeocoderResult[]>(null);
    const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult>()
    const [addressSaved, setAddressSaved] = useState(false)

    let buttonColor = "primary";
    if(addressColIndex === j)
    {
      buttonColor = "orange";
    }
    if(addressSaved)
    {
      buttonColor = "green";
    }

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
          setCellAddress(input)
      }

      function generateGeocodeResults()
      {
        geocodeAddress(cellAddress).then(geocoded => {
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

    function saveAndClose()
    {
      updateAddressCell(i,j, selectedAddress.formatted_address)
      setAddressSaved(true);
      setShow(!show)
    }

    return(
        <React.Fragment>
        <Button sx={{background: buttonColor}} variant={"contained"} style={{width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start"}} ref={buttonRef} onClick={()=> setShow(!show)}>{cellRef.data}</Button>
        
            {show && (
            <ClickAwayListener onClickAway={()=> setShow(!show)}>
                <PopperContainer 
                    ref={popperRef}
                    style={styles.popper}
                    {...attributes.popper}
                    >
                        <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                        <Paper>
                            <DialogTitle>Address Editor</DialogTitle>
                            <DialogContent>
                                <br></br>
                                <TextField onChange={(e)=> captureInput(e.target.value)} autoFocus defaultValue={cellRef.data} size="medium" label="Cell Data"></TextField>
                            
                                <br/>
                                <Button onClick={()=> generateGeocodeResults()}>Search</Button>
                                <br/>

                                {geocodedResults &&  (<FormControl>
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
                                </FormControl>)}
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => saveAndClose()}>Save</Button>
                                <Button>Cancel</Button>
                            </DialogActions>
                        </Paper>
                </PopperContainer>
            </ClickAwayListener>)}
    </React.Fragment>
    )
}

export default AddressCell;
