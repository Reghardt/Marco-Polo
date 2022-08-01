import { IRow } from "../interfaces/simpleInterfaces";
import { Cell } from "./cell.class";

export class SelectionData //each dataTable contains an array of rows
{
    rows: IRow[] = [];

    insertCell(cellToAdd: Cell)
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

    syncCellData()
    {
        for(let i = 0; i < this.rows.length; i++)
        {
            let row = this.rows[i];
            for(let j = 0; j < row.cells.length; j++)
            {
                let cell = row.cells[j];
                cell.readData();
            }

        }
    }
}