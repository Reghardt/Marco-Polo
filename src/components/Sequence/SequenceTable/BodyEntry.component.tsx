import { Box, Typography } from "@mui/material"
import React from "react"

interface BodyEntryProps{
    content: string;
}

const BodyEntry: React.FC<BodyEntryProps> = ({content}) => {
    return(

        <Box sx={
            {width: "100%", 
            height: "100%", 
            justifyContent: "flex-start",
            // paddingBottom: "0.2em",
            // paddingTop: "0.2em",
            minHeight: "1.8em"
            }}
            >
                <div style={{padding: "0.2em"}}>
                <Typography variant="body2">{content}</Typography>
                
                </div>
            
        </Box>

        // <Button style={
        //     {width: "100%", 
        //     height: "100%", 
        //     textTransform: "none", 
        //     borderRadius: 0, 
        //     justifyContent: "flex-start"
        //     }}
        //     disableRipple
        //     sx={{
        //         ':hover': {
        //           bgcolor: 'transparent', // theme.palette.primary.main
        //           //color: 'white',
        //         },
        //         pointerEvents: 'none',
        //         color: "black"
        //       }}
        //     >
        //     {content}
        // </Button>
    )
}

export default BodyEntry