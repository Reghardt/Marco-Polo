import { Box, Divider, Grid } from "@mui/material"
import React from "react"
import { EColumnDesignations } from "../../../services/ColumnDesignation.service"
import { ICell } from "../../../services/worksheet/cell.interface"
import { IRow } from "../../../services/worksheet/row.interface"
import AddressCell from "../../Trip/TripEditor/cells/AddressCell/AddressCell.component"
import ColumnDecorator from "../../Trip/TripEditor/cells/ColumnDecorator.component"
import DataCell from "../../Trip/TripEditor/cells/DataCell.component"
import BodyEntry from "../SequenceTable/BodyEntry.component"


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

export function CreateTableHeadingElements_master(jobHeadings: IRow, updateBodyCell: (cell: ICell) => void, columnVisibility: boolean[])
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

export function createEntryTypeElementsFromRow_master(row: Readonly<IRow>, nr: number, columnVisibility: boolean[], addressColumIndex: number, updateBodyCell: (cell: ICell) => void)
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
                        if(addressColumIndex === index)
                        {
                            return <AddressCell cellRef={cell} updateBodyCell={updateBodyCell}/>
                        }
                        else
                        {
                            return(
                                <Grid item xs={elementSize}>
                                    <BodyEntry content={cell.data}/>
                                </Grid>
                            )
                        }
                        
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