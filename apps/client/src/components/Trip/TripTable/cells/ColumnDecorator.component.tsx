import { MenuItem, Select } from "@mui/material"

import React from "react"
import { useTripStore } from "../../../../Zustand/tripStore";

import { EColumnDesignations } from "../../../common/CommonInterfacesAndEnums";


interface ColumnDecoratorProps{
  colIdx: number;
}

const ColumnDecorator : React.FC<ColumnDecoratorProps> = ({colIdx}) => {

  const Z_addresColumIndex = useTripStore((state) => state.data.addressColumnIndex)
  const Z_columnDesignations = useTripStore((state) => state.data.columnDesignations)

  const ZR_updateColumnDesignation = useTripStore((state) => state.reducers.updateColumnDesignation)

  let bgColor = "none";
  if(Z_addresColumIndex < 0)
  {
    bgColor = "#ff9800";
  }

  const handleChange = (type: string | number) => {
    console.log(type)
    if(typeof type == "string")
    {
      const typeValue = parseInt(type)
      ZR_updateColumnDesignation({columnIndex: colIdx, designation: typeValue})
    }
    else
    {
      ZR_updateColumnDesignation({columnIndex: colIdx, designation: type})
    }
  };
  if(Z_columnDesignations[colIdx] === undefined)
  {
    return(<div>
      <Select
          size="small"
          labelId="demo-select-small"
          id="demo-select-small"
          value={0}
          onChange={e => handleChange(e.target.value)}
          sx={{width:"100%", backgroundColor: bgColor}}
      >
          <MenuItem value={EColumnDesignations.Data}>Data</MenuItem>
          <MenuItem value={EColumnDesignations.Address}>Address</MenuItem>
      </Select>        
    </div>)
  }
  else
  {
    return(<div>
      <Select
          size="small"
          labelId="demo-select-small"
          id="demo-select-small"
          value={Z_columnDesignations[colIdx]}
          onChange={e => handleChange(e.target.value)}
          sx={{width:"100%", backgroundColor: bgColor}}
      >
          <MenuItem value={EColumnDesignations.Data}>Data</MenuItem>
          <MenuItem value={EColumnDesignations.Address}>Address</MenuItem>
      </Select>
  </div>)
  }
}

export default ColumnDecorator