import { Grid } from "@mui/material";
import React from "react";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { ICell } from "../../../services/worksheet/cell.interface";
import { IRow } from "../../../services/worksheet/row.interface";
import BodyEntry from "../../Sequence/ResultTable/BodyEntry.component";
import AddressCell from "./cells/AddressCell/AddressCell.component";
import DataCell from "./cells/DataCell.component";

export function createCellTypeElementsFromRow(row: Readonly<IRow>, columnDesignations: Readonly<EColumnDesignations[]>, updateBodyCell: (cell: ICell) => void, isChild: boolean = false) : JSX.Element[][]
    {
        const rowLength = row.cells.length;
        const elementSize = 12 / rowLength;
        let parentRowElements: JSX.Element[] = [];
        let parentRowElementsWithChildRowElements: JSX.Element[][] = [];
        for(let i = 0; i < rowLength; i++)
        {
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
            parentRowElementsWithChildRowElements.push(...createCellTypeElementsFromRow(row.children[i], columnDesignations, updateBodyCell, true))
        }
        
        return parentRowElementsWithChildRowElements;
    }

