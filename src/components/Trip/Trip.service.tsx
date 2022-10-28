import { IGeocoderResult, ITripDirections } from "../../interfaces/simpleInterfaces";
import { IRow } from "../../services/worksheet/row.interface";

export function removeRowParentChildRelations(rows: IRow[])
{
    console.log("reset parent- children")
    const noRelationRows: IRow[] = [];
    for(let i = 0; i < rows.length; i++)
    {
        noRelationRows.push(rows[i])
        const children = rows[i].children
        
        for(let j = 0; j < children.length; j++)
        {
        noRelationRows.push(children[j])
        }
        rows[i].children = []
    }
    return noRelationRows
}

export function makeRowParentChildRelations(rows: IRow[], addressColumnIndex: number): IRow[]
{
    console.log("make parent- children")
    console.log(rows, addressColumnIndex)
    const parentWithChildrenRows: IRow[] = [];

    if(addressColumnIndex < 0)
    {
      return rows
    }

    for(let i = 0; i < rows.length; i++)
    {
        if(rows[i].cells[addressColumnIndex].data !== "")
        {
        parentWithChildrenRows.push(rows[i])
        }
        else
        {
            if(parentWithChildrenRows.length > 0 && parentWithChildrenRows[parentWithChildrenRows.length - 1].cells[addressColumnIndex].data !== "")
            {
                const lastParent = parentWithChildrenRows[parentWithChildrenRows.length - 1]
                lastParent.children.push(rows[i])
            }
            else
            {
                parentWithChildrenRows.push(rows[i])
            }
        }
    }
    return parentWithChildrenRows
}

export function geocodeAddress(address: string) : Promise<IGeocoderResult>
    {
      const geoResPromise = new Promise<IGeocoderResult>((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address, region: "ZA"},(res, status) => {
          resolve({status, results: res})
        })
      })

      return geoResPromise;
    }

//this function orders the rows according to thw waypoint orders. X and Y sheet coordinates remain the same.
export function createInSequenceJobRows(rows: Readonly<IRow[]>, waypointOrder: number[]): IRow[]
    {
        const inSequenceBody: IRow[] = []
        for(let i = 0; i< waypointOrder.length; i++)
        {
            const seqRow = rows[waypointOrder[i]];
            inSequenceBody.push(seqRow)
        }
        return inSequenceBody
    }

export function createDirections(departureAddress: string, returnAddress: string, waypoints: google.maps.DirectionsWaypoint[], shouldOptimize: boolean) {

  var request: google.maps.DirectionsRequest = {
    origin: departureAddress,
    destination: returnAddress,
    waypoints: waypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: shouldOptimize,
  };

  return new Promise<ITripDirections>((resolve) => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(request, (result, status) => {
        resolve({result, status})
    });
  })  
}

//this function checks if a number of rows are of equal length and if their columns align.
export function doRowsConform(rows: IRow[], referenceRow: IRow | null = null) : {status: boolean, reason: string}
{
  //
  if(referenceRow === null) //reference row to test against, otherwise use the first row of the rows
  {
    referenceRow = rows[0]
  }
  
  for(let i = 0; i < rows.length; i++)
  {
    const row = rows[i]
    if(row.cells.length === referenceRow.cells.length) //are lengths equal
    {
      for(let j = 0; j < row.cells.length; j++)
      {
        if(row.cells[j].x !== referenceRow.cells[j].x) //do all x coord of this row allign with the referece row's x coords
        {
          return {status: false, reason: "Columns don't align"}
        }
      }
    }
    else
    {
      return {status: false, reason: "Rows not of equal length"}
    }
  }
  return {status: true, reason: ""}
}

export function addAndUpdateRows(rows: IRow[], rowsToAdd: IRow[], addressColumnIndex: number)
{
  
    // let newRows = Array.from(rows)
    let newRows = removeRowParentChildRelations(JSON.parse(JSON.stringify(rows)) as IRow[])
    
    const rowsToAddAccumilator: IRow[] = []
    for(let i = 0; i < rowsToAdd.length; i++)
    {
      const addRow = rowsToAdd[i]
      let matchFound = false
      for(let j = 0; j < newRows.length; j++)
      {
        if(newRows[j].cells[0].y === addRow.cells[0].y)
        {
          console.log("match found")
          //update row here
          matchFound = true
          break;
        }
      }

      if(matchFound === false)
      {
        rowsToAddAccumilator.push(addRow)
      }
    }

    newRows = [...newRows, ...rowsToAddAccumilator]
    console.log(newRows)
    
    return makeRowParentChildRelations(newRows, addressColumnIndex)
}

export function preSyncRowDataForWriteBack(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
        const cell = row.cells[j]
        if(cell.formula !== "") //if cell is formula
        {
            //write formula
            const range = sheet.getCell(cell.y - 1, cell.x - 1)
            range.formulas = [[cell.formula]]
            //range.format.autofitColumns();
        }
        else //cell only has data
        {
            //write data
            const range = sheet.getCell(cell.y - 1, cell.x - 1)
            range.values = [[cell.data]]
        }
    }

    for(let i = 0; i < row.children.length; i++)
    {
        preSyncRowDataForWriteBack(row.children[i], sheet)
    }
}

export function preSyncRowDataForDeletion(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
        const cell = row.cells[j]//TODO what to do on deletion when a cell has a formula
        const range = sheet.getCell(cell.y - 1, cell.x - 1)
        range.values = [[""]]
    }

    for(let i = 0; i < row.children.length; i++)
    {
        preSyncRowDataForDeletion(row.children[i], sheet)
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
    const row = rows[0]
    const cellXVals: number[] = []
    for(let i = 0; i < row.cells.length; i++)
    {
        cellXVals.push(row.cells[i].x)
    }
    return cellXVals
}

export async function writeBackToSpreadsheet(rows: IRow[], addressColumnIndex: number)
  {
    if(addressColumnIndex){}
    const writeBackRows = removeRowParentChildRelations(JSON.parse(JSON.stringify(rows)) as IRow[])
        
    const topYVal = getTopRowYValue(writeBackRows)
    const xCoords = getXValuesOfRowCellsInBody(writeBackRows)

    //assign new coords for write back
    for(let i = 0; i < writeBackRows.length; i++)
    {
        const row = writeBackRows[i]
        for(let j = 0; j < row.cells.length; j++)
        {
            row.cells[j].x = xCoords[j]
            row.cells[j].y = topYVal + i
        }
    }

    //writeBackRows = makeRowParentChildRelations(writeBackRows, addressColumnIndex)
    const childlessRows = removeRowParentChildRelations(JSON.parse(JSON.stringify(rows)) as IRow[])

    const rowsToDelete: IRow[] = [] 
    for(let i = 0; i < childlessRows.length; i++)
    {
      const row = childlessRows[i];
      let shouldDelete = true;
      for(let j = 0; j < writeBackRows.length; j++)
      {
        if(row.cells[0].y === writeBackRows[j].cells[0].y)
        {
          shouldDelete = false;
          break;
        }
      }

      if(shouldDelete === true)
      {
        rowsToDelete.push(row)
      }
    }

    console.log(rowsToDelete)

    return await new Promise<IRow[]>((accept) => {
      Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet()
        for(let i = 0; i < writeBackRows.length; i++)
        {
          preSyncRowDataForWriteBack(writeBackRows[i], sheet)
        }
        for(let j = 0; j < rowsToDelete.length; j++)
        {
          preSyncRowDataForDeletion(rowsToDelete[j], sheet)
        }
        await context.sync()
        
        accept(makeRowParentChildRelations(writeBackRows, addressColumnIndex))
      })

    }).then((res) => { return res})

    
  }