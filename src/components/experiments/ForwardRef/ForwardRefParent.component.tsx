import { Box, Button } from "@mui/material"
import React, { useRef } from "react"
import ForwardRefChild from "./ForwardRefChild.component"

const ForwardRefParent : React.FC = () => {

    const textField = useRef<HTMLDivElement>(null)

    function focusOnTextField()
    {
        if(textField && textField.current)
        {
            console.log(textField.current)
            
        }
    }

    return(
        <Box sx={{height: "80em"}}>
            <Button onClick={() => focusOnTextField()}>
                Focus
            </Button>
            Hello
            <ForwardRefChild ref={textField} someText={"Test text"}/>
        </Box>
    )
}

export default ForwardRefParent