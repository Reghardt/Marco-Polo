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





