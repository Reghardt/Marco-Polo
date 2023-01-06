import { IRow, ICell, ICellAndRange } from "../common/interfaces";

class SelectedCells 
{
    rows: IRow[] = [];
    private cellAndRange: ICellAndRange[] = [];

    insertCell(cellToAdd: ICell)
    {
        if(!this.rows.length)
        {
            this.rows.push({cells: [cellToAdd], children: []})
        }
        else
        {
            for(let i = 0; i < this.rows.length; i++)
            {
                const row = this.rows[i];
                if(row.cells[0].y === cellToAdd.y) //reads first cell in row and compares y coordinate
                {
                    row.cells.push(cellToAdd)
                    return;
                }
            }
            this.rows.push({cells: [cellToAdd], children: []}) //else add new row
        }
    }

    loadCellRangeDataAsValue(worksheet: Excel.Worksheet)
    {
        this.cellAndRange = []
        for(let i = 0; i < this.rows.length; i++)
        {
            const row = this.rows[i];
            for(let j = 0; j < row.cells.length; j++)
            {
                const cell = row.cells[j];
                const cellAndRange: ICellAndRange = {cell: cell, range: worksheet.getCell(cell.y - 1, cell.x - 1)}; //store cell and range object together to keep track of the realtionship
                cellAndRange.range.load("values") //tells the range object we want to load values
                cellAndRange.range.load("formulas") //tells the range object we want to load values
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
            this.cellAndRange[i].cell.displayData = this.cellAndRange[i].range.values[0][0] as string;
            this.cellAndRange[i].cell.editableData = this.cellAndRange[i].range.values[0][0] as string;
            //this.cellAndRange[i].cell.geocodedAddressRes = null; //initialize geocodedAddressRes as null. Only cells designated as an address will be not null

            if(this.cellAndRange[i].range.values[0][0] !== this.cellAndRange[i].range.formulas[0][0])
            {
                //console.log("is formula")
                this.cellAndRange[i].cell.formula = this.cellAndRange[i].range.formulas[0][0] as string
            }
            else
            {
                //console.log("is not formula")
            }

            // console.log(JSON.stringify(this.cellAndRange[i].range.values[0][0]), JSON.stringify(this.cellAndRange[i].range.formulas[0][0]))

        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

interface Range{
    start: {x: number, y: number};
    stop: {x: number, y: number}
}

export async function loadSelection() : Promise<IRow[]>
{
    return Excel.run(async (context) => {
        const range = context.workbook.getSelectedRanges();
        const sheet = context.workbook.worksheets.getActiveWorksheet()
        range.load("address");

        //This sync is for the address of the selected range
        await context.sync(); //This connects the add-in's process to the Office host application's process.
        const selectionData = generateCellsFromCoordinates(range.address)
        selectionData.loadCellRangeDataAsValue(sheet)
        //console.log(dataTable);

        //this sync is for loading the values from each cell
        await context.sync() 
        selectionData.setCellInitialStateAfterSync()   
        return selectionData.rows;  
    })

}

function generateCellsFromCoordinates(userSelection: string)
{
    const selectionData: SelectedCells = new SelectedCells();
    const ranges = decodeRangeString(userSelection)
    
    for(let i = 0; i < ranges.length; i++)
    {
        const range = ranges[i];
        for(let j = range.start.x; j <= range.stop.x; j++)
        {
            for(let k = range.start.y; k <= range.stop.y; k++)
            {
                selectionData.insertCell({x: j, y: k, displayData: "", editableData: "", geoStatusAndRes: null, selectedGeocodedAddressIndex: -1,  formula: "", geoResConfirmed: false});
            }
        }
    }
    return selectionData
}

function decodeRangeString(userSelection: string): Range[]
{
    const ranges: Range[] = [];
    const rangesAsString = userSelection.split(','); // splits Sheet2!D3:D7,Sheet2!F4:F8... into seperate ranges by ","
    for(let i = 0; i < rangesAsString.length; i++)
    {
        rangesAsString[i] = rangesAsString[i].split('!')[1]; //throws away "sheetX!" part
        if(rangesAsString[i].split(':').length > 1) //if is a range
        {
            const startCoords = addressToCoordinates(rangesAsString[i].split(':')[0]) // TODO, 2 splits inneficient
            const stopCoords = addressToCoordinates(rangesAsString[i].split(':')[1])
            ranges.push({start: startCoords, stop: stopCoords})
        }
        else //else is single cell
        {
            const startCoords = addressToCoordinates(rangesAsString[i].split(':')[0])
            ranges.push({start: startCoords, stop: startCoords}) //use same start and end coordinates as its only a cell
        }   
    }
    //console.log(ranges)
    return ranges
}

function addressToCoordinates(address: string) : { x: number, y: number }
{
    const characterPart = address.replace(/[0-9]/g,"")
    const numberPart = address.replace(/[A-Z]/g,"")

    collumnToNumber(characterPart)
    return {x: collumnToNumber(characterPart), y: parseInt(numberPart)};
}

function collumnToNumber(collumn: string)
{   
    let out = 0;
    const len = collumn.length
    for(let pos = 0; pos < len; pos++)
    {
        out += (collumn.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
    }
    return out;
}
