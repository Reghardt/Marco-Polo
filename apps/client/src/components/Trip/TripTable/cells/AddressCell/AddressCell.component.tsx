import { useFloating, offset, useDismiss, useInteractions, autoUpdate, flip } from "@floating-ui/react";
import { VerifiedUser, WarningOutlined } from "@mui/icons-material";
import React, { useState } from "react";

import { EAddressSolveStatus, ICell } from "../../../../common/CommonInterfacesAndEnums";
import AddressPopper from "./AddressPopper.component";

// enum EAddressState{
//   OK = 1,
//   SOLVE = 2,
//   ERROR = 3
// }

type AddressCellProps = {
    cellRef: ICell;
    glanceMode: boolean;
  }

const AddressCell: React.FC<AddressCellProps> = ({cellRef, glanceMode}) =>
{
  const [open, setOpen] = useState(false);
  // const [addressState, setAddressState] = useState<EAddressState>(EAddressState.SOLVE)

  // function handleSetAddressState(newState: EAddressState)
  // {
  //   if(addressState !== newState)
  //   {
  //     setAddressState(newState)
  //   }
  // }

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

  function getAddressStatus()
  {
    if(cellRef.address.solveStatus === EAddressSolveStatus.AWAITING_SOLVE)
    {
      return "Loading..."
    }
    else if(cellRef.address.solveStatus === EAddressSolveStatus.OK)
    {
      return cellRef.address.formatted_address
    }
    else
    {
      return cellRef.address.solveStatus
    }
  }

  

  function closePopper()
  {
    setOpen(!open)
  }



  return(
    <React.Fragment>
      <button 
        draggable="true"
        //sx={{textAlign:"left", background: getAddressStatus().color, ":hover": {backgroundColor: getAddressStatus().hoverColor}, width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "left"}} 
        className={"text-base text-left p-1 bg-slate-200 hover:bg-slate-300"}
        style={{textTransform: "none", minHeight: "30px"}}

        {...getReferenceProps()} ref={reference} onClick={()=> closePopper()}>
          
          {glanceMode ?   
           <div className={"flex justify-between items-center"}>

              <div>
                <div>
                  <div className={"text-sm"}>
                    Given: {cellRef.displayData ? cellRef.displayData : <span className="text-red-500 ">Empty</span>}
                  </div>
                  <div>
                    <div className={"text-base"}> 
                      <>
                        Found: {getAddressStatus()}
                        
                      </>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {cellRef.address.isAddressAccepted === true
                  ? 
                  <div className="ml-2">
                    <VerifiedUser color="primary"/>
                  </div>
                  
                  : 
                  <div className="ml-2">
                    <WarningOutlined color="warning"/>
                  </div>
                    
                }
              </div>
           </div>

          :
          <div className={"flex justify-between items-center"}>
            <div>
              {cellRef.displayData}
            </div>
            {cellRef.displayData && (
                <div className="ml-1">
                <VerifiedUser color="primary" fontSize="small"/>
              </div>
            )}

            
          </div>
            
          }
      </button>
      

      {open && (
          <div 
            className={""}
            ref={floating}
            style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: '90%',
            zIndex: 10
            // gridTemplateColumns: "max-content 1fr",
            }}
            {...getFloatingProps()}
        >
            {/* <div ref={setArrowRef} style={styles.arrow} className="arrow"/> */}
            <AddressPopper 
              closePopper={closePopper} 
              cell={cellRef}
              />
        </div>
      )}
  </React.Fragment>
  )
}

export default AddressCell;
