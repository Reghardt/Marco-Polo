import React from "react";
import { EColumnDesignations } from "../common/enums";
import { IGeoStatusAndRes, IRow, ITripDirections } from "../common/interfaces";
import GridRow from "../components/DragAndDrop/GridRow";
import AddressCell from "../components/TripTable/cells/AddressCell/AddressCell.component";
import ColumnDecorator from "../components/TripTable/cells/ColumnDecorator.component";
import HeadingCell from "../components/TripTable/cells/HeadingCell.component";
import { useMapsStore } from "../zustand/mapsStore";
import { useTripStore } from "../zustand/tripStore";

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
    // console.log(rows, addressColumnIndex)
    const parentWithChildrenRows: IRow[] = [];

    if(addressColumnIndex < 0)
    {
      return rows
    }

    for(let i = 0; i < rows.length; i++)
    {
        if(rows[i].cells[addressColumnIndex].displayData !== "")
        {
        parentWithChildrenRows.push(rows[i])
        }
        else
        {
            if(parentWithChildrenRows.length > 0 && parentWithChildrenRows[parentWithChildrenRows.length - 1].cells[addressColumnIndex].displayData !== "")
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

export function generateGridTemplateColumns(columnVisibility: boolean[])
{
  let gridTemplateColumns = "min-content "
  columnVisibility.forEach(vis => {
    if(vis)
    {
      gridTemplateColumns += "auto "
    }
  })

  return gridTemplateColumns;
}

export function geocodeAddress(address: string) : Promise<IGeoStatusAndRes>
{
  console.log("geocode fired")
  const geoResPromise = new Promise<IGeoStatusAndRes>((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address, region: "ZA"},(res, status) => {
      resolve({status, results: res})
    })
  })
  return geoResPromise;
}

export async function calcRoute(shouldOptimize: boolean, preserveViewport: boolean)
{
  const Z_departureAddress = useTripStore.getState().data.departureAddress
  const Z_returnAddress = useTripStore.getState().data.returnAddress

  const Z_tripRows = useTripStore.getState().data.rows
  const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex

  if(Z_departureAddress === null || Z_returnAddress === null) //test if not "none"
  {
    return {status: false, msg: "Error: Check if Departure and/or Return addresses are set"}
  }
  else{
    const waypoints: google.maps.DirectionsWaypoint[]  = [];

    if(Z_addressColumIndex > -1)
    {
      for(let i = 0; i < Z_tripRows.length; i++)
      {
        const cell = Z_tripRows[i].cells[Z_addressColumIndex]

        if(cell){}
  
        // if(cell.selectedGeocodedAddressIndex > -1 && cell.geocodedResults.length > 0)
        // {
        //   const cellGeoAddress = cell.geocodedResults[cell.selectedGeocodedAddressIndex]
        //   waypoints.push({location: cellGeoAddress.formatted_address, stopover: true})
        // }
        // else{
        //   return {status: false, msg: "Error: Check if all addresses are solved"}
        // }
      }

      //TODO check if there are enought tokens available
      //makeRouteOnDB(5)
      const directionsResult = await createDirections(Z_departureAddress.formatted_address, Z_returnAddress.formatted_address, waypoints, shouldOptimize)

      if(directionsResult.status === google.maps.DirectionsStatus.OK)
      {
        if(directionsResult.result?.routes[0].waypoint_order)
        {
          useTripStore.getState().reducers.setRowOrderPerWaypoints(directionsResult.result?.routes[0].waypoint_order);
          useMapsStore.getState().reducers.setPreserveViewport(preserveViewport);
          useTripStore.getState().reducers.setTripDirections(directionsResult);
          console.log(directionsResult)

          return {status: true, msg: ""}
        }
        else{
          return {status: false, msg: "Error: Something went wrong with finding a route"}
        }
      }
      else{
        return {status: false, msg: "Error: Something went wrong with finding a route"}
      }
    }
    else{
      return {status: false, msg: "Error: Something went wrong with finding a route"}
    }
  }

  
}

export function createDirections(departureAddress: string, returnAddress: string, waypoints: google.maps.DirectionsWaypoint[], shouldOptimize: boolean) {

  const request: google.maps.DirectionsRequest = {
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

export async function writeBackToSpreadsheet(rows: IRow[], addressColumnIndex: number)
{
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

function preSyncRowDataForWriteBack(row: IRow, sheet: Excel.Worksheet): void
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
            range.values = [[cell.displayData]]
        }
    }

    for(let i = 0; i < row.children.length; i++)
    {
        preSyncRowDataForWriteBack(row.children[i], sheet)
    }
}

export function createColumnVisibilityOptions(columnNames: IRow, columnVisibility: boolean[])
{
  const visibilityElements = 
    <div>
      {/* {columnNames.cells.map((elem, idx) => {
        return  <div>
                  <FormControlLabel control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                    onChange={() => {
                      useTripStore.getState().reducers.updateColumnVisibility(idx)
                    }}/>} label={String.fromCharCode(elem.x - 1 + 'A'.charCodeAt(0))} />
                </div>
      })} */}
    </div>
    


  return visibilityElements
}



export function createColumnDecorators(columnVisibility: boolean[]) : JSX.Element
{
    const decorators =
    <React.Fragment>
        <div>
            <div></div>
        </div>
        {columnVisibility.map((visibility,index) => {
            if(visibility === true)
            {
                return(
                <div key={index}>
                    <ColumnDecorator colIdx={index}/>
                </div>)
            }
            else
            {
                return <></>
            }
        })}
    </React.Fragment>
    return decorators
}

export function CreateTableHeadingElements(jobHeadings: IRow, columnVisibility: boolean[])
    {
      const headings =
      <React.Fragment>
        <div></div> {/* Empty div to act as left spacer*/}
        {jobHeadings.cells.map((cell, index) => {
            if(columnVisibility[index] === true)
            {
                return(
                    <div key={index}>
                        <HeadingCell colNumber={cell.x}/>
                    </div>
                )
            }
            else
            {
                return(<></>)
            }
        })}
      </React.Fragment>
      return headings
    }

export function createTripTableRow(row: Readonly<IRow>, nr: number, columnDesignations: Readonly<EColumnDesignations[]>, columnVisibility: boolean[]) : JSX.Element
{
  const rowElement = <GridRow draggableId={row.cells[0].y} key={`row-${row.cells[0].y}`}>
    <div key={`row-child-nr}`} draggable="true" className='grid-item'>{nr + 1}</div>
    {row.cells.map((cell, idx) => {
      if(columnDesignations[idx] === EColumnDesignations.Address)
      {
        // return <button key={`row-child-${idx}`} draggable="false" className='grid-item'>{cell.displayData}</button>
        
        return <AddressCell cellRef={cell} glanceMode={false}/>
      }
      else
      {
        return <div key={`row-child-${idx}`} draggable="true" className='grid-item'>{cell.displayData}</div>
      }
      
    })}
  </GridRow>
  return rowElement
}