import { Row } from "../interfaces/simpleInterfaces";
import { Cell } from "./cell.class";

export class DataTable //each dataTable contains an array of rows
{
    rows: Row[] = [];

    insertCell(cellToAdd: Cell)
    {
        if(!this.rows.length)
        {
            this.rows.push({rowNumber: cellToAdd.y, cell: [cellToAdd]})
        }
        else
        {
            for(let i = 0; i < this.rows.length; i++)
            {
                let row = this.rows[i];
                if(row.rowNumber === cellToAdd.y)
                {
                    row.cell.push(cellToAdd)
                    return;
                }
            }
            this.rows.push({rowNumber: cellToAdd.y, cell: [cellToAdd]}) //else add new row
        }
    }
}