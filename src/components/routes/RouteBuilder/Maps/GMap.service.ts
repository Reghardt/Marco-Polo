import { IRow } from "../../../../services/worksheet/row.interface";

export enum EDisplayRoute{
    Fastest,
    Original
  }


export function createMapMarkers(rows: IRow[], currentMapMarkers: google.maps.Marker[], addressColumnIndex: number, map: google.maps.Map)
{
    if(map)
    {

    }

    for(let i = 0; i < currentMapMarkers.length; i++)
    {
        currentMapMarkers[i].setMap(null)
    }

    if(addressColumnIndex > -1)
    {
        for(let i = 0; i < rows.length; i++)
        {
            let row = rows[i]
            if(row.cells[addressColumnIndex].geocodedAddressRes !== null)
            {
                console.log("label generatable")
            }
        }
    }

    
    
}