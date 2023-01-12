import { Grid, Typography, FormControlLabel, Checkbox, Button } from "@mui/material";
import React from "react";
import { TLeg } from "trpc-server/trpc/models/Workspace";
import { IRow, EColumnDesignations,  IGeoStatusAndRes, ITripDirections, ICell } from "../Components/common/CommonInterfacesAndEnums";
import AddressCell from "../Components/Trip/TripTable/cells/AddressCell/AddressCell.component";
import ColumnDesignationSelector from "../Components/Trip/TripTable/cells/ColumnDesignationSelector.component";
import DataCell from "../Components/Trip/TripTable/cells/DataCell.component";
import HeadingCell from "../Components/Trip/TripTable/cells/HeadingCell.component";
import { useMapsStore } from "../Zustand/mapsStore";
import { ETableMode, useTripStore } from "../Zustand/tripStore";

const BlankColumnComponent: React.FC = () => <div style={{height: "100%", width: "100%"}}></div> //used for layout alignment

//this function checks if a number of rows are of equal length and if their columns align.
export function doRowsConform(rows: IRow[], referenceRow: IRow | null = null) : {status: boolean, reason: string}
{
  if(referenceRow === null && rows[0]) //reference row to test against, otherwise use the first row of the rows
  {
    referenceRow = rows[0]
    for(let i = 0; i < rows.length; i++)
    {
      const row = rows[i]
      if(row && row.cells.length === referenceRow.cells.length) //are lengths equal
      {
        for(let j = 0; j < row.cells.length; j++)
        {
          if(row.cells[j]?.x !== referenceRow.cells[j]?.x) //do all x coord of this row allign with the referece row's x coords
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
  }

  return {status: true, reason: ""}
  
}

export function reorder(list: IRow[], startIndex: number, endIndex: number )
{
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  if(removed)
  {
    result.splice(endIndex, 0, removed)
    return result
  }
  else
  {
    return result
  }

}

export function isAllAddressesInColumnValidAndAccepted(column: number)
{
  const Z_tripRows = useTripStore.getState().data.rows

  if(column < 0)
  {
    return false
  }

  for(let i = 0; i < Z_tripRows.length; i++)
  {
    const cell = Z_tripRows[i]?.cells[column]
    if(cell?.geocodedDataAndStatus?.status !== google.maps.GeocoderStatus.OK || cell.isAddressValidAndAccepted === false)
    {
      return false
    }
  }
  return true
}

export function createTripTableRow(row: Readonly<IRow>, nr: number, columnDesignations: Readonly<EColumnDesignations[]>, columnVisibility: boolean[]) : JSX.Element
{
  const Z_addressColumnIndex = useTripStore.getState().data.addressColumnIndex;
  const Z_toAddressColumnIndex = useTripStore.getState().data.goToAddressColumnIndex;
  const Z_tableMode = useTripStore.getState().data.tabelMode;
  const ZF_updateBodyCell = useTripStore.getState().reducers.updateBodyCell
  const ZF_setErrorMessage = useTripStore.getState().reducers.setErrorMessage


  function setVerified(cell: ICell)
  {
    if(cell.geocodedDataAndStatus?.status === google.maps.GeocoderStatus.OK)
    {
      ZF_updateBodyCell({...cell, isAddressValidAndAccepted: true})
      ZF_setErrorMessage("")
    }
    else
    {
      ZF_setErrorMessage("Error: the address has a problem, click on the cell to fix it")
    } 
  }

  const SequenceIndicatorComponent: React.FC<{sequenceNumber: number}> = ({sequenceNumber}) => <div draggable="true" style={{height: "100%", width: "100%", backgroundColor:"#1d85da", justifyContent:"center", alignItems: "center", display: "flex"}}><Typography sx={{color: "white", paddingLeft: "2px", paddingRight: "2px"}} variant="body1">{sequenceNumber + 1}</Typography></div>

  if(row.cells[0] && row.cells[0].y >= 0)
  {
    if(Z_tableMode === ETableMode.EditMode)
    {
      return(
        <>
          <SequenceIndicatorComponent sequenceNumber={nr}/>
          {row.cells.map((cell, index) => {
            if(columnVisibility[index])
            {
              if(columnDesignations[index] === EColumnDesignations.Address){
                return(
                  <AddressCell key={`cell=${index}`} cellRef={cell} glanceMode={false}/>
                )
              }
              else if(columnDesignations[index] === EColumnDesignations.GoTo){
                return(
                  <AddressCell key={`cell=${index}`} cellRef={cell} glanceMode={false}/>
                )
              }
              else{
                return(
                  <DataCell key={`cell=${index}`} cellRef={cell}/>
                )
              }
            }
            else
            {
              return <></> //return nothing if column is not visible
            }
          })}
        </>
      )
    }
    else if(Z_tableMode === ETableMode.AddressSolveMode)
    {
      const cell = row.cells[Z_addressColumnIndex]
      if(cell)
      {
        return(
          <>
            <SequenceIndicatorComponent sequenceNumber={nr}/>
            <AddressCell cellRef={cell} glanceMode={true}/>
            <Button onClick={() => {setVerified(cell)}} variant={"outlined"} sx={{height: "100%", p: 0.1}}>Confirm</Button>
          </>
        )
      }
      else
      {
        return <></>
      }

    }
    else //toAddressSolveMode
    {
      const cell = row.cells[Z_toAddressColumnIndex]
      if(cell)
      {
        return(
          <>
            <SequenceIndicatorComponent sequenceNumber={nr}/>
            <AddressCell cellRef={cell} glanceMode={true}/>
            <Button onClick={() => {setVerified(cell)}} variant={"outlined"} sx={{height: "100%", p: 0.1}}>Confirm</Button>
          </>  
        )
      }
      else
      {
        return <></>
      }

    }
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


export function createColumnVisibilityCheckboxes(columnNames: IRow, columnVisibility: boolean[])
{
  return (
    <Grid container sx={{paddingTop: "0.3em"}}>
      {columnNames.cells.map((elem, idx) => {
        return  (<Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                  <FormControlLabel  control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                    onChange={() => {
                      useTripStore.getState().reducers.updateColumnVisibility(idx)
                    }}/>} label={String.fromCharCode(elem.x - 1 + 'A'.charCodeAt(0))} />
                </Grid>)
      })}
    </Grid>
  )
}

export function createColumnDesignationSelectors(columnVisibility: boolean[]) : JSX.Element
{
    const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex;
    const Z_toAddressColumIndex = useTripStore.getState().data.goToAddressColumnIndex;
    const Z_tableMode = useTripStore.getState().data.tabelMode;

    if(Z_tableMode === ETableMode.EditMode)
    {
      return(
        <>
          <BlankColumnComponent/>
          {columnVisibility.map((visibility,index) => {
              if(visibility === true)
              {
                return <ColumnDesignationSelector columnIndex={index}/>
              }
              else
              {
                return <></>
              }
            })
          }
        </>
      )
    }
    else if(Z_tableMode === ETableMode.AddressSolveMode)
    {
      return(
        <>
          <BlankColumnComponent/>
          <ColumnDesignationSelector columnIndex={Z_addressColumIndex}/>
          <BlankColumnComponent/>
        </>
      )
    }
    else //toAddressSolveMode
    {
      return(
        <>
          <BlankColumnComponent/>
          <ColumnDesignationSelector columnIndex={Z_toAddressColumIndex}/>
          <BlankColumnComponent/>
        </>
      )
    }
}

export function CreateTableHeadingElements(jobHeadings: IRow, columnVisibility: boolean[])
{
  const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex;
  const Z_toAddressColumIndex = useTripStore.getState().data.goToAddressColumnIndex;
  const Z_tableMode = useTripStore.getState().data.tabelMode;

  if(Z_tableMode === ETableMode.EditMode)
  {
    return(
      <>
      <BlankColumnComponent/>
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
      </>
    )
  }
  else if(Z_tableMode === ETableMode.AddressSolveMode)
  {
    if(Z_addressColumIndex < 0)
    {
      return <></>
    }
    else
    {
      const cell = jobHeadings.cells[Z_addressColumIndex]
      if(cell)
      {
        return(
          <>
            <BlankColumnComponent/>
            <HeadingCell colNumber={cell.x}/>
            <div style={{height: "100%", width: "100%"}}></div>
          </>
        )
      }
      else
      {
        return <></>
      }

    }


  }
  else //toAddressSolve mode
  {
    if(Z_toAddressColumIndex < 0)
    {
      return <></>
    }
    else
    {
      const cell = jobHeadings.cells[Z_toAddressColumIndex]
      if(cell)
      {
        return(
          <>
            <BlankColumnComponent/>
            <HeadingCell colNumber={cell.x}/>
            <div style={{height: "100%", width: "100%"}}></div>
          </>
        )
      }
      else
      {
        return <></>
      }

    }


  }

}

export function removeRowParentChildRelations(rows: IRow[])
{
    console.log("reset parent- children")
    const noRelationRows: IRow[] = [];
    for(let i = 0; i < rows.length; i++)
    {
        const row = rows[i]
        if(row)
        {
          noRelationRows.push(row)
          const children = row.children
          
          for(let j = 0; j < children.length; j++)
          {
            const child = children[j]
            if(child)
            noRelationRows.push(child)
          }
          row.children = []
        }


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
      if(rows[i]?.cells[addressColumnIndex]?.displayData !== "")
      {
        const row = rows[i]
        if(row)
        {
          parentWithChildrenRows.push(row)
        }
        
      }
      else
      {
        if(parentWithChildrenRows.length > 0 && parentWithChildrenRows[parentWithChildrenRows.length - 1]?.cells[addressColumnIndex]?.displayData !== "")
        {
          const lastParent = parentWithChildrenRows[parentWithChildrenRows.length - 1]
          const row = rows[i]
          if(row)
          {
            lastParent?.children.push(row)
          } 
        }
        else
        {
          const row = rows[i]
          if(row)
          {
            parentWithChildrenRows.push(row)
          } 
          
        }
      }
    }
    return parentWithChildrenRows
}

function getTopRowYValue(rows: IRow[]): number | undefined
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

function getXValuesOfRowCellsInBody(rows: IRow[]) : number[]
{
    const row = rows[0]
    const cellXVals: number[] = []
    if(row?.cells)
    {
      for(let i = 0; i < row.cells.length; i++)
      {
        const cell = row.cells[i]
        if(cell?.x)
        {
          cellXVals.push(cell.x)
        }
      }
    }
    return cellXVals
}

export function preSyncRowDataForDeletion(row: IRow, sheet: Excel.Worksheet): void
{
    for(let j = 0; j < row.cells.length; j++)
    {
      const cell = row.cells[j]//TODO what to do on deletion when a cell has a formula
      if(cell)
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
            //range.format.autofitColumns();
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

export async function writeBackToSpreadsheet(rows: IRow[], addressColumnIndex: number)
{
  const writeBackRows = removeRowParentChildRelations(JSON.parse(JSON.stringify(rows)) as IRow[])
      
  const topYVal = getTopRowYValue(writeBackRows)
  const xCoords = getXValuesOfRowCellsInBody(writeBackRows)

  //assign new coords for write back
  for(let i = 0; i < writeBackRows.length; i++)
  {
    const row = writeBackRows[i]
    if(row)
    {
      for(let j = 0; j < row.cells.length; j++)
      {
        const cell = row.cells[j];
        const xCoord = xCoords[j]
        if(cell && xCoord && topYVal)
        {
          cell.x = xCoord
          cell.y = topYVal + i
        }
          
      }
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
      if(row?.cells[0] && row.cells[0].y === writeBackRows[j]?.cells[0]?.y)
      {
        shouldDelete = false;
        break;
      }
    }

    if(shouldDelete === true && row)
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
        const singleWriteBackRow = writeBackRows[i]
        if(singleWriteBackRow)
        {
          preSyncRowDataForWriteBack(singleWriteBackRow, sheet)
        }
        
      }
      for(let j = 0; j < rowsToDelete.length; j++)
      {
        const singleRowToDelete = rowsToDelete[j]
        if(singleRowToDelete)
        preSyncRowDataForDeletion(singleRowToDelete, sheet)
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

  const ZF_setRowOrderPerWaypoints = useTripStore.getState().reducers.setRowOrderPerWaypoints
  const ZF_setPreserveViewport = useMapsStore.getState().reducers.setPreserveViewport
  const ZF_setTripDirections = useTripStore.getState().reducers.setTripDirections

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
        const cell = Z_tripRows[i]?.cells[Z_addressColumIndex]
  
        if(cell?.geocodedDataAndStatus?.results && cell.geocodedDataAndStatus.results.length > 0 && cell.isAddressValidAndAccepted)
        {
          const cellGeoAddress = cell.geocodedDataAndStatus.results[cell.selectedGeocodedAddressIndex]
          waypoints.push({location: cellGeoAddress?.formatted_address, stopover: true})
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
        if(directionsResult.result?.routes[0]?.waypoint_order)
        {
          ZF_setRowOrderPerWaypoints(directionsResult.result?.routes[0].waypoint_order);
          ZF_setPreserveViewport(preserveViewport);
          ZF_setTripDirections(directionsResult);
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
      return {status: false, msg: "Error: No address column set"}
    }
  }
}

//TODO rework this function
export function createDriverTrip() : {errorMsg: string, legs: TLeg[]}
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

  const tripLegs: TLeg[] = [];
  for(let i = 0; i < Z_tripRows.length; i++)
  {
    const legDetails: {name: string, value: string}[] = []
    const row = Z_tripRows[i];
    if(row)
    {
      for(let j = 0; j < row.cells.length; j++)
      {
        if(j !== Z_addressColumIndex) //skip address
        {
          const cell = row.cells[j];
          if(cell)
          legDetails.push({name: "", value: cell.displayData})
        }
      }
  
      const addressCell = row.cells[Z_addressColumIndex]
      if(addressCell?.isAddressValidAndAccepted === false)
      {
        return {errorMsg: "Trip not valid, one or more addresses were not confirmed", legs: []}
      }

      const fullAddress = addressCell?.geocodedDataAndStatus!.results![addressCell.selectedGeocodedAddressIndex]?.formatted_address

      if(addressCell && fullAddress)
      tripLegs.push({givenAddress: addressCell.displayData, fullAddressStr: fullAddress, legDetails: legDetails, avoidTolls: false, legStatus: 0})
    }




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

//this function is used in the ColumnDesignationSelector component. It is called when the designation changes
export async function solveAddresses(columnIndex: number)
{
  const Z_tripRows = useTripStore.getState().data.rows
  const ZF_updateBodyCell = useTripStore.getState().reducers.updateBodyCell

  if(columnIndex >= 0)
  {
    for(let i = 0; i < Z_tripRows.length; i++)
    {
      const row = Z_tripRows[i];
      const addressCell = row?.cells[columnIndex]

      if(addressCell?.geocodedDataAndStatus === null) //if the cell has no geocoded address, find one
      {
        const geoRes = await geocodeAddress(addressCell.displayData)
        ZF_updateBodyCell({...addressCell, geocodedDataAndStatus: geoRes});
        // return;
      }
      // else if(addressCell?.geocodedDataAndStatus && addressCell.geocodedDataAndStatus.status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
      // {
      //   await setTimeout(() => {
      //     ZF_updateBodyCell({...addressCell, geocodedDataAndStatus: null});
      //   }, 2000)
      //   return;
      // }
    }
  }
}

//sets column designation. And if the designation is not data, solve the addresses in the columns
export function handleColumnDesignationAndSolveColumnAddresses(columnIndex: number, columnDesignation: EColumnDesignations)
{
  useTripStore.getState().reducers.updateColumnDesignation({columnIndex: columnIndex, designation: columnDesignation})
  //solve addresses in column if not edit mode
  if(useTripStore.getState().data.tabelMode !== ETableMode.EditMode)
  {
    solveAddresses(columnIndex)
  }
}
