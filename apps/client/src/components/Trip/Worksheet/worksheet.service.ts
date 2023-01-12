import { IRow } from "../../common/CommonInterfacesAndEnums";
import { SelectedCells } from "./selectedCells.class";


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
        if(range)
        {
            for(let j = range.start.x; j <= range.stop.x; j++)
            {
                for(let k = range.start.y; k <= range.stop.y; k++)
                {
                    selectionData.insertCell({x: j, y: k, displayData: "", editableData: "", geocodedDataAndStatus: null, selectedGeocodedAddressIndex: 0,  formula: "", isAddressValidAndAccepted: false});
                }
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
        if(rangesAsString[i]?.split('!')[1])
        {
            rangesAsString[i] = rangesAsString[i]?.split('!')[1]!; //throws away "sheetX!" part
            if(rangesAsString[i]!.split(':')!.length > 1) //if is a range
            {
                const startCoords = addressToCoordinates(rangesAsString[i]!.split(':')[0]!) // TODO, 2 splits inneficient
                const stopCoords = addressToCoordinates(rangesAsString[i]!.split(':')[1]!)
                ranges.push({start: startCoords, stop: stopCoords})
            }
            else //else is single cell
            {
                const startCoords = addressToCoordinates(rangesAsString[i]!.split(':')[0]!)
                ranges.push({start: startCoords, stop: startCoords}) //use same start and end coordinates as its only a cell
            }
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
