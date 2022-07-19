/** @jsxImportSource @emotion/react */
import { Box, Button, css, DialogActions, DialogContent, DialogTitle, Paper, Popper, TextField } from "@mui/material"
import React, { useRef, useState } from "react"
import { Cell as CellClass } from "../../classes/cell.class"
import ClickAwayListener from '@mui/material/ClickAwayListener';
import styled from "@emotion/styled";
import { usePopper } from "react-popper";
import { useRecoilState } from "recoil";
import { Row } from "../../interfaces/simpleInterfaces";
import { SelectedCells } from "../../state/globalstate";


const PopperContainer = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 50px;
  background-color: black;
  z-index: 1;
  margin-left: 10px;
  margin-right: 10px;


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
    testFunc: (i: number) => void;
}



const Cell: React.FC<CellProps> = ({i,j, testFunc}) =>
{

    const [selectionData, setSelectionData] = useRecoilState<Row[]>(SelectedCells)

    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [show, setShow] = useState(false);

    const [arrowRef, setArrowRef] = useState<any>(null);

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


    return(
            <React.Fragment>
                <Button variant={"contained"} style={{width: "100%", textTransform: "none", borderRadius: 0}} ref={buttonRef} onClick={()=> setShow(!show)}>{selectionData[i].cells[j].data}</Button>
                
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
                                        <TextField autoFocus defaultValue={selectionData[i].cells[j].data} size="medium" label="Cell Data"></TextField>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button onClick={() => testFunc(2)}>Save</Button>
                                        <Button>Cancel</Button>
                                    </DialogActions>
                                </Paper>
                        </PopperContainer>
                    </ClickAwayListener>)}
                
                
            </React.Fragment>

        )
}

export default Cell;