import { Grid } from "@mui/material";
import React from "react";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { ICell } from "../../../services/worksheet/cell.interface";
import { IRow } from "../../../services/worksheet/row.interface";
import BodyEntry from "../../Sequence/ResultTable/BodyEntry.component";
import AddressCell from "./cells/AddressCell/AddressCell.component";
import ColumnDecorator from "./cells/ColumnDecorator.component";
import DataCell from "./cells/DataCell.component";

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

export function createColumnDecorators(jobHeadings: IRow, columnVisibility: boolean[], handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void) : JSX.Element[]
{
    const decorators: JSX.Element[] = [];

    const elementSize = 12 / numberOfVisibleColumns(columnVisibility)
    for(let i = 0; i < jobHeadings.cells.length; i++)
    {
        if(columnVisibility[i] === false)
        {
            continue; //if column is not visible, dont create an element for it.
        }

        decorators.push(<Grid item xs={elementSize}>
        <ColumnDecorator colIdx={i} handleColumnDesignation={handleColumnDesignation}/>
        </Grid>)
    }
    return decorators


}

export function CreateTableHeadingElements(jobHeadings: IRow, updateBodyCell: (cell: ICell) => void, columnVisibility: boolean[])
    {
      let tempHeadingsRow: JSX.Element[] = [];
      const elementSize = 12 / numberOfVisibleColumns(columnVisibility)
      for(let i = 0; i < jobHeadings.cells.length; i++)
      {
        if(columnVisibility[i] === false)
        {
            continue; //if column is not visible, dont create an element for it.
        }

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

export function createCellTypeElementsFromRow(row: Readonly<IRow>, columnDesignations: Readonly<EColumnDesignations[]>, updateBodyCell: (cell: ICell) => void, columnVisibility: boolean[], isChild: boolean = false) : JSX.Element[][]
    {

        const rowLength = columnDesignations.length
        const elementSize = 12 / numberOfVisibleColumns(columnVisibility);
        let parentRowElements: JSX.Element[] = [];
        let parentRowElementsWithChildRowElements: JSX.Element[][] = [];
        for(let i = 0; i < rowLength; i++)
        {
            if(columnVisibility[i] === false)
            {
                continue; //if column is not visible, dont create an element for it.
            }

            let tempElementSize = elementSize
            if(isChild && i === 0)
            {
                tempElementSize = tempElementSize * 0.95
            }

            let cell = row.cells[i]
            if(columnDesignations[i] === EColumnDesignations.Address)
            {
                if(cell.data === "")
                {
                    parentRowElements.push(
                        <Grid key={`cell-${cell.x}-${cell.y}`} item xs={tempElementSize}>
                            <DataCell
                                cellRef={cell}
                                updateBodyCell={updateBodyCell}
                            />
                        </Grid>
                    )
                }
                else
                {
                    parentRowElements.push(
                        <Grid key={`cell-${cell.x}-${cell.y}`} item xs={tempElementSize}>
                            <AddressCell
                                cellRef={cell}
                                updateBodyCell={updateBodyCell}
                            />
                        </Grid>
                    )
                }
                
            }
            else //else is data
            {
                parentRowElements.push(
                    <Grid key={`cell-${cell.x}-${cell.y}`} item xs={tempElementSize}>
                        <DataCell
                            cellRef={cell}
                            updateBodyCell={updateBodyCell}
                        />
                    </Grid>
                )
            }
        }

        parentRowElementsWithChildRowElements.push(parentRowElements)

        for(let i = 0; i < row.children.length; i++)
        {
            parentRowElementsWithChildRowElements.push(...createCellTypeElementsFromRow(row.children[i], columnDesignations, updateBodyCell, columnVisibility, true))
        }
        
        return parentRowElementsWithChildRowElements;
    }

