import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import ClickAwayListener from '@mui/material/ClickAwayListener';

import AddressSelectorPopup from "./AddressSelectorPopup.component";
import { autoUpdate, offset, shift, useDismiss, useFloating, useInteractions } from "@floating-ui/react";

interface IAddressSelectorProps{
    address: google.maps.GeocoderResult | null;
    //addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    addressSetter: (address: google.maps.GeocoderResult) => void
    title: string;

}

const AddressSelector: React.FC<IAddressSelectorProps> = ({address, addressSetter, title}) =>
{

    const [open, setOpen] = useState(false);


    const {x, y, reference, floating, strategy, context} = useFloating({
      middleware: [
        shift(), 
        offset(-4),

      ],
      // whileElementsMounted: autoUpdate,
      placement: "bottom-start",
      open,
      onOpenChange: setOpen,
  
    });
  
    const dismiss = useDismiss(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([
      dismiss,
    ]);

    function toggleShow()
    {
      setOpen(current => {
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
              <Button {...getReferenceProps()} ref={reference} onClick={()=> setOpen(!open)} style={{textTransform: "none"}} sx={{fontStyle: (address === null ? "italic" : "normal")}}>
                {(address === null ? "click to specify address" : address.formatted_address)}
            </Button>
            </Box>

          </Stack>

            {open && (
                <ClickAwayListener onClickAway={()=> toggleShow()}>
                    <div 
                        ref={floating}
                        style={{
                          position: strategy,
                          top: y ?? 0,
                          left: x ?? 0,
                          width: 'max-content',
                        }}
                        {...getFloatingProps()}
                        >
                            {/* <div ref={setArrowRef} style={styles.arrow} className="arrow"/> */}
                            <AddressSelectorPopup title={title} address={address} addressSetter={addressSetter} toggleShow={toggleShow}/>
                    </div>
                </ClickAwayListener>)}
        </React.Fragment>
    )
}

export default AddressSelector;