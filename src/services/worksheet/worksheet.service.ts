import { SelectedCells } from "./selectedCells.class";

interface Range{
    start: {x: number, y: number};
    stop: {x: number, y: number}
}

export async function loadSelection() : Promise<SelectedCells>
{
    return Excel.run(async (context) => {
        let range = context.workbook.getSelectedRanges();
        let sheet = context.workbook.worksheets.getActiveWorksheet()
        range.load("address");

        //This sync is for the address of the selected range
        await context.sync(); //This connects the add-in's process to the Office host application's process.
        let selectionData = generateCellsFromCoordinates(range.address)
        selectionData.loadCellRangeDataAsValue(sheet)
        //console.log(dataTable);

        //this sync is for loading the values from each cell
        await context.sync() 
        selectionData.SaveCellDataFromRangeAfterSync()   
        return selectionData;  
    })

}

function generateCellsFromCoordinates(userSelection: string)
{
    let selectionData: SelectedCells = new SelectedCells();
    let ranges = decodeRangeString(userSelection)
    
    for(let i = 0; i < ranges.length; i++)
    {
        let range = ranges[i];
        for(let j = range.start.x; j <= range.stop.x; j++)
        {
            for(let k = range.start.y; k <= range.stop.y; k++)
            {
                selectionData.insertCell({x: j, y: k, data: ""});
            }
        }
    }
    return selectionData
}

function decodeRangeString(userSelection: string): Range[]
{
    let ranges: Range[] = [];
    let rangesAsString = userSelection.split(','); // splits Sheet2!D3:D7,Sheet2!F4:F8... into seperate ranges by ","
    for(let i = 0; i < rangesAsString.length; i++)
    {
        rangesAsString[i] = rangesAsString[i].split('!')[1]; //throws away "sheetX!" part
        if(rangesAsString[i].split(':').length > 1) //if is a range
        {
            let startCoords = addressToCoordinates(rangesAsString[i].split(':')[0]) // TODO, 2 splits inneficient
            let stopCoords = addressToCoordinates(rangesAsString[i].split(':')[1])
            ranges.push({start: startCoords, stop: stopCoords})
        }
        else //else is single cell
        {
            let startCoords = addressToCoordinates(rangesAsString[i].split(':')[0])
            ranges.push({start: startCoords, stop: startCoords}) //use same start and end coordinates as its only a cell
        }   
    }
    //console.log(ranges)
    return ranges
}

function addressToCoordinates(address: string) : { x: number, y: number }
{
    let characterPart = address.replace(/[0-9]/g,"")
    let numberPart = address.replace(/[A-Z]/g,"")

    collumnToNumber(characterPart)
    return {x: collumnToNumber(characterPart), y: parseInt(numberPart)};
}

function collumnToNumber(collumn: string)
{   
    let out = 0;
    let len = collumn.length
    for(let pos = 0; pos < len; pos++)
    {
        out += (collumn.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
    }
    return out;
}
