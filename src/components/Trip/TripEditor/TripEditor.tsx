import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { IRow } from "../../../services/worksheet/row.interface";
import { ICell } from "../../../services/worksheet/cell.interface";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { useRecoilState, useRecoilValue } from "recoil";
import { RSColumnVisibility, RSTripRows, RSJobColumnDesignations, RSJobFirstRowIsHeading, RSJobHeadings, RSAddresColumIndex, RSErrorMessage } from "../../../state/globalstate";
import { createCellTypeElementsFromRow, createColumnDecorators, CreateTableHeadingElements } from "./TripEditor.service";
import RowAdder from "./RowAdder/RowAdder.component";
import { loadSelection } from "../../../services/worksheet/worksheet.service";
import { addAndUpdateRows, doRowsConform } from "../Trip.service";

interface RoutedataEditorProps{
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
}

const RouteEditor: React.FC<RoutedataEditorProps> = ({handleColumnDesignation, calcRoute}) => {
  
  const [Cache_rowsToAdd, Cache_setRowsToAdd] = useState<IRow[]>([])

  const R_jobColumnDesignations = useRecoilValue(RSJobColumnDesignations)
  const R_jobHeadings = useRecoilValue(RSJobHeadings)
  const [R_tripRows, R_setTripRows] = useRecoilState(RSTripRows)
  
  const [R_columnVisibility, R_setColumnVisibility] = useRecoilState(RSColumnVisibility)

  const R_addressColumIndex = useRecoilValue(RSAddresColumIndex)

  const [R_errorMessage, R_setErrorMessage] = useRecoilState(RSErrorMessage)

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
      R_setTripRows(addAndUpdateRows(R_tripRows, Cache_rowsToAdd, R_addressColumIndex))
      R_setErrorMessage("")
    }
    
  }, [Cache_rowsToAdd])

  function addRows()
  {
    loadSelection().then((selection) => {
      console.log(selection)
      Cache_setRowsToAdd(selection)
    })
  }

  //Creator Functions //////////////////////////////////////////////////////

  

  /////////////////////////////////////////////////////////////////

  // Update Functions /////////////////////////////////////////////

  //TODO create update function for headings

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

  ////////////////////////////////////////////////////////////////////



  
  return(
    // <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
    <Box>
        

        

        {/* <Typography variant="body2" gutterBottom >Legends:</Typography> */}

        {R_tripRows.length > 0 && (
          <div>      
            <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
              {createColumnDecorators(R_jobHeadings, R_columnVisibility, handleColumnDesignation)}
            </Grid>
            <Grid container spacing={0.3}>
              {CreateTableHeadingElements(R_jobHeadings, updateBodyCell, R_columnVisibility)}
            </Grid>
            <div style={{padding: "5px"}}>
              <Divider/>
            </div>
              
            <Grid container spacing={0.3} justifyContent="flex-end">
              {R_tripRows.map((row, index) => {
                  return createCellTypeElementsFromRow(row, index, R_jobColumnDesignations, updateBodyCell, R_columnVisibility)
              })} 
            </Grid>

            <Stack>
              <Box>
                <Stack direction={"row"} spacing={1}>
                  {/* <Box>
                    <RowAdder/>
                  </Box> */}
                  <Box >
                    <Button sx={{marginTop: "1em"}} variant="outlined" onClick={() => {addRows()}}>Add Selection</Button>
                  </Box>
                  <Box >
                    <Button sx={{marginTop: "1em"}} variant="outlined" disabled>Reset Spreadsheet</Button>
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
        )}

        {R_tripRows.length === 0 && (
          <Box sx={{backgroundColor: "lightGrey", height: "10em", justifyContent:"center", alignItems: "center", display: "flex"}}>
              <Typography align="center" variant="body1" gutterBottom sx={{paddingLeft: "0.5em", paddingRight: "0.5em"}}>No data selected. <br/>Select the desired addresses and their corresponding data in Excel then press "Import Selection" to begin</Typography>
          </Box>
        )}

        
        
    </Box>

  )
}

export default RouteEditor