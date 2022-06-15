import { generateCellsFromCoordinates } from "./cell.service"

export async function getSelectedRanges()
{
    await Excel.run(async (context) => {
        let range = context.workbook.getSelectedRanges();
        range.load("address");

        await context.sync(); //This connects the add-in's process to the Office host application's process.
        generateCellsFromCoordinates(range.address)
        //console.log(range.address);


        
    });
}
