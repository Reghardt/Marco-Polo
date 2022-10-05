
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Paper, TextField } from "@mui/material"
import React, { useRef, useState } from "react"
import { ICell } from "../../../../services/worksheet/cell.interface"
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { usePopper } from "react-popper";
import PopperContainer from "../../../common/PopperContainer.styled";


type DataCellProps = {
    cellRef: ICell;
    updateBodyCell: (cell: ICell) => void;
}

const DataCell: React.FC<DataCellProps> = ({cellRef, updateBodyCell}) =>
{

    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [show, setShow] = useState(false);

    const [arrowRef, setArrowRef] = useState<any>(null);
    const [cellData, setCellData] = useState(cellRef.data);

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
      const tempCell = JSON.parse(JSON.stringify(cellRef)) as ICell;
      tempCell.data = cellData;
      updateBodyCell(tempCell)
      setShow(!show)
    }

    function cancleAndClose()
    {
        setShow(!show)
    }

    return(
            <React.Fragment>
                <Button disableRipple variant={"contained"} 
                  sx={{width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start", minHeight: "2.4em", pointerEvents: "none"}} ref={buttonRef}>{cellRef.data}</Button>
                
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
                                    <TextField onChange={(e)=> captureInput(e.target.value)} defaultValue={cellRef.data} size="medium" label="Cell Data"></TextField>
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