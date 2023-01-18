import { Button } from "@mui/material";
import React from "react";
import { numberToAlphabetical } from "../../../../Services/Trip.service";


type HeadingCellProps = {
  colNumber: number;
}

const HeadingCell: React.FC<HeadingCellProps> = ({colNumber}) =>
{

  const col = numberToAlphabetical(colNumber)

    
    return(
        <React.Fragment>
            <Button variant="contained" style={{height: "100%", width: "100%"}}>{col}</Button>
        </React.Fragment>
    )
}

export default HeadingCell;