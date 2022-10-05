import { Divider, Grid } from "@mui/material"
import React from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil"
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { ICell } from "../../../services/worksheet/cell.interface";
import { IRow } from "../../../services/worksheet/row.interface";
import { RSAddresColumIndex, RSColumnVisibility, RSJobHeadings, RSTripRows } from "../../../state/globalstate"
import Dragger from "../../experiments/DragNDrop/Dragger.component";
import Dropper from "../../experiments/DragNDrop/Dropper.component";
import { createColumnDecorators_master, createEntryTypeElementsFromRow_master, CreateTableHeadingElements_master } from "./MasterSequence.service";

interface MasterSequenceProps{
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
}

const MasterSequence: React.FC<MasterSequenceProps> = ({handleColumnDesignation}) => {

    const R_jobHeadings = useRecoilValue(RSJobHeadings)
    const R_columnVisibility = useRecoilValue(RSColumnVisibility)
    const [R_tripRows, R_setTripRows] = useRecoilState(RSTripRows)

    const R_addressColumIndex = useRecoilValue(RSAddresColumIndex)

    function updateBodyCell(cell: ICell)
    {
      R_setTripRows((bodyData) => {
        let tempBodyData = JSON.parse(JSON.stringify(bodyData))
        cell.data = cell.data.trim();
        for(let i = 0; i < tempBodyData.length; i++) //loops over rows
        {
          let row = tempBodyData[i]
          if(row.cells[0].y === cell.y) //if the row of the desired cell is found, loop over row until the desired cell is found
          {
  
            for(let j = 0; j < row.cells.length; j++) //loops over cells
            {
              let cellInRow = row.cells[j]
              if(cellInRow.x === cell.x) //if x coordinate of cell matches, cell is found
              {
                console.log("cell found")
                tempBodyData[i].cells[j] = cell
                return tempBodyData
              }
            }
          }
        }
        console.error("cell not found")
        return tempBodyData
      });
    }

    function reorder(list: IRow[], startIndex: number, endIndex: number )
    {
  
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }

    function onDragEnd(result: DropResult)
    {
      if(!result.destination)
      {
          return;
      }
  
      const newRows = reorder(R_tripRows, result.source.index, result.destination.index)
      //recalculateRoute(R_departureAddress.formatted_address, R_returnAddress.formatted_address, newRows, R_addressColumnIndex)
      R_setTripRows(newRows)
    }

    if(R_jobHeadings && R_columnVisibility.length > 0)
    {
        return(
            <div>
                <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
                  {createColumnDecorators_master(R_jobHeadings, R_columnVisibility, handleColumnDesignation)}
                </Grid>
                <Grid container spacing={0.3}>
                  {CreateTableHeadingElements_master(R_jobHeadings, updateBodyCell, R_columnVisibility)}
                </Grid>
                <div style={{padding: "5px"}}>
                  <Divider/>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Dropper droppableId="droppable">
                        {R_tripRows.map((row, idx) => {
                        return (
                            <Dragger key={row.cells[0].y} draggableId={row.cells[0].y.toString()} index={idx}>
                            
                            {createEntryTypeElementsFromRow_master(row, idx + 1, R_columnVisibility, R_addressColumIndex, updateBodyCell)}
                            </Dragger>)
                        })}
                    </Dropper>
                    
                </DragDropContext>
            </div>
        )
    }
    else
    {
        return(<></>)
    }
    
    
}

export default MasterSequence