import { Grid } from "@mui/material";
import React from "react";
import { IRow } from "../../../services/worksheet/row.interface";
import BodyEntry from "./BodyEntry.component";


export function createEntryTypeElementsFromRow(row: Readonly<IRow>, nr: string, isChild: boolean)
{
    const rowLength = row.cells.length;
    const elementSize = 11 / rowLength;
    let parentRowElements: JSX.Element[] = [];
    let parentRowElementsWithChildRowElements: JSX.Element[][] = [];

    if(isChild)
    {
        parentRowElements.push(
            <Grid item xs={1}>
                <BodyEntry content={""}/>
            </Grid>)
    }
    else
    {
        parentRowElements.push(
            <Grid item xs={1}>
                <BodyEntry content={nr}/>
            </Grid>)
    }
    

    for(let i = 0; i < rowLength; i ++)
    {
        let cell = row.cells[i]
        parentRowElements.push(
            <Grid item xs={elementSize}>
                <BodyEntry content={cell.data}/>
            </Grid>)
    }

    parentRowElementsWithChildRowElements.push(parentRowElements)
    for(let i = 0; i < row.children.length; i++)
    {
        parentRowElementsWithChildRowElements.push(...createEntryTypeElementsFromRow(row.children[i], nr, true))
    }
    return parentRowElementsWithChildRowElements
}