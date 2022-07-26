
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Paper, TextField } from "@mui/material"
import React, { useRef, useState } from "react"
import { Cell } from "../../classes/cell.class"
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { usePopper } from "react-popper";
import PopperContainer from "../common/PopperContainer.styled";


type DataCellProps = {
    i: number;
    j: number;
    cellRef: Cell;
    addressColIndex: number;
    updateDataCell: (i: number, j: number, updatedData: string) => void;
}

const DataCell: React.FC<DataCellProps> = ({i,j,cellRef, addressColIndex, updateDataCell}) =>
{

    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [show, setShow] = useState(false);

    const [arrowRef, setArrowRef] = useState<any>(null);
    const [cellData, setCellData] = useState(cellRef.data);

    let buttonColor = "primary";
    if(addressColIndex === j)
    {
      buttonColor = "orange";
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
        setCellData(input)
        
    }

    function saveAndClose()
    {

      updateDataCell(i,j, cellData)
        setShow(!show)
    }

    function cancleAndClose()
    {
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
                            <Paper className="paper" >
                                <DialogTitle>Cell Editor</DialogTitle>
                                <DialogContent>
                                    <br></br>
                                    <TextField onChange={(e)=> captureInput(e.target.value)} autoFocus defaultValue={cellRef.data} size="medium" label="Cell Data"></TextField>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox/>} label="Update Spreadsheet" />
                                    </FormGroup>
                                </DialogContent>

                                <DialogActions>
                                    <Button onClick={() => saveAndClose()}>Save</Button>
                                    <Button onClick={() => cancleAndClose()}>Cancel</Button>
                                </DialogActions>
                            </Paper>
                    </PopperContainer>
                </ClickAwayListener>)}
            </React.Fragment>
        )
}

export default DataCell;