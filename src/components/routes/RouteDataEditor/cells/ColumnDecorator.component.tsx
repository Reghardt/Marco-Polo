import { MenuItem, Select } from "@mui/material"
import React from "react"
import { useRecoilValue } from "recoil";
import { EColumnDesignations } from "../../../../services/ColumnDesignation.service";
import { RSAddesColumIndex, RSColumnDesignations } from "../../../../state/globalstate";

interface ColumnDecoratorProps{
  colIdx: number;
  handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void
}

const ColumnDecorator : React.FC<ColumnDecoratorProps> = ({handleColumnDesignation, colIdx}) => {
const RcolumnDesignations = useRecoilValue(RSColumnDesignations)
const RaddesColumIndex = useRecoilValue(RSAddesColumIndex)

  let bgColor = "none";
  if(RaddesColumIndex < 0)
  {
    bgColor = "orange";
  }

  const handleChange = (type: string | number) => {
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
  if(RcolumnDesignations[colIdx] === undefined)
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
          value={RcolumnDesignations[colIdx]}
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