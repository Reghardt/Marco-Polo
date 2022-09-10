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
import { RSColumnDesignations, RSFirstRowIsColumn } from "../../../state/globalstate";


interface RoutedataEditorProps{
    rawRouteTableData: IRawRouteTableData;
    setRawRouteTableData: React.Dispatch<React.SetStateAction<IRawRouteTableData>>;
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
    putFirstRowAsHeading: (isHeading: boolean) => void;
}

const RawRouteDataTableEditor: React.FC<RoutedataEditorProps> = ({rawRouteTableData, setRawRouteTableData, handleColumnDesignation, calcRoute, putFirstRowAsHeading}) => {

    const RcolumnDesignations = useRecoilValue(RSColumnDesignations)
    const R_firstRowIsColumn = useRecoilValue(RSFirstRowIsColumn)

    if(R_firstRowIsColumn === undefined)
    {
      console.log("is valid", R_firstRowIsColumn)
    }
    else
    {
      console.log("not valid", R_firstRowIsColumn)
    }

    //Creator Functions //////////////////////////////////////////////////////

    function createColumnDecorators() : JSX.Element[]
    {
      const decorators: JSX.Element[] = [];
      if( rawRouteTableData.rows.length > 0)
      {
        const elementSize = 12 / rawRouteTableData.rows[0].cells.length;
        for(let i = 0; i < rawRouteTableData.rows[0].cells.length; i++)
        {
          decorators.push(<Grid item xs={elementSize}>
            <ColumnDecorator colIdx={i} handleColumnDesignation={handleColumnDesignation}/>
          </Grid>)
        }
        return decorators
      }
      return [];

    }

    function CreateTableHeadingElements(tableData: IRawRouteTableData)
    {
      let tempHeadingsRow: JSX.Element[] = [];
      const elementSize = 12 / tableData.headings.cells.length
      for(let i = 0; i < tableData.headings.cells.length; i++)
      {
        tempHeadingsRow.push(
          <Grid item xs={elementSize}>
            <DataCell
              cellRef={tableData.headings.cells[i]}
              updateBodyCell={updateBodyCell}/>
          </Grid>
        )
      }
      return tempHeadingsRow
    }



    function CreateTableBody(tableData_rows: IRow[]) : JSX.Element[][]
    {
      const cellTable: JSX.Element[][] = [];
      if(tableData_rows.length > 0)
      {
        const elementSize = 12 / tableData_rows[0].cells.length;
        
        for(let i = 0; i< tableData_rows.length; i++)
        {
          const row = tableData_rows[i];
          
          for(let j = 0; j < row.cells.length; j++)
          {
            if(cellTable[i] === undefined)
            {
              cellTable[i] = []; //create row at index for table if the index is undefined
            }
            //add elements to table
            if(RcolumnDesignations[j] === EColumnDesignations.Address )
            {
              cellTable[i][j] = <Grid key={`cell-${i}-${j}`} item xs={elementSize}> {/* TODO Rename To tableBody?*/}
              {/* i and j are the positions of the cell in the cellTable, not the coordinates on the spreadsheet */}
              <AddressCell 
                cellRef={tableData_rows[i].cells[j]}
                updateBodyCell={updateBodyCell}
                />
              </Grid>
            }
            else
            {
              cellTable[i][j] = <Grid key={`cell-${i}-${j}`} item xs={elementSize}> 
              <DataCell 
                cellRef={tableData_rows[i].cells[j]}
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
      setRawRouteTableData((tableData) => {
        let tempTableData: IRawRouteTableData = {...tableData} //creates new copy of table data
        for(let i = 0; i < tempTableData.rows.length; i++) //loops over rows
        {
          let row = tempTableData.rows[i]
          if(row.cells[0].y === cell.y) //if the row of the desired cell is found, loop over row until the desired cell is found
          {

            for(let j = 0; j < row.cells.length; j++) //loops over cells
            {
              let cellInRow = row.cells[j]
              if(cellInRow.x === cell.x) //if x coordinate of cell matches, cell is found
              {
                console.log("cell found")
                tempTableData.rows[i].cells[j] = cell
                return tempTableData
              }
            }
          }
        }
        console.error("cell not found")
        return tempTableData
      });
    }

    ////////////////////////////////////////////////////////////////////

  
    
    return(
      <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
          <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Data Editor</Typography>

          {/* <Typography variant="body2" gutterBottom >Legends:</Typography> */}

          <FormControlLabel sx={{marginBottom: "0.7em"}} control={<Checkbox checked={rawRouteTableData.firstRowIsHeading} onChange={(e) => {putFirstRowAsHeading(e.target.checked)}}/>} label="Use first row as heading" />
          
          <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
            {createColumnDecorators().map((elem, idx) => {
              return <React.Fragment key={`column-decorator-${idx}`}>{elem}</React.Fragment>
            })}
          </Grid>
          <Grid container spacing={0.3}>
            {CreateTableHeadingElements(rawRouteTableData).map((elem, idx) => {
                return <React.Fragment key={`heading-${idx}`}>{elem}</React.Fragment>
                })}
          </Grid>
          <div style={{padding: "5px"}}>
            <Divider/>
          </div>
            
          <Grid container spacing={0.3}>
            {CreateTableBody(rawRouteTableData.rows).map((elem, idx) => {
                return <React.Fragment key={`body-${idx}`}>{elem}</React.Fragment>
            })} 
          </Grid>
          
          <Button sx={{marginTop: "1em"}} onClick={() => calcRoute()} variant="outlined">Find Route</Button>
          
      </Paper>

    )
}

export default RawRouteDataTableEditor