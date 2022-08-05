import { Button } from "@mui/material"
import React from "react"

interface HeadingEntryProps{
    content: string;
}

const HeadingEntry: React.FC<HeadingEntryProps> = ({content}) => {
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

export default HeadingEntry