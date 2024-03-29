import { MenuItem, Select } from "@mui/material"

import React from "react"
import { handleColumnDesignationAndSolveAddresses } from "../../../../Services/Trip.service";
import { useTripStore } from "../../../../Zustand/tripStore";
import { EColumnDesignations } from "../../../common/CommonInterfacesAndEnums";


interface ColumnDecoratorProps{
  columnIndex: number;
}

const ColumnDesignationSelector : React.FC<ColumnDecoratorProps> = ({columnIndex}) => {

  const Z_columnDesignations = useTripStore((state) => state.data.columnDesignations)

  return(
    <div className="mb-1 ">
      <Select
        size="small"
        labelId="demo-select-small"
        id="demo-select-small"
        value={Z_columnDesignations[columnIndex]}
        onChange={e => handleColumnDesignationAndSolveAddresses(columnIndex, e.target.value as EColumnDesignations)}
        sx={{width:"100%", borderRadius: 0}}
      >
        <MenuItem value={EColumnDesignations.Data}>Data</MenuItem>
        <MenuItem value={EColumnDesignations.Address}>Address</MenuItem>
        <MenuItem value={EColumnDesignations.LinkAddress}>Link Address</MenuItem>
      </Select>
    </div>
  )

}

export default ColumnDesignationSelector