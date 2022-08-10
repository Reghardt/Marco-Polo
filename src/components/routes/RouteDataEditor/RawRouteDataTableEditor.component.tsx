import { Button, Divider, Grid, Paper, Typography } from "@mui/material"
import React, { useRef, useState } from "react"
import { IGeocoderResult } from "../../../interfaces/simpleInterfaces";
import { IRow } from "../../../services/worksheet/row.interface";
import AddressCell from "./cells/AddressCell.component";
import DataCell from "./cells/DataCell.component";
import HeadingCell from "./cells/HeadingCell.component";
import { IHeading } from "../interfaces/Heading.interface";
import { IRawRouteTableData } from "../interfaces/RawRouteDataTable.interface";
import { ICell } from "../../../services/worksheet/cell.interface";
import ColumnDecorator from "./cells/ColumnDecorator.component";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { useRecoilValue } from "recoil";
import { RSColumnDesignations } from "../../../state/globalstate";


interface RoutedataEditorProps{
    rawRouteTableData: IRawRouteTableData;
    setRawRouteTableData: React.Dispatch<React.SetStateAction<IRawRouteTableData>>;
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    geocodeAddress: (address: string) => Promise<IGeocoderResult>;
    calcRoute: () => void;
}

const RawRouteDataTableEditor: React.FC<RoutedataEditorProps> = ({rawRouteTableData, setRawRouteTableData, handleColumnDesignation, geocodeAddress, calcRoute}) => {

    const RcolumnDesignations = useRecoilValue(RSColumnDesignations)

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
              cellTable[i][j] = <Grid item xs={elementSize}> {/* TODO Rename To tableBody?*/}
              {/* i and j are the positions of the cell in the cellTable, not the coordinates on the spreadsheet */}
              <AddressCell 
                i={i}
                j={j}
                cellRef={tableData_rows[i].cells[j]}
                geocodeAddress={geocodeAddress}
                updateBodyCell={updateBodyCell}
                />
              </Grid>
            }
            else
            {
              cellTable[i][j] = <Grid item xs={elementSize}> 
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
    
    return(
        <div>
            <Paper sx={{padding: "10px"}} variant="elevation" elevation={5}>
                <Typography variant="h5" gutterBottom >Route Data Editor</Typography>
                <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
                  {createColumnDecorators().map((elem, idx) => {
                    return <React.Fragment key={idx}>{elem}</React.Fragment>
                  })}
                </Grid>
                <Grid container spacing={0.3}>
                  {CreateTableHeadings(rawRouteTableData.headings).map((elem, idx) => {
                      return <React.Fragment key={idx}>{elem}</React.Fragment>
                      })}
                </Grid>
                <div style={{padding: "5px"}}>
                  <Divider/>
                </div>
                  
                <Grid container spacing={0.3}>
                  {CreateTableBody(rawRouteTableData.rows).map((elem, idx) => {
                      return <React.Fragment key={idx}>{elem}</React.Fragment>
                  })} 
                </Grid>
                
                <Button onClick={() => calcRoute()}>Calc Route</Button>
                
            </Paper>
        </div>
    )
}

export default RawRouteDataTableEditor