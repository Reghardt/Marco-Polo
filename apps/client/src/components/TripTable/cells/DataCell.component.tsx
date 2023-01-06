import React from "react";
import { ICell } from "../../../server/common/CommonInterfacesAndEnums";
import Button from "../../ui/Button";



type DataCellProps = {
    cellRef: ICell;
}

const DataCell: React.FC<DataCellProps> = ({cellRef}) =>
{

    return(
            <React.Fragment>
                <button>{cellRef.displayData}</button>
            </React.Fragment>
        )
}

export default DataCell;