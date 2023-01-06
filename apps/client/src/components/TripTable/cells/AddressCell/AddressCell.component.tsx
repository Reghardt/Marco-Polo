import { useFloating, shift, offset, useDismiss, useInteractions, flip, autoUpdate } from "@floating-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { ICell } from "../../../../common/interfaces";
import AddressPopper from "./AddressPopper.component";



enum ESolveState{
  unsolved,
  solved,
  error
  
}

type AddressCellProps = {
    cellRef: ICell;
    glanceMode: boolean;
  }

const AddressCell: React.FC<AddressCellProps> = ({cellRef, glanceMode}) =>
{

  console.log("Address cell created")

  const [open, setOpen] = useState(false);
  const [solveState, setSolveState] = useState<ESolveState>(ESolveState.unsolved)

  
  function getStateColor(state: ESolveState, hoverColor = false)
  {
    if(state === ESolveState.solved)
    {
      if(hoverColor)
      {
        return "#006e09";
      } 
      else
      {
        return "green";
      }
    }
    else if(state === ESolveState.unsolved)
    {
      if(hoverColor)
      {
        return "#ca7900"; //hover color is darker
        
      } 
      else
      {
        return "#ff9800";
      }
    }
    else
    {
      if(hoverColor)
      {
        return "#ca2800"; //hover color is darker
        
      } 
      else
      {
        return "#ff5100";
      }
    }
  }

 

  useEffect(() => {
    if(cellRef.selectedGeocodedAddressIndex >= 0)
    {
      setSolveState(ESolveState.solved)
    }
    else if(cellRef.selectedGeocodedAddressIndex === -1 || cellRef.selectedGeocodedAddressIndex === -2)
    {
      setSolveState(ESolveState.unsolved)
    }
    else
    {
      setSolveState(ESolveState.error)
    }
  }, [cellRef])

  const {x, y, reference, floating, strategy, context} = useFloating({
    middleware: [
      shift(), 
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

  function toggleShow()
  {
    setOpen(current => {
      return !current;
    })
  }

    // function foundStatus()
    // {
    //   if(cellRef.geocodedResults.length > 0 && cellRef.selectedGeocodedAddressIndex >= 0)
    //   {
    //     return cellRef.geocodedResults[cellRef.selectedGeocodedAddressIndex].formatted_address;
    //   }
    //   else
    //   {
    //     return "Loading..."
    //   }
    // }

    console.log(cellRef.displayData)

  return(
    <React.Fragment>
      <button {...getReferenceProps()} ref={reference} onClick={()=> toggleShow()} className='grid-item'
      >
        {
          cellRef.displayData
        }
      </button>
      

      {open && (
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
                <AddressPopper 
                  currentAddress={cellRef.displayData} 
                  closePopper={toggleShow} 
                  cellRef={cellRef}
                  />

          </div>
      )}
  </React.Fragment>
  
  ) 
}

export default AddressCell;
