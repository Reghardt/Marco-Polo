import { IRow } from "../../../../services/worksheet/row.interface";

export enum EDisplayRoute{
    Fastest,
    Original
  }


export function createMapMarkers(rows: IRow[], currentMapMarkers: google.maps.Marker[], addressColumnIndex: number, map: React.MutableRefObject<google.maps.Map>)
{
    let newMarkers: google.maps.Marker[] = [];
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
                let cell = row.cells[addressColumnIndex]
                console.log("label generatable")
                newMarkers.push(
                    new google.maps.Marker({
                        position: cell.geocodedAddressRes.geometry.location,
                        map: map.current
                    })
                )
            }
        }
    }

    return newMarkers

    
    
}