import { Box, Grid, Typography } from "@mui/material"
import React from "react"
import { EColumnDesignations } from "../../../services/ColumnDesignation.service"
import { ICell } from "../../../services/worksheet/cell.interface"
import { IRow } from "../../../services/worksheet/row.interface"
import { makeRowParentChildRelations, preSyncRowDataForDeletion, removeRowParentChildRelations } from "../../Trip/Trip.service"
import AddressCell from "./cells/AddressCell/AddressCell.component"
import ColumnDecorator from "./cells/ColumnDecorator.component"
import DataCell from "./cells/DataCell.component"
import HeadingCell from "./cells/HeadingCell.component"





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

export function createColumnDecorators_master(jobHeadings: IRow, columnVisibility: boolean[], handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void) : JSX.Element
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

export function CreateTableHeadingElements_master(jobHeadings: IRow, columnVisibility: boolean[])
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
                        <HeadingCell colNumber={cell.x}/>
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

export function createCellTypeElementsFromRow_master(row: Readonly<IRow>, nr: number, columnDesignations: Readonly<EColumnDesignations[]>, updateBodyCell: (cell: ICell) => void, columnVisibility: boolean[], recalculateRoute: (departureAddress: string, returnAddress: string, rows: IRow[], addressColumnIndex: number)=> Promise<void>) : JSX.Element
{
    const elementSize = (12 - labelSize) / numberOfVisibleColumns(columnVisibility);

    let rowWithChildren = 
    <React.Fragment>
        <Grid container spacing={"0.2em"} justifyContent="flex-end">
            <Grid item xs={labelSize}>
                <Box sx={{height: "100%", width: "100%", backgroundColor:"#1d85da", justifyContent:"center", alignItems: "center", display: "flex"}}><Typography sx={{color: "white"}} variant="body1">{nr + 1}</Typography></Box>
            </Grid>
            {row.cells.map((cell, index) => {
                if(columnVisibility[index] === true)
                {
                    if(columnDesignations[index] === EColumnDesignations.Address)
                    {
                        return(
                            <Grid key={`cell-${cell.x}-${cell.y}`} item xs={elementSize}>
                                <AddressCell
                                    cellRef={cell}
                                    updateBodyCell={updateBodyCell}
                                    recalculateRoute={recalculateRoute}
                                />
                            </Grid>
                        )
                    }
                    else
                    {
                        return(
                            <Grid key={`cell-${cell.x}-${cell.y}`} item xs={elementSize}>
                                <DataCell
                                    cellRef={cell}
                                    updateBodyCell={updateBodyCell}
                                />
                            </Grid>
                        )
                    }
                }
                else
                {
                    return <></>
                }
            })}

            {row.children.map((row) => {
                return createChildRow(row, updateBodyCell, columnVisibility)
            })}
        </Grid>
        {/* <Divider sx={{margin: "0.2em"}}/> */}
    </React.Fragment>
    
        


    return rowWithChildren;
}

function createChildRow(row: Readonly<IRow>, updateBodyCell: (cell: ICell) => void, columnVisibility: boolean[])
{
    const elementSize = (12 - labelSize) / numberOfVisibleColumns(columnVisibility);

    let childRow =
    <React.Fragment>
        <Grid item xs={labelSize}>
            <Box sx={{height: "100%", width: "100%"}}></Box>
        </Grid>

        {row.cells.map((cell, index) => {
            if(columnVisibility[index] === true)
            {
                return(
                    <Grid key={`cell-${cell.x}-${cell.y}`} item xs={elementSize}>
                        <DataCell
                            cellRef={cell}
                            updateBodyCell={updateBodyCell}
                        />
                    </Grid>
                )
            }
            else
            {
                return <></>
            }
        })}
    </React.Fragment>

    return childRow
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

