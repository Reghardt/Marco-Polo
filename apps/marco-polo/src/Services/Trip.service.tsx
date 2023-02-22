import { Typography, FormControlLabel, Checkbox, Button } from "@mui/material";
import { TLeg } from "dbmodels";
import React from "react";

import { IRow, EColumnDesignations, ITripDirections, ICell, IAddress, EAddressSolveStatus } from "../Components/common/CommonInterfacesAndEnums";
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
  const rowLength = rows[0]?.cells.length
  if(rowLength !== undefined)
  {
    for(let i = 0; i < rows.length; i++)
    {
      const row = rows[0]
      if(row && row.cells.length === rowLength)
      {
        continue
      }
      else
      {
        return {status: false, reason: "Rows not of equal length"}
      }
    }

    if(referenceRow)
    {
      if(referenceRow.cells.length !== rowLength)
      {
        return {status: false, reason: `Selection should be ${referenceRow.cells.length} row${referenceRow.cells.length > 1 ? "s" : ""} wide`}
      }
    }

    return {status: true, reason: ""}
  }
  else
  {
    return {status: false, reason: "No selection"}
  }

  // if(referenceRow === null && rows[0]) //reference row to test against, otherwise use the first row of the rows
  // {
  //   referenceRow = rows[0]
  //   for(let i = 0; i < rows.length; i++)
  //   {
  //     const row = rows[i]
  //     if(row && row.cells.length === referenceRow.cells.length) //are lengths equal
  //     {
  //       for(let j = 0; j < row.cells.length; j++)
  //       {
  //         if(row.cells[j]?.x !== referenceRow.cells[j]?.x) //do all x coord of this row allign with the referece row's x coords
  //         {
  //           return {status: false, reason: "Columns don't align"}
  //         }
  //       }
  //     }
  //     else
  //     {
  //       return {status: false, reason: "Rows not of equal length"}
  //     }
  //   }
  // }

  // return {status: true, reason: ""}
  
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

export function areAllAddressesInColumnValidAndAccepted(column: number, tripRows: IRow[], tableMode: ETableMode)
{
  if(column < 0)
  {
    return false
  }

  for(let i = 0; i < tripRows.length; i++)
  {
    const cell = tripRows[i]?.cells[column]

    if(tableMode === ETableMode.LinkAddressSolveMode && cell?.displayData === "") //if in linkAddressSolveMode and cell data is empty, skip it.
    {
      continue;
    }
    else if(cell?.address.latLng === null || cell?.address.isAddressAccepted === false)
    {
      return false
    }
  }
  return true
}

export function createTripTableRow(row: Readonly<IRow>, nr: number, columnDesignations: Readonly<EColumnDesignations[]>, columnVisibility: boolean[]) : JSX.Element
{
  const Z_addressColumnIndex = useTripStore.getState().data.addressColumnIndex;
  const Z_toAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex;
  const Z_tableMode = useTripStore.getState().data.tabelMode;
  const ZF_updateBodyCell = useTripStore.getState().actions.updateBodyCell
  const ZF_setErrorMessage = useTripStore.getState().actions.setErrorMessage


  function setAccepted(cell: ICell)
  {
    if(cell.address.latLng)
    {
      ZF_updateBodyCell({...cell, address: {...cell.address, isAddressAccepted: true}})
      ZF_setErrorMessage("")
    }
    else
    {
      ZF_setErrorMessage("Error: the address has a problem, click on the cell to fix it")
    } 
  }

  const SequenceIndicatorComponent: React.FC<{sequenceNumber: number}> = ({sequenceNumber}) => <div draggable="true" style={{height: "100%", width: "100%", backgroundColor:"#1d85da", justifyContent:"center", alignItems: "center", display: "flex"}}><Typography sx={{color: "white", paddingLeft: "2px", paddingRight: "2px"}} variant="body1">{sequenceNumber + 1}</Typography></div>

  if(row.cells[0]) // && row.cells[0].y >= 0
  {
    if(Z_tableMode === ETableMode.EditMode)
    {
      return(
        <>
          <SequenceIndicatorComponent sequenceNumber={nr}/>
          {row.cells.map((cell, index) => { // loop through cells
            if(columnVisibility[index])
            {
              if(columnDesignations[index] === EColumnDesignations.Address){
                return(
                  <AddressCell key={`cell=${index}`} cellRef={cell} glanceMode={false}/>
                )
              }
              else if(columnDesignations[index] === EColumnDesignations.LinkAddress){
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
          {row.children.map((childRow, childRowIndex) => {
            return createChildRow(childRowIndex, childRow, columnVisibility)
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
            <Button onClick={() => {setAccepted(cell)}} variant={"outlined"} sx={{height: "100%", p: 0.1}}>Confirm</Button>
          </>
        )
      }
      else
      {
        return <></>
      }

    }
    else //goToAddressSolveMode
    {
      const cell = row.cells[Z_toAddressColumnIndex]
      if(cell)
      {
        return(
          <>
            <SequenceIndicatorComponent sequenceNumber={nr}/>
            <AddressCell cellRef={cell} glanceMode={cell.displayData === "" ? false : true}/>
            <Button disabled={cell.displayData === "" ? true : false} onClick={() => {setAccepted(cell)}} variant={"outlined"} sx={{height: "100%", p: 0.1}}>Confirm</Button>
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

function createChildRow(childRowIndex: number, row: Readonly<IRow>, columnVisibility: boolean[])
{
  return(
    <>
      <BlankColumnComponent/>
      {row.cells.map((cell, index) => { // loop through cells
          if(columnVisibility[index])
          {
            return(
              <DataCell key={`childCell-${childRowIndex}-${index}`} cellRef={cell}/>
            )
          }
          else
          {
            return <></> //return nothing if column is not visible
          }
        })
      }
    </>
  )

}

// export function geocodeAddress(address: string) : Promise<IGeoStatusAndRes>
// {
//   const geoResPromise = new Promise<IGeoStatusAndRes>((resolve) => {
//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({address: address, region: "ZA"},(res, status) => {
//       resolve({status, results: res})
//     })
//   })

//   return geoResPromise;
// }


export function createColumnVisibilityCheckboxes(columnNames: IRow, columnVisibility: boolean[])
{
  return (
    <div className="flex flex-wrap">
      {columnNames.cells.map((elem, idx) => {
        return  (<div key={`vis-checkbox-${idx}`}>
                  <FormControlLabel  control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                    onChange={() => {
                      useTripStore.getState().actions.updateColumnVisibility(idx)
                    }}/>} label={String.fromCharCode(elem.x - 1 + 'A'.charCodeAt(0))} />
                </div>)
      })}
    </div>
  )
}

export function createColumnDesignationSelectors(columnVisibility: boolean[]) : JSX.Element
{
    const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex;
    const Z_toAddressColumIndex = useTripStore.getState().data.linkAddressColumnIndex;
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

export function numberToAlphabetical(num: number)
{
  return String.fromCharCode(num - 1 + 'A'.charCodeAt(0))
}

export function CreateTableHeadingElements(jobHeadings: IRow, columnVisibility: boolean[])
{
  const Z_addressColumIndex = useTripStore.getState().data.addressColumnIndex;
  const Z_toAddressColumIndex = useTripStore.getState().data.linkAddressColumnIndex;
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











export function createSimplePointToPointDirections(departureAddress: IAddress, returnAddress: IAddress, waypoints: google.maps.DirectionsWaypoint[], shouldOptimize: boolean) {


  var request: google.maps.DirectionsRequest = {
    origin: {placeId: departureAddress.placeId},
    destination: {placeId: returnAddress.placeId},
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

//TODO modify function to use dijikstras algorithm to calulate shortest path for when link addresses are present
export function createLinkedAddressesDirections(departureAddress: IAddress, returnAddress: IAddress, waypoints: google.maps.DirectionsWaypoint[]) {

  var request: google.maps.DirectionsRequest = {
    origin: {placeId: departureAddress.placeId},
    destination: {placeId: returnAddress.placeId},
    waypoints: waypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: false,
  };

  return new Promise<ITripDirections>((resolve) => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(request, (result, status) => {
        resolve({result, status})
    });
  })  
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
      if(addressCell?.address.isAddressAccepted === false)
      {
        return {errorMsg: "Trip not valid, one or more addresses were not confirmed", legs: []}
      }



      if(addressCell?.address.formatted_address)
      {
        tripLegs.push({givenAddress: addressCell.displayData, fullAddressStr: addressCell.address.formatted_address, legDetails: legDetails, avoidTolls: false, legStatus: 0})
      } 
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

export async function getFirstPlacePrediction(addressToPredict: string)
{

  return new Promise<IAddress>(async (acceptPredictionWithDetails) => {
    const autoCompleteService = new google.maps.places.AutocompleteService()

    if(!addressToPredict)
    {
      acceptPredictionWithDetails({formatted_address: "", latLng: null, solveStatus: EAddressSolveStatus.INVALID_REQUEST, isAddressAccepted: false, placeId: ""})
      return
    }

    const autoCompleteRequest: google.maps.places.AutocompletionRequest = {
        input: addressToPredict,
        sessionToken: new google.maps.places.AutocompleteSessionToken(),
        bounds: {north: -21.7, south: -35.3, east: 33.05, west: 15.91},
        componentRestrictions: {country: "ZA"},
    }


    //Predict list of places
    const placePredictions = await new Promise<{response: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus} >((acceptAutocompletePredictions) => {
      autoCompleteService.getPlacePredictions(autoCompleteRequest, (response, status) => {
        acceptAutocompletePredictions({response, status})
      })
    })
    ///////////////////////

    // Take first prediction and get details
    if(placePredictions.status === google.maps.places.PlacesServiceStatus.OK && placePredictions.response && placePredictions.response[0]?.place_id)
    {
      const placeDetails = await new Promise<{response: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus}>((acceptPlaceDetails) => {
        const placeService = new google.maps.places.PlacesService(useMapsStore.getState().data.map!);
        placeService.getDetails({placeId: placePredictions!.response![0]!.place_id, fields: ["formatted_address", "geometry", "place_id"]}, (response, status) => {
          acceptPlaceDetails({response, status})
        })
      })

      if(placeDetails.status === google.maps.places.PlacesServiceStatus.OK && placeDetails.response?.formatted_address && placeDetails.response.geometry?.location && placeDetails.response.place_id)
      {
        acceptPredictionWithDetails({formatted_address: placeDetails.response.formatted_address, latLng: placeDetails.response.geometry.location, solveStatus: google.maps.places.PlacesServiceStatus[placeDetails.status].toString() as EAddressSolveStatus, isAddressAccepted: false, placeId: placeDetails.response.place_id})
        return
      }
    }

    acceptPredictionWithDetails({formatted_address: "", latLng: null, solveStatus: EAddressSolveStatus.UNKNOWN_ERROR, isAddressAccepted: false, placeId: ""})
    /////////////////////////////////////////
  })

}

//this function is used in the ColumnDesignationSelector component. It is called when the designation changes
export async function solveAddresses(columnIndex: number)
{
  console.log("solve address fired")

  const Z_tripRows = useTripStore.getState().data.rows
  const ZF_updateBodyCell = useTripStore.getState().actions.updateBodyCell

  if(columnIndex >= 0)
  {
    for(let i = 0; i < Z_tripRows.length; i++)
    {
      const row = Z_tripRows[i];
      if(row)
      {
        const addressCell = row.cells[columnIndex]
        console.log(addressCell)

        if(addressCell?.address.solveStatus === EAddressSolveStatus.AWAITING_SOLVE) //if the cell has no geocoded address, find one
        {
          const addressPrediction = await getFirstPlacePrediction(addressCell.displayData)
          console.log(addressPrediction)
          ZF_updateBodyCell({...addressCell, address: addressPrediction});
          
        }
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
export function handleColumnDesignationAndSolveAddresses(columnIndex: number, columnDesignation: EColumnDesignations)
{
  useTripStore.getState().actions.updateColumnDesignation({columnIndex: columnIndex, designation: columnDesignation})
  // solve addresses in column if not edit mode
  if(useTripStore.getState().data.tabelMode !== ETableMode.EditMode)
  {
    solveAddresses(columnIndex)
  }
}

export function addCustomRow(address: IAddress, linkAddress: IAddress | null)
{
  const Z_rows = useTripStore.getState().data.rows
  const Z_addressColumnIndex = useTripStore.getState().data.addressColumnIndex
  const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex

  const ZF_appendRows = useTripStore.getState().actions.appendRows
  const ZF_setRowsAsNewTrip = useTripStore.getState().actions.setRowsAsNewTrip
  const ZF_updateColumnDesignation = useTripStore.getState().actions.updateColumnDesignation

  console.log(Z_rows)
  if(Z_rows.length > 0)
  {
    const firstRowLength = Z_rows[0]?.cells.length
    if(firstRowLength && firstRowLength > 0)
    {
      const cells: ICell[] = []
      for(let i = 0; i < firstRowLength; i++)
      {
        const blankAddress: IAddress = {
          formatted_address: "",
          latLng: null,
          solveStatus: EAddressSolveStatus.AWAITING_SOLVE,
          isAddressAccepted: false,
          placeId: ""
        }
        cells.push({x: -1, y: -1, displayData: "", formula: "", address: blankAddress})
      }
  
      if(Z_addressColumnIndex > -1)
      {
        const addressCell = cells[Z_addressColumnIndex]
        if(addressCell)
        {
          addressCell.address = address
          addressCell.displayData = address.formatted_address
  
          if(Z_linkAddressColumnIndex > -1 && linkAddress)
          {
            const linkAddressCell = cells[Z_linkAddressColumnIndex]
            if(linkAddressCell)
            {
              linkAddressCell.address = linkAddress
              linkAddressCell.displayData = linkAddress.formatted_address
            }
          }
          else if(Z_linkAddressColumnIndex < 0 && linkAddress)
          {
            return "Please assign a link address column and retry";
          }
  
          ZF_appendRows([{cells: cells, children: []}], false)
          return ""
        }
        return "INTERNAL ERROR: No address cell"
      }
      else
      {
        return "Please select an address column and retry"
      }
    }
  }
  else
  {
    const cells: ICell[] = []
    const addressCell: ICell = {x: 1, y: -1, displayData: address.formatted_address, formula: "", address: address}
    cells.push(addressCell)
    if(linkAddress)
    {
      const linkAddressCell: ICell = {x: 2, y: -1, displayData: linkAddress.formatted_address, formula: "", address: linkAddress}
      cells.push(linkAddressCell)
    }

    
    ZF_setRowsAsNewTrip([{cells: cells, children: []}])
    ZF_updateColumnDesignation({columnIndex: 0, designation: EColumnDesignations.Address})
    if(linkAddress)
    {
      ZF_updateColumnDesignation({columnIndex: 1, designation: EColumnDesignations.LinkAddress})
    }
    return ""
  }

  return "INTERNAL ERROR: could not add"
}
