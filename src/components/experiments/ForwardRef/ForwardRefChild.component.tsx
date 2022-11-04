import { Box, TextField } from "@mui/material"
import React from "react"

interface IForwardRefChildProps{
    someText: string
}

const ForwardRefChild = React.forwardRef<HTMLDivElement, IForwardRefChildProps>((props, ref) => {
    return(
        <Box sx={{marginTop: "60em"}}>
            Hello from Child
            {props.someText}
            <TextField  ref={ref} />
        </Box>
    )
}) 
    


export default ForwardRefChild