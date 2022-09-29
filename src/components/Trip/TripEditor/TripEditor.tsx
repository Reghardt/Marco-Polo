import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import React from "react"
import { IRow } from "../../../services/worksheet/row.interface";
import { ICell } from "../../../services/worksheet/cell.interface";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { useRecoilState, useRecoilValue } from "recoil";
import { RSColumnVisibility, RSTripRows, RSJobColumnDesignations, RSJobFirstRowIsHeading, RSJobHeadings } from "../../../state/globalstate";
import { createCellTypeElementsFromRow, createColumnDecorators, CreateTableHeadingElements } from "./TripEditor.service";
import RowAdder from "./RowAdder/RowAdder.component";

interface RoutedataEditorProps{
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
}

const RouteEditor: React.FC<RoutedataEditorProps> = ({handleColumnDesignation, calcRoute}) => {

  const R_jobColumnDesignations = useRecoilValue(RSJobColumnDesignations)
  const R_jobFirstRowIsHeading = useRecoilValue(RSJobFirstRowIsHeading)
  const R_jobHeadings = useRecoilValue(RSJobHeadings)
  const [R_jobBody, R_setJobBody] = useRecoilState(RSTripRows)
  
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



    
    return(
      // <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
      <Box>
          

          

          {/* <Typography variant="body2" gutterBottom >Legends:</Typography> */}

          {R_jobBody.length > 0 && (
            <div>      
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
                      <RowAdder/>
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