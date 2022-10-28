import { Button, ClickAwayListener } from "@mui/material";
import { width } from "@mui/system";
import { stat } from "fs";
import React, { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { ICell } from "../../../../../services/worksheet/cell.interface";
import { IRow } from "../../../../../services/worksheet/row.interface";
import PopperContainer from "../../../../common/PopperContainer.styled";
import AddressPopper from "./AddressPopper.component";

enum ESolveState{
  unsolved,
  solved,
  
}

type AddressCellProps = {
    cellRef: ICell;
    updateBodyCell: (cell: ICell) => void;
    recalculateRoute(departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number): Promise<void>
  }

const AddressCell: React.FC<AddressCellProps> = ({cellRef, updateBodyCell, recalculateRoute}) =>
{
  const buttonRef = useRef(null);
  const popperRef = useRef(null);

  const [show, setShow] = useState(false);
  const [arrowRef, setArrowRef] = useState<any>(null);

  const [solveState, setSolveState] = useState<ESolveState>(ESolveState.unsolved)

  
  function getStateColor(state: ESolveState, hoverColor: boolean = false)
  {
    if(state === ESolveState.unsolved)
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
        return "#006e09";
      } 
      else
      {
        return "green";
      }
    }
  }

 

  useEffect(() => {
    if(cellRef.geocodedAddressRes)
    {
      setSolveState(ESolveState.solved)
    }
    else
    {
      setSolveState(ESolveState.unsolved)
    }
  }, [cellRef])



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


    function saveAndClose(cell: ICell)
    {
      updateBodyCell(cell)
      setShow(!show)
    }

    function closePopper()
    {
      setShow(!show)
    }

    return(
        <React.Fragment>
        <Button sx={{background: getStateColor(solveState), ":hover": {backgroundColor: getStateColor(solveState, true)}, width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start"}} variant={"contained"} 
          ref={buttonRef} onClick={()=> closePopper()}>{cellRef.data}</Button>
        
        {show && (
        <ClickAwayListener onClickAway={()=> closePopper()}>
            <PopperContainer 
                ref={popperRef}
                style={{...styles.popper, width: "80%"}}
                {...attributes.popper}
                >
                  <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                  <AddressPopper 
                    currentAddress={cellRef.data} 
                    closePopper={closePopper} 
                    saveAndClose={saveAndClose} 
                    cellRef={cellRef}
                    recalculateRoute={recalculateRoute}
                    />
            </PopperContainer>
        </ClickAwayListener>)}
    </React.Fragment>
    )
}

export default AddressCell;
