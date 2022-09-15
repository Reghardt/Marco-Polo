import { IRow } from "../../services/worksheet/row.interface";

export function preSyncRowDataForWriteBack(row: IRow, sheet: Excel.Worksheet)
{
    for(let j = 0; j < row.cells.length; j++)
    {
        let range = sheet.getCell(row.cells[j].y - 1, row.cells[j].x - 1)
        range.values = [[row.cells[j].data]]
        range.format.autofitColumns();
    }

    for(let i = 0; i < row.children.length; i++)
    {
        preSyncRowDataForWriteBack(row.children[i], sheet)
    }
}