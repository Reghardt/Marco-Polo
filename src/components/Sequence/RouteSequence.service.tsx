import { IRow } from "../../services/worksheet/row.interface";
import { makeRowParentChildRelations, removeRowParentChildRelations } from "../Trip/Trip.service";


export function preSyncRowDataForWriteBack(row: IRow, sheet: Excel.Worksheet): void
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

function getTopRowYValue(rows: IRow[]): number
{
    let topRowNr = rows[0].cells[0].y
    for(let i = 0; i<  rows.length; i++)
    {
        if(rows[i].cells[0].y < topRowNr)
        {
            topRowNr = rows[i].cells[0].y
        }
    }
    return topRowNr
}

function getXValuesOfRowCellsInBody(rows: IRow[]) : number[]
{
    let row = rows[0]
    let cellXVals: number[] = []
    for(let i = 0; i < row.cells.length; i++)
    {
        cellXVals.push(row.cells[i].x)
    }
    return cellXVals
}

//Uses the job body and waypoint order to place the addresses in the fastest order
export function createInSequenceJobBody(jobBody: Readonly<IRow[]>, waypointOrder: number[], addressColumnIndex: number): IRow[]
    {
        console.log(jobBody)
        //TODO rework to use leftmost top cell as ankor and use length and width to assign coordinates
        let inSequenceBody: IRow[] = []
        for(let i = 0; i< waypointOrder.length; i++)
        {

            const seqRow = jobBody[waypointOrder[i]];

            inSequenceBody.push(seqRow)
        }

        //create copy of inSequenceBody
        //Then remove parent child relations to update coordinates of parents and children
        inSequenceBody = removeRowParentChildRelations(JSON.parse(JSON.stringify(inSequenceBody)) as IRow[])
        
        let topYVal = getTopRowYValue(inSequenceBody)
        let xCoords = getXValuesOfRowCellsInBody(inSequenceBody)

        for(let i = 0; i < inSequenceBody.length; i++)
        {
            let row = inSequenceBody[i]
            for(let j = 0; j < row.cells.length; j++)
            {
                row.cells[j].x = xCoords[j]
                row.cells[j].y = topYVal + i
            }
        }

        inSequenceBody = makeRowParentChildRelations(inSequenceBody, addressColumnIndex)

        console.log(topYVal)
        console.log(xCoords)
        return inSequenceBody
    }