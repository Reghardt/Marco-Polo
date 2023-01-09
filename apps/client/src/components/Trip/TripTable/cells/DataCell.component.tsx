
import { Button } from "@mui/material"
import React from "react"
import { ICell } from "../../../common/CommonInterfacesAndEnums";

type DataCellProps = {
    cellRef: ICell;
}

const DataCell: React.FC<DataCellProps> = ({cellRef}) =>
{

    return(
            <div draggable="true">
                <Button disableRipple variant={"contained"} 
                  sx={{width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start", minHeight: "2.4em", pointerEvents: "none"}}>{cellRef.displayData}</Button>
            </div>
        )
}

export default DataCell;