import { ICellAndRange } from "../../interfaces/simpleInterfaces";
import { ICell } from "./cell.interface";
import { IRow } from "./row.interface";



export class SelectedCells 
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
                let cellAndRange: ICellAndRange = {cell: cell, range: worksheet.getCell(cell.y - 1, cell.x - 1)}; //store cell and range object together to keep track of the realtionship
                cellAndRange.range.load("values") //tells the range object we want to load values
                this.cellAndRange.push(cellAndRange) //cellAndRange object is pushed to array to later be used (after sync) to extract the value from the range and assign it to the cell
            }
        }
    }

    setCellInitialStateAfterSync()
    {
        for(let i = 0; i < this.cellAndRange.length; i++)
        {
            //set the cells data, the data field gets displayed in MP.
            //Also set the origionalData field to keep track of what the cells value was before any changes like geocoding an address. The use may choose to use the origional or geocoded address for example.
            this.cellAndRange[i].cell.data = this.cellAndRange[i].range.values[0][0] as string;
            this.cellAndRange[i].cell.origionalData = this.cellAndRange[i].range.values[0][0] as string;
            this.cellAndRange[i].cell.geocodedAddressRes = null; //initialize geocodedAddressRes as null. Only cells designated as an address will be not null
        }
    }
}