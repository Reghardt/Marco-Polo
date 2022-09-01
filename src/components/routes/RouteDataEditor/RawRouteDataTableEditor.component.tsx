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
    putFirstRowAsHeading: (isHeadings: boolean) => void;
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

    function CreateTableHeadings(tableData_headings: IHeading[]) : JSX.Element[]
    {
      const headingRow: JSX.Element[] = [];
      if(tableData_headings.length > 0)
      {
        const elementSize = 12 / tableData_headings.length;
        for(let i = 0; i< tableData_headings.length; i++)
        {
          headingRow.push(
            <Grid item xs={elementSize}>
              <HeadingCell colId={i} headingDetails={tableData_headings[i]} updateHeading={updateHeading}/>
            </Grid>
          )
        }
        return headingRow;
      }
      return [];
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
                i={i}
                j={j}
                cellRef={tableData_rows[i].cells[j]}
                updateBodyCell={updateBodyCell}
                />
              </Grid>
            }
            else
            {
              cellTable[i][j] = <Grid key={`cell-${i}-${j}`} item xs={elementSize}> 
              <DataCell 
                i={i}
                j={j}
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

    function updateHeading(colNr: number, headingData: IHeading)
    {
      const headings = rawRouteTableData.headings.slice();
      headings[colNr] = headingData;

      setRawRouteTableData({headings: headings, rows: rawRouteTableData.rows})
    }

    function updateBodyCell(i: number, j: number, cell: ICell)
    {
      const tempRawRouteTableData = JSON.parse(JSON.stringify(rawRouteTableData)) as IRawRouteTableData;
      tempRawRouteTableData.rows[i].cells[j] = cell;
      setRawRouteTableData(tempRawRouteTableData);
    }

    ////////////////////////////////////////////////////////////////////

    function handleFirstRowAsHeading(isHeadings: boolean)
    {
        putFirstRowAsHeading(isHeadings)
    }
    
    return(
      <Paper sx={{padding: "10px", marginBottom: "0.5em"}} variant="elevation" elevation={5}>
          <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Route Data Editor</Typography>

          {/* <Typography variant="body2" gutterBottom >Legends:</Typography> */}

          <FormControlLabel sx={{marginBottom: "0.7em"}} control={<Checkbox checked={R_firstRowIsColumn} onChange={(e) => {handleFirstRowAsHeading(e.target.checked)}}/>} label="Use first row as heading" />
          
          <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
            {createColumnDecorators().map((elem, idx) => {
              return <React.Fragment key={`column-decorator-${idx}`}>{elem}</React.Fragment>
            })}
          </Grid>
          <Grid container spacing={0.3}>
            {CreateTableHeadings(rawRouteTableData.headings).map((elem, idx) => {
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