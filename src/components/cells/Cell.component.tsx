/** @jsxImportSource @emotion/react */
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Paper, TextField } from "@mui/material"
import React, { useRef, useState } from "react"
import { Cell as CellClass } from "../../classes/cell.class"
import ClickAwayListener from '@mui/material/ClickAwayListener';
import styled from "@emotion/styled";
import { usePopper } from "react-popper";


const PopperContainer = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 50px;
  background-color: black;
  z-index: 1;
  /* margin-left: 10px;
  margin-right: 10px; */


  text-align: center;

  .arrow {
    position: absolute;
    width: 10px;
    height: 20px;

    &:before {
      content: "";
      position: absolute;
      top: -0.3em; // we account for the PopperContainer padding
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
      background-color: white;
      box-shadow: none;
    }
  }

  &[data-popper-placement^='top'] > .arrow {
    bottom: -1.25em;
    :after {
        border-width: 0 1em 1em 1em;
        border-color: transparent transparent blue transparent;
    }
  }
`
type CellProps = {
    i: number;
    j: number;
    cellRef: CellClass;
    testFunc: (i: number, j: number, updatedData: string) => void;
}



const Cell: React.FC<CellProps> = ({i,j,cellRef, testFunc}) =>
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

        testFunc(i,j, cellData)
        setShow(!show)
    }

    function cancleAndClose()
    {
        setShow(!show)
    }

    return(
            <React.Fragment>
                <Button variant={"contained"} style={{width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start"}} ref={buttonRef} onClick={()=> setShow(!show)}>{cellRef.data}</Button>
                
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

export default Cell;