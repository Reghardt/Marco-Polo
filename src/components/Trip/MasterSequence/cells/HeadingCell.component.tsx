import { Button } from "@mui/material";
import React from "react";


type HeadingCellProps = {
  colNumber: number;
}

const HeadingCell: React.FC<HeadingCellProps> = ({colNumber}) =>
{

  const col = String.fromCharCode(colNumber - 1 + 'A'.charCodeAt(0))

    
    return(
        <React.Fragment>
            <Button variant="contained" style={{height: "100%", width: "100%"}}>{col}</Button>
        </React.Fragment>
    )
}

export default HeadingCell;