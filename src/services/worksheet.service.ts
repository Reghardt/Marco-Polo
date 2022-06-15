import { DataTable } from "../classes/dataTable.class";
import { generateCellsFromCoordinates } from "./cell.service"

export async function loadSelection() : Promise<DataTable>
{
    return Excel.run(async (context) => {
        let range = context.workbook.getSelectedRanges();
        let sheet = context.workbook.worksheets.getActiveWorksheet()
        range.load("address");

        await context.sync(); //This connects the add-in's process to the Office host application's process.
        let dataTable = generateCellsFromCoordinates(range.address, sheet)
        //console.log(dataTable);

        await context.sync() 
        dataTable.syncCellData()   
        return dataTable;  
    })

}
