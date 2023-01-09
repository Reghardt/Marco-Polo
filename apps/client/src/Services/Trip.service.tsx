import { Grid, Typography, FormControlLabel, Checkbox } from "@mui/material";
import React from "react";
import { ILeg } from "trpc-server/trpc/models/Workspace";
import { IRow, EColumnDesignations,  IGeoStatusAndRes, ITripDirections } from "../Components/common/CommonInterfacesAndEnums";
import GridRow from "../Components/DragAndDrop/GridRow";
import AddressCell from "../Components/Trip/TripTable/cells/AddressCell/AddressCell.component";
import ColumnDecorator from "../Components/Trip/TripTable/cells/ColumnDecorator.component";
import DataCell from "../Components/Trip/TripTable/cells/DataCell.component";
import HeadingCell from "../Components/Trip/TripTable/cells/HeadingCell.component";
import { useMapsStore } from "../Zustand/mapsStore";
import { useTripStore } from "../Zustand/tripStore";

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

export function reorder(list: IRow[], startIndex: number, endIndex: number )
{

  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function createTripTableRow(row: Readonly<IRow>, nr: number, columnDesignations: Readonly<EColumnDesignations[]>, columnVisibility: boolean[]) : JSX.Element
{
  // const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex;
  // const elementSize = (12 - labelSize) / numberOfVisibleColumns(columnVisibility);
  // const ZF_updateBodyCell = useTripStore.getState().reducers.updateBodyCell

  
  // function setVerified(cell: ICell)
  // {
  //   ZF_updateBodyCell({...cell, isGeoResAccepted: true})
  // }

  // function addressCellGlanceMode(): JSX.Element
  // {
  //   const cell = row.cells[Z_addressColumIndex]
  //   const isDisabled = cell.geoStatusAndRes?.status === google.maps.GeocoderStatus.OK ? false : true;
  //   return(
      
  //     <Grid key={`cell-${cell.x}-${cell.y}`} item xs={12 - labelSize}>
  //         <Stack direction={"row"}>
  //           <Box sx={{width: "100%"}}>
  //             <AddressCell cellRef={cell} glanceMode={true}/>
  //           </Box>
  //           <Box sx={{marginLeft: "0.1em"}}>
  //             <Button disabled={isDisabled} onClick={() => {setVerified(cell)}} variant={"outlined"} sx={{height: "100%", p: 0.1}}>Confirm</Button>
  //           </Box>
  //         </Stack>
          
  //     </Grid>

  //   )
  // }

  if(row.cells[0].y >= 0)
  {
    const rowWithChildren = 

    <GridRow key={row.cells[0].y} draggableId={row.cells[0].y}>

      <div draggable="true" style={{height: "100%", width: "100%", backgroundColor:"#1d85da", justifyContent:"center", alignItems: "center", display: "flex"}}><Typography sx={{color: "white", paddingLeft: "2px", paddingRight: "2px"}} variant="body1">{nr + 1}</Typography></div>
      
      {row.cells.map((cell, index) => {
        if(columnVisibility[index])
        {
          if(columnDesignations[index] === EColumnDesignations.Address){
            return(
              <AddressCell cellRef={cell} glanceMode={false}/>
            )
          }
          else{
            return(
              <DataCell cellRef={cell}/>
            )
          }
        }
        else
        {
          return <></> //return nothing if column is not visible
        }


      })}

      {/* {
        Z_addressColumIndex > -1 && row.cells[Z_addressColumIndex].isGeoResAccepted === false 
        ? 
        addressCellGlanceMode()
        :
        row.cells.map((cell, index) => {
          if(columnVisibility[index] === true){
              if(columnDesignations[index] === EColumnDesignations.Address){
                return(
                  <Grid key={`cell-${cell.x}-${cell.y}`} item xs={elementSize}>
                      <AddressCell cellRef={cell} glanceMode={false}/>
                  </Grid>
                )
              }
              else{
                return(
                  <Grid key={`cell-${cell.x}-${cell.y}`} item xs={elementSize}>
                      <DataCell cellRef={cell}
                      />
                  </Grid>
                )
              }
          }
          else{
              return <></>
          }
        })
      } */}

      {/* {row.children.map((row) => {
          return createChildRow(row, columnVisibility)
      })} */}
    </GridRow>

    return rowWithChildren;
  }
  else
  {
    return <></>
  }


  
}

// function createChildRow(row: Readonly<IRow>, columnVisibility: boolean[])
// {
//     const elementSize = (12 - labelSize) / numberOfVisibleColumns(columnVisibility);

//     const childRow =
//     <React.Fragment>
//         <Grid item xs={labelSize}>
//             <Box sx={{height: "100%", width: "100%"}}></Box>
//         </Grid>

//         {row.cells.map((cell, index) => {
//             if(columnVisibility[index] === true)
//             {
//                 return(
//                     <Grid key={`cell-${cell.x}-${cell.y}`} item xs={elementSize}>
//                         <DataCell
//                             cellRef={cell}
//                         />
//                     </Grid>
//                 )
//             }
//             else
//             {
//                 return <></>
//             }
//         })}
//     </React.Fragment>

//     return childRow
// }

export function geocodeAddress(address: string) : Promise<IGeoStatusAndRes>
{
  const geoResPromise = new Promise<IGeoStatusAndRes>((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address, region: "ZA"},(res, status) => {
      resolve({status, results: res})
    })
  })

  return geoResPromise;
}


export function createColumnVisibilityOptions(columnNames: IRow, columnVisibility: boolean[])
{
  const visibilityElements = 
    <Grid container sx={{paddingTop: "0.3em"}}>
      {columnNames.cells.map((elem, idx) => {
        return  <Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                  <FormControlLabel  control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                    onChange={() => {
                      useTripStore.getState().reducers.updateColumnVisibility(idx)
                    }}/>} label={String.fromCharCode(elem.x - 1 + 'A'.charCodeAt(0))} />
                </Grid>
      })}
    </Grid>
    


  return visibilityElements
}

export function createColumnDecorators(columnVisibility: boolean[]) : JSX.Element
{

    const decorators =
    <React.Fragment>
      <div style={{height: "100%", width: "100%"}}></div>
      {columnVisibility.map((visibility,index) => {
        if(visibility === true)
        {
            return <ColumnDecorator colIdx={index}/>
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
        <div style={{height: "100%", width: "100%"}}></div>
        {jobHeadings.cells.map((cell, index) => {
          if(columnVisibility[index] === true)
          {
              return(
                <HeadingCell colNumber={cell.x}/>
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
  
        if(cell.geocodedDataAndStatus?.results && cell.geocodedDataAndStatus.results.length > 0 && cell.isGeoResAccepted)
        {
          const cellGeoAddress = cell.geocodedDataAndStatus.results[cell.selectedGeocodedAddressIndex]
          waypoints.push({location: cellGeoAddress.formatted_address, stopover: true})
        }
        else{
          return {status: false, msg: "Error: Check if all addresses are confirmed"}
        }
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

export function createDriverTrip() : {errorMsg: string, legs: ILeg[]}
{
  const Z_tripRows = useTripStore.getState().data.rows
  const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex
  const Z_tripDirections = useTripStore.getState().data.tripDirections
  const Z_returnAddress = useTripStore.getState().data.returnAddress

  if(Z_addressColumIndex === -1)
  {
    return {errorMsg: "Trip not valid, no address column set", legs: []}
  }

  if(Z_tripDirections === null)
  {
    return {errorMsg: "No route has been calculated yet", legs: []}
  }

  const tripLegs: ILeg[] = [];
  for(let i = 0; i < Z_tripRows.length; i++)
  {
    const legDetails: {name: string, value: string}[] = []
    const row = Z_tripRows[i];
    for(let j = 0; j < row.cells.length; j++)
    {
      if(j !== Z_addressColumIndex) //skip address
      {
        const cell = row.cells[j];
        legDetails.push({name: "", value: cell.displayData})
      }
    }

    const addressCell = row.cells[Z_addressColumIndex]
    if(addressCell.isGeoResAccepted === false)
    {
      return {errorMsg: "Trip not valid, one or more addresses were not confirmed", legs: []}
    }


    const fullAddress = addressCell.geocodedDataAndStatus!.results![addressCell.selectedGeocodedAddressIndex].formatted_address
    tripLegs.push({givenAddress: addressCell.displayData, fullAddressStr: fullAddress, legDetails: legDetails, avoidTolls: false, legStatus: 0})
  }

  if(Z_returnAddress)
  {
    tripLegs.push({givenAddress: "Return", fullAddressStr: Z_returnAddress.formatted_address, legDetails: [], avoidTolls: false, legStatus: 0})
  }
  else
  {
    return {errorMsg: "Trip not valid, no return address set", legs: []}
  }

  console.log(tripLegs)
  return {errorMsg: "", legs: tripLegs}

}
