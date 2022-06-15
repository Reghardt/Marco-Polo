import { Cell } from "../classes/cell.class";
import { DataTable } from "../classes/dataTable.class";

export interface Range{
    start: {x: number, y: number};
    stop: {x: number, y: number}
}

export function generateCellsFromCoordinates(userSelection: string, worksheet: Excel.Worksheet)
{
    let dataTable: DataTable = new DataTable();
    let ranges = decodeRangeString(userSelection)
    console.log(ranges)
    

    for(let i = 0; i < ranges.length; i++)
    {
        let range = ranges[i];
        for(let j = range.start.x; j <= range.stop.x; j++)
        {
            //console.log(j)
            for(let k = range.start.y; k <= range.stop.y; k++)
            {
                //console.log(j, k)
                dataTable.insertCell(new Cell(j, k, worksheet));
            }
        }
    }
    // console.log(dataTable.rows)
    return dataTable
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