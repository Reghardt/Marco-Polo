import React from "react";
import { IGeocoderResult } from "../../interfaces/simpleInterfaces";
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
