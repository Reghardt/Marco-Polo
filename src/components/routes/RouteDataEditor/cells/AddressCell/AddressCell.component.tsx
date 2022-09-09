import { Button, Checkbox, ClickAwayListener, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { ICell } from "../../../../../services/worksheet/cell.interface";
import PopperContainer from "../../../../common/PopperContainer.styled";
import AddressCellPopper from "./AddressPopper.component";

type AddressCellProps = {
    cellRef: ICell;
    updateBodyCell: (cell: ICell) => void;
  }

const AddressCell: React.FC<AddressCellProps> = ({cellRef, updateBodyCell}) =>
{
  const buttonRef = useRef(null);
  const popperRef = useRef(null);

  const [show, setShow] = useState(false);
  const [shouldReopen, setShouldReopen] = useState(false)
  const [arrowRef, setArrowRef] = useState<any>(null);

  

  let buttonColor = "#ff9800";
  //console.log(cellRef.geocodedAddressRes)
  if(cellRef.geocodedAddressRes)
  {
    buttonColor = "green";
  }

  handleShow();

  const { styles, attributes, update } = usePopper(
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



    function handleShow()
    {
      if(show === false && shouldReopen === true)
      {
        setShow(true);
        setShouldReopen(false);
      }
    }

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
        <Button sx={{background: buttonColor}} variant={"contained"} style={{width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start"}} ref={buttonRef} onClick={()=> closePopper()}>{cellRef.data}</Button>
        
            {show && (
            <ClickAwayListener onClickAway={()=> closePopper()}>
                <PopperContainer 
                    ref={popperRef}
                    style={styles.popper}
                    {...attributes.popper}
                    >
                      <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                      <AddressCellPopper 
                        currentAddress={cellRef.data} 
                        closePopper={closePopper} 
                        saveAndClose={saveAndClose} 
                        cellRef={cellRef}
                        update={update}
                        />
                </PopperContainer>
            </ClickAwayListener>)}
    </React.Fragment>
    )
}

export default AddressCell;
