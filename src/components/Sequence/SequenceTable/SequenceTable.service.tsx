import { Divider, Grid } from "@mui/material";
import React from "react";
import { IRow } from "../../../services/worksheet/row.interface";
import { makeRowParentChildRelations, removeRowParentChildRelations } from "../../Trip/Trip.service";
import BodyEntry from "./BodyEntry.component";


export function createEntryTypeElementsFromRow(row: Readonly<IRow>, nr: number, columnVisibility: boolean[])
{
    let nrOfVisibleColumns = 0;
    for(let i = 0; i < columnVisibility.length; i++)
    {
        if(columnVisibility[i])
        {
            nrOfVisibleColumns++
        }
    }

    const elementSize = 11 / nrOfVisibleColumns;
    let childRows: JSX.Element

    if(row.children.length > 0)
    {
        childRows = <React.Fragment>
            {row.children.map((row) => {
                return createChildRow(row, columnVisibility)
            })}
        </React.Fragment>
    }
    

    let rowWithChildren = 
        <React.Fragment>
            <Grid container spacing={0.3}>
                <Grid item xs={1}>
                    <BodyEntry content={nr.toString()}/>
                </Grid>
                {row.cells.map((cell, index) => {
                    if(columnVisibility[index] === true)
                    {
                        return <Grid item xs={elementSize}>
                            <BodyEntry content={cell.data}/>
                        </Grid>
                    }
                    else
                    {
                        return <></>
                    }
                    
                })}
            </Grid>
            {childRows}
            <Divider/>
        </React.Fragment>
        
    return rowWithChildren
}

function createChildRow(row: Readonly<IRow>, columnVisibility: boolean[])
{
    let nrOfVisibleColumns = 0;
    for(let i = 0; i < columnVisibility.length; i++)
    {
        if(columnVisibility[i])
        {
            nrOfVisibleColumns++
        }
    }

    const elementSize = 11 / nrOfVisibleColumns;

    let childRow =
        <Grid container spacing={0.3}>
            <Grid item xs={1}>
                <BodyEntry content={""}/>
            </Grid>
            {row.cells.map((cell, index) => {
                if(columnVisibility[index] === true)
                {
                    return <Grid item xs={elementSize}>
                        <BodyEntry content={cell.data}/>
                    </Grid>
                }
                else
                {
                    return <></>
                }
                
            })}
        </Grid>;

    
    return childRow
}

export function preSyncRowDataForWriteBack(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
        let cell = row.cells[j]
        if(!cell.isFormula) //if cell is not formula
        {
            let range = sheet.getCell(cell.y - 1, cell.x - 1)
            range.values = [[cell.data]]
            range.format.autofitColumns();
        }
    }

    for(let i = 0; i < row.children.length; i++)
    {
        preSyncRowDataForWriteBack(row.children[i], sheet)
    }
}

export function preSyncRowDataForDeletion(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
        let cell = row.cells[j]
        if(!cell.isFormula) //if cell is not formula
        {
            let range = sheet.getCell(cell.y - 1, cell.x - 1)
            range.values = [[""]]
            //range.format.autofitColumns();
        }
    }

    for(let i = 0; i < row.children.length; i++)
    {
        preSyncRowDataForDeletion(row.children[i], sheet)
    }
}

function getTopRowYValue(rows: IRow[]): number
{
    let topRowNr = rows[0].cells[0].y
    for(let i = 0; i<  rows.length; i++)
    {
        if(rows[i].cells[0].y < topRowNr)
        {
            topRowNr = rows[i].cells[0].y
        }
    }
    return topRowNr
}

function getXValuesOfRowCellsInBody(rows: IRow[]) : number[]
{
    let row = rows[0]
    let cellXVals: number[] = []
    for(let i = 0; i < row.cells.length; i++)
    {
        cellXVals.push(row.cells[i].x)
    }
    return cellXVals
}

export async function writeBackToSpreadsheet(rows: IRow[], addressColumnIndex: number)
  {
    let writeBackRows = removeRowParentChildRelations(JSON.parse(JSON.stringify(rows)) as IRow[])
        
    let topYVal = getTopRowYValue(writeBackRows)
    let xCoords = getXValuesOfRowCellsInBody(writeBackRows)

    for(let i = 0; i < writeBackRows.length; i++)
    {
        let row = writeBackRows[i]
        for(let j = 0; j < row.cells.length; j++)
        {
            row.cells[j].x = xCoords[j]
            row.cells[j].y = topYVal + i
        }
    }

    writeBackRows = makeRowParentChildRelations(writeBackRows, addressColumnIndex)

    Excel.run(async (context) => {
        let sheet = context.workbook.worksheets.getActiveWorksheet()
        for(let i = 0; i < writeBackRows.length; i++)
        {
            preSyncRowDataForWriteBack(writeBackRows[i], sheet)
        }
        await context.sync()
    })
  }