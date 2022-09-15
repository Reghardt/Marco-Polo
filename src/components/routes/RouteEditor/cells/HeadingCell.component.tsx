import { Button, ClickAwayListener, DialogActions, DialogContent, DialogTitle, Paper, Tab, Tabs, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import PopperContainer from "../../../common/PopperContainer.styled";

type HeadingCellProps = {
  colId: number;

  updateHeading: (colNr: number) => void;
}

const HeadingCell: React.FC<HeadingCellProps> = ({}) =>
{
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [show, setShow] = useState(false);

    const [heading, setHeading] = useState("");

    const [arrowRef, setArrowRef] = useState<any>(null);




    // useEffect(() => {
    //   setHeading(headingDetails);
    // }, [headingDetails])

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
        input = input
          //setHeading({index: heading.index ,headingName: input})
      }

      function saveAndClose()
      {
        //updateHeadings(colId, heading)
        setShow(!show)
      }

      function close()
      {
        //setHeading(headingDetails)
        setShow(!show)
      }

    return(
        <React.Fragment>
            <Button variant="contained" style={{height: "100%", width: "100%"}} ref={buttonRef} onClick={()=> setShow(!show)}>{"dummy"}</Button>

            {show && (
                <ClickAwayListener onClickAway={() => close()}>
                    <PopperContainer ref={popperRef} style={styles.popper} {...attributes.popper}>
                        <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                        <Paper className="paper" >
                            <DialogTitle>Column Editor</DialogTitle>
                            <DialogContent>
                                <br/>
                                <TextField onChange={(e)=> captureInput(e.target.value)} defaultValue={"dummy"} size="medium" label="Column name"></TextField>

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

export default HeadingCell;