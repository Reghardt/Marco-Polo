import { IRow } from "../interfaces/simpleInterfaces";
import { ICell } from "./cell.interface";

interface ICellAndRange
{
    cell: ICell;
    range: Excel.Range
}

export class SelectionData //each dataTable contains an array of rows
{
    rows: IRow[] = [];
    private cellAndRange: ICellAndRange[] = [];

    insertCell(cellToAdd: ICell)
    {
        if(!this.rows.length)
        {
            this.rows.push({rowNumber: cellToAdd.y, cells: [cellToAdd]})
        }
        else
        {
            for(let i = 0; i < this.rows.length; i++)
            {
                let row = this.rows[i];
                if(row.rowNumber === cellToAdd.y)
                {
                    row.cells.push(cellToAdd)
                    return;
                }
            }
            this.rows.push({rowNumber: cellToAdd.y, cells: [cellToAdd]}) //else add new row
        }
    }

    loadCellRangeDataAsValue(worksheet: Excel.Worksheet)
    {
        this.cellAndRange = []
        for(let i = 0; i < this.rows.length; i++)
        {
            let row = this.rows[i];
            for(let j = 0; j < row.cells.length; j++)
            {
                let cell = row.cells[j];
                let cellAndRange: ICellAndRange = {cell: cell, range: worksheet.getCell(cell.y - 1, cell.x - 1)};
                cellAndRange.range.load("values")
                this.cellAndRange.push(cellAndRange)
            }
        }
    }

    SaveCellDataFromRangeAfterSync()
    {
        for(let i = 0; i < this.cellAndRange.length; i++)
        {
            this.cellAndRange[i].cell.data = this.cellAndRange[i].range.values[0][0] as string;
        }
    }
}