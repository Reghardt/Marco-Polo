import { Button, ClickAwayListener, DialogActions, DialogContent, DialogTitle, Paper, Tab, Tabs, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import PopperContainer from "../../../common/PopperContainer.styled";
import { IHeading } from "../../interfaces/Heading.interface";

type HeadingCellProps = {
  colId: number;
  addressColIndex: number;
  headingDetails: IHeading;
  updateHeading: (colNr: number, newHeading: IHeading) => void;
}

const HeadingCell: React.FC<HeadingCellProps> = ({colId, addressColIndex: addressColId, headingDetails, updateHeading: updateHeadings}) =>
{
    const buttonRef = useRef(null);
    const popperRef = useRef(null);
    const [show, setShow] = useState(false);

    const [heading, setHeading] = useState(headingDetails);


    const [arrowRef, setArrowRef] = useState<any>(null);

    let buttonColor = "orange";
    if(addressColId > -1)
    {
      buttonColor = "primary";
    }

    useEffect(() => {
      setHeading(headingDetails);
    }, [headingDetails])

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
          setHeading({index: heading.index ,headingName: input})
      }

      function saveAndClose()
      {
        updateHeadings(colId, heading)
        setShow(!show)
      }

      function close()
      {
        setHeading(headingDetails)
        setShow(!show)
      }

    return(
        <React.Fragment>
            <Button sx={{background: buttonColor}} variant="contained" style={{width: "100%"}} ref={buttonRef} onClick={()=> setShow(!show)}>{headingDetails.headingName}</Button>

            {show && (
                <ClickAwayListener onClickAway={() => close()}>
                    <PopperContainer ref={popperRef} style={styles.popper} {...attributes.popper}>
                        <div ref={setArrowRef} style={styles.arrow} className="arrow"/>
                        <Paper className="paper" >
                            <DialogTitle>Column Editor</DialogTitle>
                            <DialogContent>
                                <br/>
                                <TextField onChange={(e)=> captureInput(e.target.value)} autoFocus defaultValue={headingDetails.headingName} size="medium" label="Cell Data"></TextField>

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