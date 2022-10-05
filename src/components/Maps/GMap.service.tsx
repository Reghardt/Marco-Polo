import React from "react";
import { IRow } from "../../services/worksheet/row.interface";
import CustomMarker from "../experiments/CustomOverlay/CustomMarker.component";

export enum EDisplayRoute{
    Fastest,
    Original
  }


export function createMapMarkers(rows: IRow[], currentMapMarkers: google.maps.Marker[], addressColumnIndex: number, map: React.MutableRefObject<google.maps.Map>)
{
    let newMarkers: google.maps.Marker[] = [];

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



export function createCustomMapMarkers(rows: IRow[], addressColumnIndex: number, map: React.MutableRefObject<google.maps.Map>, routeToDisplay: EDisplayRoute, departureAddress: google.maps.GeocoderResult, returnAddress: google.maps.GeocoderResult): JSX.Element[]
{

    let newMarkers: JSX.Element[] = []

    

    if(addressColumnIndex > -1)
    {

        for(let i = 0; i < rows.length; i++)
        {
            let row: IRow = rows[i]
            let label = ""
            if(routeToDisplay === EDisplayRoute.Fastest)
            {
                label = (i + 1).toString()
            }
            else
            {
                label = String.fromCharCode(i + 'A'.charCodeAt(0))
            }

            if(row.cells[addressColumnIndex].geocodedAddressRes !== null)
            {
                let addressRes = row.cells[addressColumnIndex].geocodedAddressRes
                newMarkers.push(<CustomMarker label={label} map={map.current} position={addressRes.geometry.location} backgroundColor={"primary"}/>)
            }
        }
    }

    if(departureAddress === returnAddress)
    {
        if(departureAddress)
        {
            newMarkers.unshift(<CustomMarker label={"D+R"} map={map.current} position={departureAddress.geometry.location} backgroundColor={"green"}/>)
        }
        
    }
    else
    {
        if(departureAddress)
        {
            newMarkers.unshift(<CustomMarker label={"Dep"} map={map.current} position={departureAddress.geometry.location} backgroundColor={"green"}/>)
        }
        if(returnAddress)
        {
            newMarkers.push(<CustomMarker label={"Ret"} map={map.current} position={returnAddress.geometry.location} backgroundColor={"green"}/>)
        }
        

        
        
    }

    

    return newMarkers;
}