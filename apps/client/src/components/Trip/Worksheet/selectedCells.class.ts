import { ICell, ICellAndRange, IRow } from "../../common/CommonInterfacesAndEnums";




export class SelectedCells 
{
    rows: IRow[] = [];
    private cellAndRange: ICellAndRange[] = [];

    insertCell(cellToAdd: ICell)
    {
        if(!this.rows.length)
        {
            this.rows.push({cells: [cellToAdd], children: [], paths: []})
        }
        else
        {
            for(let i = 0; i < this.rows.length; i++)
            {
                const row = this.rows[i];
                if(row?.cells[0] && row.cells[0].y === cellToAdd.y) //reads first cell in row and compares y coordinate
                {
                    row.cells.push(cellToAdd)
                    return;
                }
            }
            this.rows.push({cells: [cellToAdd], children: [], paths: []}) //else add new row
        }
    }

    loadCellRangeDataAsValue(worksheet: Excel.Worksheet)
    {
        this.cellAndRange = []
        for(let i = 0; i < this.rows.length; i++)
        {
            const row = this.rows[i];
            if(row)
            {
                for(let j = 0; j < row.cells.length; j++)
                {
                    const cell = row.cells[j];
                    if(cell)
                    {
                        const cellAndRange: ICellAndRange = {cell: cell, range: worksheet.getCell(cell.y - 1, cell.x - 1)}; //store cell and range object together to keep track of the realtionship
                        cellAndRange.range.load("values") //tells the range object we want to load values
                        cellAndRange.range.load("formulas") //tells the range object we want to load values
                        this.cellAndRange.push(cellAndRange) //cellAndRange object is pushed to array to later be used (after sync) to extract the value from the range and assign it to the cell
                    }
                    
                }
            }
            
        }
    }

    setCellInitialStateAfterSync()
    {
        for(let i = 0; i < this.cellAndRange.length; i++)
        {
            //set the cells data, the data field gets displayed in MP.
            //Also set the origionalData field to keep track of what the cells value was before any changes like geocoding an address. The use may choose to use the origional or geocoded address for example.
            this.cellAndRange[i]!.cell.displayData = this.cellAndRange[i]!.range.values[0]![0] as string;

            //this.cellAndRange[i].cell.geocodedAddressRes = null; //initialize geocodedAddressRes as null. Only cells designated as an address will be not null

            if(this.cellAndRange[i]!.range.values[0]![0] !== this.cellAndRange[i]!.range.formulas[0]![0])
            {
                //console.log("is formula")
                this.cellAndRange[i]!.cell.formula = this.cellAndRange[i]!.range.formulas[0]![0] as string
            }
            else
            {
                //console.log("is not formula")
            }

            // console.log(JSON.stringify(this.cellAndRange[i].range.values[0][0]), JSON.stringify(this.cellAndRange[i].range.formulas[0][0]))

        }
    }
}