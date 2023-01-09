import { Box, Button, ClickAwayListener, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { usePopper } from "react-popper";
import PopperContainer from "../../../../common/PopperContainer.styled";
import { ICell } from "../../../../common/CommonInterfacesAndEnums";
import AddressPopper from "./AddressPopper.component";

type AddressCellProps = {
    cellRef: ICell;
    glanceMode: boolean;
  }

const AddressCell: React.FC<AddressCellProps> = ({cellRef, glanceMode}) =>
{
  const buttonRef = useRef(null);
  const popperRef = useRef(null);

  const [show, setShow] = useState(false);
  const [arrowRef, setArrowRef] = useState<any>(null);

  function getAddressStatus(): {status: string, color: string, hoverColor: string}
  {
    if(cellRef.geocodedDataAndStatus)
    {
      if(cellRef.geocodedDataAndStatus.status === google.maps.GeocoderStatus.OK)
      {
        if(cellRef.geocodedDataAndStatus.results && cellRef.geocodedDataAndStatus.results.length > 0)
        {
          if(cellRef.isGeoResAccepted)
          {
            return {status: cellRef.geocodedDataAndStatus.results[cellRef.selectedGeocodedAddressIndex].formatted_address, color: "green", hoverColor: "#006e09"}
          }
          else{
            return {status: cellRef.geocodedDataAndStatus.results[cellRef.selectedGeocodedAddressIndex].formatted_address, color: "#f57c00", hoverColor: "#df6400"}
          }
          
        }
        else{
          return {status: "error", color: "#ff5100", hoverColor: "#ca2800"}
        }
      }
      else if(cellRef.geocodedDataAndStatus.status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
      {
        return {status: "server under load, please wait...", color: "#f57c00", hoverColor: "#df6400"}
      }
      else if(cellRef.geocodedDataAndStatus.status === google.maps.GeocoderStatus.ZERO_RESULTS)
      {
        return {status:  google.maps.GeocoderStatus.ZERO_RESULTS.toString() , color: "#ff5100", hoverColor: "#ca2800"}
      }
      else
      {
        return {status: cellRef.geocodedDataAndStatus.status.toString(), color: "#ff5100", hoverColor: "#ca2800"}
      }

      
    }
    else{
      return {status: "loading...", color: "#f57c00", hoverColor: "#df6400"}
    }
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
          },
          {
            name: "flip",
            options: {
              
            },
          }
        ]
      }
    );

    function closePopper()
    {
      setShow(!show)
    }

    return(
        <React.Fragment>
        
        

          <Button 
            sx={{textAlign:"left", background: getAddressStatus().color, ":hover": {backgroundColor: getAddressStatus().hoverColor}, width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "left"}} 
            
            variant={"contained"} 
            ref={buttonRef} onClick={()=> closePopper()}>
              
              {glanceMode ? 
                <Stack>
                  <Box>
                    Given: {cellRef.displayData}
                  </Box>
                  <Box>
                    <Typography sx={{fontSize: "1em", fontStyle: "italic"}}>Found: {getAddressStatus().status}</Typography>
                  </Box>
                </Stack>
              :
                cellRef.displayData
              }
          </Button>
        

        {show && (
        <ClickAwayListener onClickAway={()=> closePopper()}>
            <PopperContainer 
                ref={popperRef}
                style={{...styles.popper, width: "80%"}}
                {...attributes.popper}
                >
                  <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                  <AddressPopper 
                    currentAddress={cellRef.displayData} 
                    closePopper={closePopper} 
                    cellRef={cellRef}
                    />
            </PopperContainer>
        </ClickAwayListener>)}
    </React.Fragment>
    )
}

export default AddressCell;
