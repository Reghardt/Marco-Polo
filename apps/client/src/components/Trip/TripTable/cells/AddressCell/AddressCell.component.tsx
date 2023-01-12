import { useFloating, offset, useDismiss, useInteractions, autoUpdate, flip } from "@floating-ui/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import { ICell } from "../../../../common/CommonInterfacesAndEnums";
import AddressPopper from "./AddressPopper.component";

type AddressCellProps = {
    cellRef: ICell;
    glanceMode: boolean;
  }

const AddressCell: React.FC<AddressCellProps> = ({cellRef, glanceMode}) =>
{
  const [open, setOpen] = useState(false);
  // const geocodeStarted = useRef(false)

  // const ZF_updateBodyCell = useTripStore(store => store.reducers.updateBodyCell)

  const {x, y, reference, floating, strategy, context} = useFloating({
    middleware: [
      offset(-4),
      flip()
    ],
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
    open,
    onOpenChange: setOpen,

  });

  const dismiss = useDismiss(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([
    dismiss,
  ]);

  function getAddressStatus(): {status: string, color: string, hoverColor: string}
  {
    if(cellRef?.geocodedDataAndStatus)
    {
      if(cellRef.geocodedDataAndStatus.status === google.maps.GeocoderStatus.OK)
      {
        if(cellRef.geocodedDataAndStatus.results && cellRef.geocodedDataAndStatus.results.length > 0)
        {
          if(cellRef.isAddressValidAndAccepted)
          {
            return {status: cellRef.geocodedDataAndStatus.results[cellRef.selectedGeocodedAddressIndex]!.formatted_address, color: "green", hoverColor: "#006e09"}
          }
          else{
            return {status: cellRef.geocodedDataAndStatus.results[cellRef.selectedGeocodedAddressIndex]!.formatted_address, color: "#f57c00", hoverColor: "#df6400"}
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

  function closePopper()
  {
    setOpen(!open)
  }

  // useEffect(() => {
  //   if(cellRef.geocodedDataAndStatus === null && geocodeStarted.current === false)
  //   {
  //     console.log("execute geocode")
  //     geocodeStarted.current = true;
  //     (async () => {
  //       const geocodeAddressResult = await geocodeAddress(cellRef.displayData)
  //       ZF_updateBodyCell({...cellRef, geocodedDataAndStatus: geocodeAddressResult});
  //       if(geocodeAddressResult.status === google.maps.GeocoderStatus.OK)
  //       {
  //         return
  //       }
  //     })()
  //   }


  // }, [])

  return(
    <React.Fragment>
      <Button 
        sx={{textAlign:"left", background: getAddressStatus().color, ":hover": {backgroundColor: getAddressStatus().hoverColor}, width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "left"}} 
        
        variant={"contained"} 
        {...getReferenceProps()} ref={reference} onClick={()=> closePopper()}>
          
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
      

      {open && (
          <div 
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
              zIndex: 1
            }}
            {...getFloatingProps()}
          >
              {/* <div ref={setArrowRef} style={styles.arrow} className="arrow"/> */}
              <AddressPopper 
                closePopper={closePopper} 
                cellRef={cellRef}
                />
          </div>
      )}
  </React.Fragment>
  )
}

export default AddressCell;
