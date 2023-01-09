import { Instance } from "@popperjs/core";
import React from "react";
import { IRow } from "../Components/common/CommonInterfacesAndEnums";
import BodyMarker, { EMarkerType } from "../Components/Maps/CustomMarker/BodyMarker.component";
import DepRetMarker from "../Components/Maps/CustomMarker/DepRetMarker.component";


export function createCustomMapMarkers(
    rows: IRow[], 
    addressColumnIndex: number, 
    map: React.MutableRefObject<google.maps.Map | undefined>, 
    departureAddress: google.maps.GeocoderResult | null, 
    returnAddress: google.maps.GeocoderResult | null,
    popperRefs: React.MutableRefObject<(Instance | null)[]>,
    ): JSX.Element[]
{

    const newMarkers: JSX.Element[] = []

    if(addressColumnIndex > -1)
    {
        console.log(popperRefs)
        for(let i = 0; i < rows.length; i++)
        {
            //const row: IRow = rows[i]
            const label = (i + 1).toString()
            const cell = rows[i].cells[addressColumnIndex]

            if(cell.geoStatusAndRes?.results && cell.geoStatusAndRes.results.length > 0)
            {
                const addressRes = cell.geoStatusAndRes.results[cell.selectedGeocodedAddressIndex]
                if(addressRes)
                {

                    newMarkers.push(
                        <BodyMarker 
                            key={`custom-marker-${i}`}
                            ref={el => {popperRefs.current[i] = el; console.log("Hello")}} 
                            label={label} 
                            map={map.current} 
                            position={addressRes.geometry.location} 
                            markerType={EMarkerType.ADDRESS}
                            //markerRowNumber={i} //takes into consideration the depart and return markers
                        />)
                }
                
            }
        }
    }

    if(departureAddress && returnAddress && departureAddress.formatted_address === returnAddress.formatted_address)
    {
        if(departureAddress)
        {
            newMarkers.unshift(<DepRetMarker label={"D+R"} map={map.current} position={departureAddress.geometry.location} markerType={EMarkerType.DEP_RET}/>)
        }
    }
    else
    {
        if(departureAddress)
        {
            newMarkers.unshift(<DepRetMarker label={"Dep"} map={map.current} position={departureAddress.geometry.location} markerType={EMarkerType.DEP_RET}/>)
        }
        if(returnAddress)
        {
            newMarkers.push(<DepRetMarker label={"Ret"} map={map.current} position={returnAddress.geometry.location} markerType={EMarkerType.DEP_RET}/>)
        }
    }

    

    return newMarkers;
}