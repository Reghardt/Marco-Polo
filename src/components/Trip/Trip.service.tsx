import React from "react";
import { IGeocoderResult, ITripDirections } from "../../interfaces/simpleInterfaces";
import { IRow } from "../../services/worksheet/row.interface";

export function removeRowParentChildRelations(rows: IRow[])
{
    console.log("reset parent- children")
    let noRelationRows: IRow[] = [];
    for(let i = 0; i < rows.length; i++)
    {
        noRelationRows.push(rows[i])
        let children = rows[i].children
        
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
    let parentWithChildrenRows: IRow[] = [];

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
                let lastParent = parentWithChildrenRows[parentWithChildrenRows.length - 1]
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
      let geoResPromise = new Promise<IGeocoderResult>((resolve) => {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address, region: "ZA"},(res, status) => {
          resolve({status, results: res})
        })
      })

      return geoResPromise;
    }

export function createDataFromNewCollection()
{
  
}

//this function orders the rows according to thw waypoint orders. X and Y sheet coordinates remain the same.
export function createInSequenceJobRows(rows: Readonly<IRow[]>, waypointOrder: number[]): IRow[]
    {
        let inSequenceBody: IRow[] = []
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
          let directionsService = new google.maps.DirectionsService();
          directionsService.route(request, (result, status) => {
              resolve({result, status})
          });
        })  
      }


      //this function checks if a number of rows are of equal length and if their columns align.
export function doRowsConform(rows: IRow[], referenceRow: IRow = null) : {status: boolean, reason: string}
{
  //
  if(referenceRow === null) //reference row to test against, otherwise use the first row of the rows
  {
    referenceRow = rows[0]
  }
  
  for(let i = 0; i < rows.length; i++)
  {
    let row = rows[i]
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
    
    let rowsToAddAccumilator: IRow[] = []
    for(let i = 0; i < rowsToAdd.length; i++)
    {
      let addRow = rowsToAdd[i]
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
