import { MenuItem, Select } from "@mui/material"

import React from "react"
import { handleColumnDesignationAndSolveColumnAddresses } from "../../../../Services/Trip.service";
import { useTripStore } from "../../../../Zustand/tripStore";
import { EColumnDesignations } from "../../../common/CommonInterfacesAndEnums";


interface ColumnDecoratorProps{
  columnIndex: number;
}

const ColumnDesignationSelector : React.FC<ColumnDecoratorProps> = ({columnIndex}) => {

  const Z_addresColumIndex = useTripStore((state) => state.data.addressColumnIndex)
  const Z_columnDesignations = useTripStore((state) => state.data.columnDesignations)

  let bgColor = "none";
  if(Z_addresColumIndex < 0)
  {
    bgColor = "#ff9800";
  }

  return(
    <div>
      <Select
        size="small"
        labelId="demo-select-small"
        id="demo-select-small"
        value={Z_columnDesignations[columnIndex]}
        onChange={e => handleColumnDesignationAndSolveColumnAddresses(columnIndex, e.target.value as EColumnDesignations)}
        sx={{width:"100%", backgroundColor: bgColor}}
      >
        <MenuItem value={EColumnDesignations.Data}>Data</MenuItem>
        <MenuItem value={EColumnDesignations.Address}>Address</MenuItem>
        <MenuItem value={EColumnDesignations.LinkAddress}>Link Address</MenuItem>
      </Select>
    </div>
  )

}

export default ColumnDesignationSelector