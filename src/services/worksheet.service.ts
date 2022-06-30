import { SelectionData } from "../classes/selectionData.class";
import { generateCellsFromCoordinates } from "./cell.service"

export async function loadSelection() : Promise<SelectionData>
{
    return Excel.run(async (context) => {
        let range = context.workbook.getSelectedRanges();
        let sheet = context.workbook.worksheets.getActiveWorksheet()
        range.load("address");

        await context.sync(); //This connects the add-in's process to the Office host application's process.
        let selectionData = generateCellsFromCoordinates(range.address, sheet)
        //console.log(dataTable);

        await context.sync() 
        selectionData.syncCellData()   
        return selectionData;  
    })

}
