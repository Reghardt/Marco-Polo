export class Cell
{
    x: number;
    y: number;
    worksheetRef: Excel.Worksheet;
    private cell: Excel.Range
    data: string;

    constructor(x: number, y: number, worksheetRef: Excel.Worksheet)
    {
        this.x = x;
        this.y = y;
        this.worksheetRef= worksheetRef
        this.loadData()
    }

    loadData()
    {
        this.cell = this.worksheetRef.getCell(this.y - 1, this.x - 1) // row then collumn
        this.cell.load("values")
        //console.log("load")
    }

    readData()
    {
        //TODO handle error if there may be some read error
        let values = this.cell.values 
        this.data = values[0][0] //returns 2d array but we only fetch a single cell so return first item as it the only item
        //console.log(this.data)
    }
}