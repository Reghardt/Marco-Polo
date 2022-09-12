import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Paper, Stack, Typography } from "@mui/material"
import React, { useRef, useState } from "react"
import { IGeocoderResult } from "../../../interfaces/simpleInterfaces";
import { IRow } from "../../../services/worksheet/row.interface";
import AddressCell from "./cells/AddressCell/AddressCell.component";
import DataCell from "./cells/DataCell.component";
import HeadingCell from "./cells/HeadingCell.component";
import { IHeading } from "../interfaces/Heading.interface";
import { IRawRouteTableData } from "../interfaces/RawRouteDataTable.interface";
import { ICell } from "../../../services/worksheet/cell.interface";
import ColumnDecorator from "./cells/ColumnDecorator.component";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { useRecoilState, useRecoilValue } from "recoil";
import { RSJobBody, RSJobColumnDesignations, RSJobFirstRowIsHeaing, RSJobHeadings } from "../../../state/globalstate";


interface RoutedataEditorProps{
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
    putFirstRowAsHeading: (isHeading: boolean) => void;
}

const RawRouteDataTableEditor: React.FC<RoutedataEditorProps> = ({handleColumnDesignation, calcRoute, putFirstRowAsHeading}) => {

  const [R_jobColumnDesignations, R_setJobColumnDesignations] = useRecoilState(RSJobColumnDesignations)
  const [R_jobFirstRowIsHeading, R_setJobFirstRowIsHeading] = useRecoilState(RSJobFirstRowIsHeaing)
  const [R_jobHeadings, R_setJobHeadings] = useRecoilState(RSJobHeadings)
  const [R_jobBody, R_setJobBody] = useRecoilState(RSJobBody)
  

    //Creator Functions //////////////////////////////////////////////////////

    function createColumnDecorators() : JSX.Element[]
    {
      const decorators: JSX.Element[] = [];
      if( R_jobBody.length > 0)
      {
        const elementSize = 12 / R_jobBody[0].cells.length;
        for(let i = 0; i < R_jobBody[0].cells.length; i++)
        {
          decorators.push(<Grid item xs={elementSize}>
            <ColumnDecorator colIdx={i} handleColumnDesignation={handleColumnDesignation}/>
          </Grid>)
        }
        return decorators
      }
      return [];

    }

    function CreateTableHeadingElements(jobHeadings: IRow)
    {
      let tempHeadingsRow: JSX.Element[] = [];
      const elementSize = 12 / jobHeadings.cells.length
      for(let i = 0; i < jobHeadings.cells.length; i++)
      {
        tempHeadingsRow.push(
          <Grid item xs={elementSize}>
            <DataCell
              cellRef={jobHeadings.cells[i]}
              updateBodyCell={updateBodyCell}/>
          </Grid>
        )
      }
      return tempHeadingsRow
    }



    function CreateTableBody(jobBody: IRow[]) : JSX.Element[][]
    {
      const cellTable: JSX.Element[][] = [];
      if(jobBody.length > 0)
      {
        const elementSize = 12 / jobBody[0].cells.length;
        
        for(let i = 0; i< jobBody.length; i++)
        {
          const row = jobBody[i];
          
          for(let j = 0; j < row.cells.length; j++)
          {
            if(cellTable[i] === undefined)
            {
              cellTable[i] = []; //create row at index for table if the index is undefined
            }
            //add elements to table
            if(R_jobColumnDesignations[j] === EColumnDesignations.Address )
            {
              cellTable[i][j] = <Grid key={`cell-${i}-${j}`} item xs={elementSize}> {/* TODO Rename To tableBody?*/}
              {/* i and j are the positions of the cell in the cellTable, not the coordinates on the spreadsheet */}
              <AddressCell 
                cellRef={jobBody[i].cells[j]}
                updateBodyCell={updateBodyCell}
                />
              </Grid>
            }
            else
            {
              cellTable[i][j] = <Grid key={`cell-${i}-${j}`} item xs={elementSize}> 
              <DataCell 
                cellRef={jobBody[i].cells[j]}
                updateBodyCell={updateBodyCell}
                />
              </Grid>
            }
          }
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
      <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
          <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Data Editor</Typography>

          {/* <Typography variant="body2" gutterBottom >Legends:</Typography> */}

          <FormControlLabel sx={{marginBottom: "0.7em"}} control={<Checkbox checked={R_jobFirstRowIsHeading} onChange={(e) => {putFirstRowAsHeading(e.target.checked)}}/>} label="Use first row as heading" />
          
          <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
            {createColumnDecorators().map((elem, idx) => {
              return <React.Fragment key={`column-decorator-${idx}`}>{elem}</React.Fragment>
            })}
          </Grid>
          <Grid container spacing={0.3}>
            {CreateTableHeadingElements(R_jobHeadings).map((elem, idx) => {
                return <React.Fragment key={`heading-${idx}`}>{elem}</React.Fragment>
                })}
          </Grid>
          <div style={{padding: "5px"}}>
            <Divider/>
          </div>
            
          <Grid container spacing={0.3}>
            {CreateTableBody(R_jobBody).map((elem, idx) => {
                return <React.Fragment key={`body-${idx}`}>{elem}</React.Fragment>
            })} 
          </Grid>
          
          <Button sx={{marginTop: "1em"}} onClick={() => calcRoute()} variant="outlined">Find Route</Button>
          
      </Paper>

    )
}

export default RawRouteDataTableEditor