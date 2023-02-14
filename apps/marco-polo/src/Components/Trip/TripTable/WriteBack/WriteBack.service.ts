import { makeRowParentChildRelations, removeRowParentChildRelations } from "../../../../Services/Trip.service"
import { IRow } from "../../../common/CommonInterfacesAndEnums"

export function getTopMostYCoordinate(rows: IRow[]): number | undefined
{
    let topRowNr = rows[0]?.cells[0]?.y
    for(let i = 0; i<  rows.length; i++)
    {
      const y = rows[i]?.cells[0]?.y
      if(y && topRowNr && y < topRowNr)
      {
          topRowNr = y
      }
    }
    return topRowNr
}


function preSyncRowDataForWriteBack(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
        const cell = row.cells[j]
        if(cell && cell.formula !== "") //if cell is formula
        {
          //write formula
          const range = sheet.getCell(cell.y - 1, cell.x - 1)
          range.formulas = [[cell.formula]]
        }
        else //cell only has data
        {
          //write data
          if(cell)
          {
            const range = sheet.getCell(cell.y - 1, cell.x - 1)
            range.values = [[cell.displayData]]
          }
        }
    }

    for(let i = 0; i < row.children.length; i++)
    {
      const child = row.children[i]
      if(child)
      {
        preSyncRowDataForWriteBack(child, sheet)
      }
    }
}

export function preSyncRowDataForDeletion(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
      const cell = row.cells[j]//TODO what to do on deletion when a cell has a formula
      if(cell && cell.y - 1 > 0 && cell.x - 1 > 0)
      {
        const range = sheet.getCell(cell.y - 1, cell.x - 1)
        range.values = [[""]]
      }
    }

    for(let i = 0; i < row.children.length; i++)
    {
      const child = row.children[i]
      if(child)
      {
        preSyncRowDataForDeletion(child, sheet)
      }
      
    }
}

export async function writeBackToSpreadsheet(rows: IRow[], addressColumnIndex: number, topmostY: number, xOffset: number = 0)
{
    const writeBackRows = removeRowParentChildRelations(JSON.parse(JSON.stringify(rows)) as IRow[])
    //const xCoords = getXValuesOfRowCellsInBody(writeBackRows)

    

    return await new Promise<IRow[]>((accept) => {
        Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet()

        //delete all rows
        for(let i = 0; i < writeBackRows.length; i++)
        {
            const row = writeBackRows[i]
            if(row)
            {
                preSyncRowDataForDeletion(row, sheet)
            }
        }

        //add rows with new coordinates
        for(let i = 0; i < writeBackRows.length; i++)
        {
            const row = writeBackRows[i]
            if(row)
            {
            for(let j = 0; j < row.cells.length; j++) //assign new x and y coord to each cell of the row
            {
                const cell = row.cells[j];
                //const xCoord = xCoords[j]
                if(cell)
                {
                    console.log(cell)
                    if(cell.x < 0)
                    {
                        cell.x = j
                    }
                    cell.x += xOffset
                    cell.y = topmostY + i
                }
            }
            preSyncRowDataForWriteBack(row, sheet)
            }
        }
        await context.sync()
        accept(makeRowParentChildRelations(writeBackRows, addressColumnIndex))
        })

    }).then((res) => { return res})
}