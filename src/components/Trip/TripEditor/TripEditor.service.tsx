import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { ICell } from "../../../services/worksheet/cell.interface";
import { IRow } from "../../../services/worksheet/row.interface";
import { preSyncRowDataForDeletion } from "../Trip.service";

import AddressCell from "./cells/AddressCell/AddressCell.component";
import ColumnDecorator from "./cells/ColumnDecorator.component";
import DataCell from "./cells/DataCell.component";


const labelSize = 0.5;

function numberOfVisibleColumns(columnVisibility: boolean[]): number
{
    let num = 0
    for(let i = 0; i < columnVisibility.length; i++)
    {
        if(columnVisibility[i] === true)
        {
            num++
        }
    }
    return num
}

export function createColumnDecorators(jobHeadings: IRow, columnVisibility: boolean[], handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void) : JSX.Element
{

    const elementSize = (12 - labelSize) / numberOfVisibleColumns(columnVisibility)

    let decorators =
    <React.Fragment>
        <Grid item xs={labelSize}>
            <Box sx={{height: "100%", width: "100%"}}></Box>
        </Grid>
        {jobHeadings.cells.map((_cell,index) => {
            if(columnVisibility[index] === true)
            {
                return(<Grid item xs={elementSize}>
                    <ColumnDecorator colIdx={index} handleColumnDesignation={handleColumnDesignation}/>
                </Grid>)
            }
            else
            {
                return <></>
            }
        })}
    </React.Fragment>
    return decorators


}

export function CreateTableHeadingElements(jobHeadings: IRow, updateBodyCell: (cell: ICell) => void, columnVisibility: boolean[])
    {
      const elementSize = (12 - labelSize) / numberOfVisibleColumns(columnVisibility)
      let headings =
      <React.Fragment>
        <Grid item xs={labelSize}>
            <Box sx={{height: "100%", width: "100%"}}></Box>
        </Grid>
        {jobHeadings.cells.map((cell, index) => {
            if(columnVisibility[index] === true)
            {
                return(
                    <Grid item xs={elementSize}>
                        <DataCell
                        cellRef={cell}
                        updateBodyCell={updateBodyCell}/>
                    </Grid>
                )
            }
            else
            {
                return(<></>)
            }
        })}
      </React.Fragment>
      return headings
    }


export async function deleteRow(rowYCoord: number, rows: IRow[])
{
    for(let i = 0; i < rows.length; i++)
    {
        let row = rows[i]
        if(row.cells[0].y === rowYCoord)
        {
            let newRows = Array.from(rows)
            let deletedRow = newRows.splice(i, 1)

            Excel.run(async (context) => {
                let sheet = context.workbook.worksheets.getActiveWorksheet()
                for(let j = 0; j < deletedRow.length; j++)
                {   
                    preSyncRowDataForDeletion(deletedRow[j], sheet)
                }
                    
                
                await context.sync()
            })

            return newRows
        }
    }

    return rows
}

