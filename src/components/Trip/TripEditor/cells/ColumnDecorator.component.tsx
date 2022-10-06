import { MenuItem, Select } from "@mui/material"
import React from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { EColumnDesignations } from "../../../../services/ColumnDesignation.service";
import { RSAddresColumnIndex, RSJobColumnDesignations } from "../../../../state/globalstate";

interface ColumnDecoratorProps{
  colIdx: number;
  handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void
}

const ColumnDecorator : React.FC<ColumnDecoratorProps> = ({handleColumnDesignation, colIdx}) => {

  const R_jobColumnDesignations = useRecoilValue(RSJobColumnDesignations)
  const R_addresColumIndex = useRecoilValue(RSAddresColumnIndex)

  let bgColor = "none";
  if(R_addresColumIndex < 0)
  {
    bgColor = "#ff9800";
  }

  const handleChange = (type: string | number) => {
    console.log(type)
    if(typeof type == "string")
    {
      const typeValue = parseInt(type)
      handleColumnDesignation(colIdx,typeValue)
    }
    else
    {
      handleColumnDesignation(colIdx,type)
    }
  };
  if(R_jobColumnDesignations[colIdx] === undefined)
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
          value={R_jobColumnDesignations[colIdx]}
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