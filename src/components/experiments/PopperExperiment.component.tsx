import { Button, Grid, Paper } from "@mui/material"
import { createPopper, VirtualElement } from '@popperjs/core';
import React, { ElementRef, useRef, useState } from "react"
import { usePopper } from "react-popper";

import './expStyles.css'

const PopperExperiment : React.FC = () => {

    // const popcorn = document.getElementById('#popcorn');
    // const tooltip = document.getElementById('#tooltip');

    const [referenceElement, setReferenceElement] = useState<any>();
    const [popperElement, setPopperElement] = useState<any>();
    const [arrowElement, setArrowElement] = useState<any>();
    const [show, setShow] = useState(false)

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'bottom',
        modifiers: [
            {
                name: "arrow",
                options: {
                  element: arrowElement
                }
            }
        ],
      });

    return(
        <div style={{flexGrow: 1}}>
            <div style={{height: 400, overflow: 'auto', marginBottom: 3}}>
                <Grid sx={{position: "relative", width: "230%", height: "230%", backgroundColor: "lightgray"}} alignItems="center" justifyContent="center" container>
                    <Button aria-describedby="tooltip" ref={setReferenceElement} onClick={() => setShow(!show)}>Press Me</Button>
                    {show && (
                        <Paper id="tooltip" role="tooltip" ref={setPopperElement} style={styles.popper} {...attributes.popper}>
                            <div>Popcorn</div>
                            <div>New Item</div>
                            <div id="arrow" data-popper-arrow ref={setArrowElement} style={styles.arrow}></div>
                        </Paper>
                    )}
                </Grid>

            </div>
        </div>


    )
}

export default PopperExperiment