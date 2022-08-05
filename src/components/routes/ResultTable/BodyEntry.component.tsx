import { Box, Button } from "@mui/material"
import React from "react"

interface BodyEntryProps{
    content: string;
}

const BodyEntry: React.FC<BodyEntryProps> = ({content}) => {
    return(
        <Button style={
            {width: "100%", 
            height: "100%", 
            textTransform: "none", 
            borderRadius: 0, 
            justifyContent: "flex-start"
            }}
            disableRipple
            sx={{
                ':hover': {
                  bgcolor: 'transparent', // theme.palette.primary.main
                  //color: 'white',
                },
                pointerEvents: 'none',
                color: "black"
              }}
            >
            {content}
        </Button>
    )
}

export default BodyEntry