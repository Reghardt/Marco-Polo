import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil"
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { ICell } from "../../../services/worksheet/cell.interface";
import { IRow } from "../../../services/worksheet/row.interface";
import { loadSelection } from "../../../services/worksheet/worksheet.service";
import { RSAddresColumnIndex as RSAddresColumnIndex, RSColumnVisibility, RSDepartureAddress, RSErrorMessage, RSJobColumnDesignations, RSPreserveViewport, RSReturnAddress, RSTripDirections, RSTripRows } from "../../../state/globalstate"
import Dragger from "../../experiments/DragNDrop/Dragger.component";
import Dropper from "../../experiments/DragNDrop/Dropper.component";
import { addAndUpdateRows, createDirections, doRowsConform, writeBackToSpreadsheet } from "../../Trip/Trip.service";
import { createCellTypeElementsFromRow_master, createColumnDecorators_master, CreateTableHeadingElements_master } from "./MasterSequence.service";

interface MasterSequenceProps{
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
}

const MasterSequence: React.FC<MasterSequenceProps> = ({handleColumnDesignation, calcRoute}) => {
    const [R_tripRows, R_setTripRows] = useRecoilState(RSTripRows)

    const R_addressColumnIndex = useRecoilValue(RSAddresColumnIndex)

    const R_jobColumnDesignations = useRecoilValue(RSJobColumnDesignations)

    const [R_columnVisibility, R_setColumnVisibility] = useRecoilState(RSColumnVisibility)

    const [Cache_rowsToAdd, Cache_setRowsToAdd] = useState<IRow[]>([])
    const [R_errorMessage, R_setErrorMessage] = useRecoilState(RSErrorMessage)

    const R_departureAddress = useRecoilValue(RSDepartureAddress);
    const R_returnAddress = useRecoilValue(RSReturnAddress);
    const [,R_setPreserveViewport] = useRecoilState(RSPreserveViewport)

    const [, R_setTripDirections] = useRecoilState(RSTripDirections)

    useEffect(() => {
        console.log(Cache_rowsToAdd)
    
        let conformRes = doRowsConform(Cache_rowsToAdd, R_tripRows[0])
        if(conformRes.status === false)
        {
          console.error(conformRes.reason)
          R_setErrorMessage("Error: " + conformRes.reason)
        }
        else
        {
          R_setTripRows(addAndUpdateRows(R_tripRows, Cache_rowsToAdd, R_addressColumnIndex))
          R_setErrorMessage("")
        }
        
      }, [Cache_rowsToAdd])

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

    function createColumnVisibilityOptions(columnNames: IRow, columnVisibility: boolean[])
    {
      let visibilityElements = 
        <Grid container sx={{paddingBottom: "1em", paddingTop: "0.3em"}}>
          {columnNames.cells.map((elem, idx) => {
            return  <Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                      <FormControlLabel  control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                        onChange={(_e) => {R_setColumnVisibility((visibility) => {
                          let newVisibility = [...visibility]
                          newVisibility[idx] = _e.target.checked
                          return newVisibility
                        })}}/>} label={String.fromCharCode(elem.x - 1 + 'A'.charCodeAt(0))} />
                    </Grid>
          })}
        </Grid>

      return visibilityElements
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
      if(R_departureAddress && R_returnAddress)
      {
        recalculateRoute(R_departureAddress.formatted_address, R_returnAddress.formatted_address, newRows, R_addressColumnIndex)
      }
      
      R_setTripRows(newRows)
    }

    function addRows()
    {
      loadSelection().then((selection) => {
        console.log(selection)
        Cache_setRowsToAdd(selection)
      })
    }

    async function recalculateRoute(departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number)
    {
      if(departureAddress !== "" && returnAddress !== "") //test if not "none"
      {
        let waypoints: google.maps.DirectionsWaypoint[]  = [];

        if(addressColumnIndex > -1)
        {
          for(let i = 0; i < rows.length; i++)
          {
            waypoints.push({location: rows[i].cells[addressColumnIndex].data, stopover: true})
          }
        }
         let directions = await createDirections(departureAddress, returnAddress, waypoints, false)
          R_setPreserveViewport(true)
          //TODO cgeck if status is OK
          R_setTripDirections(directions)
      }
    }

    function reverseOrder(rows: IRow[])
    {
      let reversedRows = Array.from(rows).reverse()
      if(R_departureAddress && R_returnAddress)
      {
        recalculateRoute(R_departureAddress.formatted_address, R_returnAddress.formatted_address, reversedRows, R_addressColumnIndex)
      }
      
      R_setTripRows(reversedRows)
    }

    async function handleWriteBackToSpreadsheet()
    {
      let newRows = await writeBackToSpreadsheet(R_tripRows, R_addressColumnIndex)
      console.log(newRows)
      R_setTripRows(newRows)
    }

    if(R_tripRows.length > 0 && R_columnVisibility.length > 0)
    {
        return(
            <div>

                <Typography variant="body2">Show/Hide Columns:</Typography>
                {createColumnVisibilityOptions(R_tripRows[0], R_columnVisibility)}

                <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
                  {createColumnDecorators_master(R_tripRows[0], R_columnVisibility, handleColumnDesignation)}
                </Grid>
                <Grid container spacing={0.3}>
                  {CreateTableHeadingElements_master(R_tripRows[0], R_columnVisibility)}
                </Grid>
                <div style={{padding: "5px"}}>
                  <Divider/>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Dropper droppableId="droppable">
                        {R_tripRows.map((row, idx) => {
                        return (
                            <Dragger key={row.cells[0].y} draggableId={row.cells[0].y.toString()} index={idx}>
                                {createCellTypeElementsFromRow_master(row, idx, R_jobColumnDesignations, updateBodyCell, R_columnVisibility, recalculateRoute)}
                            </Dragger>)
                        })}
                    </Dropper>                    
                </DragDropContext>

                <Stack>
                    <Box>
                        <Stack direction={"row"} spacing={1} sx={{marginTop: "1em"}}>
                        {/* <Box>
                            <RowAdder/>
                        </Box> */}
                        <Box >
                            <Button  variant="outlined" onClick={() => {addRows()}}>Add Selection</Button>
                        </Box>
                        <Box>
                            <Button variant="outlined" onClick={() => {reverseOrder(R_tripRows)}}>Reverse Order</Button>
                        </Box>
                        <Box>
                            <Button variant='outlined' onClick={() => {handleWriteBackToSpreadsheet()}}>Write back</Button>
                        </Box>
                        </Stack>
                        
                    </Box>
                    <Box sx={{width: "100%"}}>
                        <Button sx={{marginTop: "1em", width: "100%"}} onClick={() => calcRoute()} variant="outlined">Find Route</Button>
                    </Box>
                    <Box>
                        <Typography variant="body1" sx={{color: "red"}}>{R_errorMessage}</Typography>
                        
                    </Box>
                </Stack>
            </div>
        )
    }
    else
    {
        return(
          <Box sx={{backgroundColor: "lightGrey", height: "10em", justifyContent:"center", alignItems: "center", display: "flex"}}>
              <Typography align="center" variant="body1" gutterBottom sx={{paddingLeft: "0.5em", paddingRight: "0.5em"}}>No data selected. <br/>Select the desired addresses and their corresponding data in Excel then press "Import Selection" to begin</Typography>
          </Box>
        )
    }
    
    
}

export default MasterSequence