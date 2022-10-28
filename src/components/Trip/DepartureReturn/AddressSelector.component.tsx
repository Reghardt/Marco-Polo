import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { usePopper } from "react-popper";

import PopperContainer from "../../common/PopperContainer.styled";
import AddressSelectorPopup from "./AddressSelectorPopup.component";

interface IAddressSelectorProps{
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

    function toggleShow()
    {
      setShow(current => {
        return !current;
      })
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

          </Stack>

            {show && (
                <ClickAwayListener onClickAway={()=> toggleShow()}>
                    <PopperContainer 
                        ref={popperRef}
                        style={{...styles.popper, width: "80%"}}
                        {...attributes.popper}
                        >
                            <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                            <AddressSelectorPopup title={title} address={address} addressSetter={addressSetter} toggleShow={toggleShow}/>
                    </PopperContainer>
                </ClickAwayListener>)}
        </React.Fragment>
    )
}

export default AddressSelector;