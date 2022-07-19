import styled from "@emotion/styled";
import { Button, Checkbox, ClickAwayListener, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Paper, Switch, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
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

type ColHeadingProps = {
    colName: string;
}

const ColHeading: React.FC<ColHeadingProps> = ({colName}) =>
{
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

      function saveAndClose()
      {
          setShow(!show)
      }

    return(
        <React.Fragment>
            <Button style={{width: "100%"}} ref={buttonRef} onClick={()=> setShow(!show)}>{colName}</Button>

            {show && (
                <ClickAwayListener onClickAway={() => saveAndClose()}>
                    <PopperContainer 
                        ref={popperRef}
                        style={styles.popper}
                        {...attributes.popper}
                        >
                        <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                        <Paper className="paper" >
                            <DialogTitle>Column Editor</DialogTitle>
                            <DialogContent>
                                <br></br>
                                <TextField autoFocus size="medium" label="Column Name" defaultValue={colName}></TextField>
                                <FormGroup>
                                    <FormControlLabel control={<Switch/>} label="Address Column" />
                                </FormGroup>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => saveAndClose()}>Save</Button>
                            </DialogActions>
                        </Paper>
                        </PopperContainer>
                </ClickAwayListener>
            )}
        </React.Fragment>
    )
}

export default ColHeading;