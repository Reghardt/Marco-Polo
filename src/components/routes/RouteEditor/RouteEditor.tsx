import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import React from "react"
import { IRow } from "../../../services/worksheet/row.interface";
import { ICell } from "../../../services/worksheet/cell.interface";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { useRecoilState, useRecoilValue } from "recoil";
import { RSColumnVisibility, RSJobBody, RSJobColumnDesignations, RSJobFirstRowIsHeading, RSJobHeadings } from "../../../state/globalstate";
import { createCellTypeElementsFromRow, createColumnDecorators, CreateTableHeadingElements } from "./RouteEditor.service";

interface RoutedataEditorProps{
    retrieveUserSelectionFromSpreadsheetAndSet: () => void;
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
    putFirstRowAsHeading: (isHeading: boolean) => void;
}

const RouteEditor: React.FC<RoutedataEditorProps> = ({retrieveUserSelectionFromSpreadsheetAndSet, handleColumnDesignation, calcRoute, putFirstRowAsHeading}) => {

  const R_jobColumnDesignations = useRecoilValue(RSJobColumnDesignations)
  const R_jobFirstRowIsHeading = useRecoilValue(RSJobFirstRowIsHeading)
  const R_jobHeadings = useRecoilValue(RSJobHeadings)
  const [R_jobBody, R_setJobBody] = useRecoilState(RSJobBody)
  
  const [R_columnVisibility, R_setColumnVisibility] = useRecoilState(RSColumnVisibility)

    //Creator Functions //////////////////////////////////////////////////////

    function CreateTableBody(jobBody: IRow[]) : JSX.Element[][]
    {
      console.log()
      const cellTable: JSX.Element[][] = [];
      if(jobBody.length > 0)
      {
        for(let i = 0; i< jobBody.length; i++) //loop through rows
        {
          const row = jobBody[i];
          cellTable.push(...createCellTypeElementsFromRow(row, R_jobColumnDesignations, updateBodyCell, R_columnVisibility)) //create jsx elemets for each row's cells as an array         
        }
        return cellTable
      }
      else
      {
        return []
      }
    }

    /////////////////////////////////////////////////////////////////

    // Update Functions /////////////////////////////////////////////

    //TODO create update function for headings

    function updateBodyCell(cell: ICell)
    {
      R_setJobBody((bodyData) => {
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

    function createColumnVisibilityOptions(columnNames: IRow, columnVisibility: boolean[])
    {
      console.log("initial col vis", columnVisibility)
      let visibilityElements = 
        <Grid container sx={{paddingBottom: "1em", paddingTop: "0.3em"}}>
          {columnNames.cells.map((elem, idx) => {
            return  <Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                      <FormControlLabel  control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                        onChange={(_e) => {R_setColumnVisibility((visibility) => {
                          let newVisibility = [...visibility]
                          newVisibility[idx] = _e.target.checked
                          return newVisibility
                        })}}/>} label={elem.data} />
                    </Grid>
          })}
        </Grid>

      return visibilityElements
    }

    
    return(
      // <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
      <Box>
          <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Data Editor</Typography>

          <Button variant="outlined" sx={{marginBottom: "1em"}} onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Import Selection</Button>

          {/* <Typography variant="body2" gutterBottom >Legends:</Typography> */}

          {R_jobBody.length > 0 && (
            <div>
                <Stack spacing={0} sx={{marginBottom:"1em"}}>
                <Box>
                  <FormControlLabel control={<Checkbox checked={R_jobFirstRowIsHeading} onChange={(e) => {putFirstRowAsHeading(e.target.checked)}}/>} label="Use first row as heading" />
                </Box>
                <Box>
                  <Button variant="outlined">Fetch Spreadsheet Updates</Button>
                </Box>
              </Stack>
              
              <Typography variant="body2">Show/Hide Columns:</Typography>
              {createColumnVisibilityOptions(R_jobHeadings, R_columnVisibility)}
                          
              <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
                {createColumnDecorators(R_jobHeadings, R_columnVisibility, handleColumnDesignation).map((elem, idx) => {
                  return <React.Fragment key={`column-decorator-${idx}`}>{elem}</React.Fragment>
                })}
              </Grid>
              <Grid container spacing={0.3}>
                {CreateTableHeadingElements(R_jobHeadings, updateBodyCell, R_columnVisibility).map((elem, idx) => {
                    return <React.Fragment key={`heading-${idx}`}>{elem}</React.Fragment>
                    })}
              </Grid>
              <div style={{padding: "5px"}}>
                <Divider/>
              </div>
                
              <Grid container spacing={0.3} justifyContent="flex-end">
                {CreateTableBody(R_jobBody).map((elem, idx) => {
                    return <React.Fragment key={`body-${idx}`}>{elem}</React.Fragment>
                })} 
              </Grid>

              <Stack>
                <Box>
                  <Stack direction={"row"} spacing={1}>
                    <Box>
                      <Button sx={{marginTop: "1em"}} variant="outlined">Add Row</Button>
                    </Box>
                    <Box >
                      <Button sx={{marginTop: "1em"}} variant="outlined">Append Selection</Button>
                    </Box>
                  </Stack>
                  
                </Box>
                <Box sx={{width: "100%"}}>
                  <Button sx={{marginTop: "1em", width: "100%"}} onClick={() => calcRoute()} variant="outlined">Find Route</Button>
                </Box>
              </Stack>

              

              
              </div>
          )}

          {R_jobBody.length === 0 && (
            <Box sx={{backgroundColor: "lightGrey", height: "10em", justifyContent:"center", alignItems: "center", display: "flex"}}>
                <Typography align="center" variant="body1" gutterBottom sx={{paddingLeft: "0.5em", paddingRight: "0.5em"}}>No data selected. <br/>Select the desired addresses and their corresponding data in Excel then press "Import Selection" to begin</Typography>
            </Box>
          )}

          
          
      </Box>

    )
}

export default RouteEditor