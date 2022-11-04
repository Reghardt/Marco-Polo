import { Instance } from "@popperjs/core";
import React from "react";
import { IRow } from "../../services/worksheet/row.interface";
import CustomMarker, { EMarkerType } from "../experiments/CustomOverlay/CustomMarker.component";

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
            const row: IRow = rows[i]
            const label = (i + 1).toString()


            if(row.cells[addressColumnIndex].geocodedAddressRes !== null)
            {
                const addressRes = row.cells[addressColumnIndex].geocodedAddressRes
                if(addressRes)
                {

                    newMarkers.push(
                        <CustomMarker 
                            ref={el => {popperRefs.current[i] = el; console.log("Hello")}} 
                            label={label} 
                            map={map.current} 
                            position={addressRes.geometry.location} 
                            markerType={EMarkerType.ADDRESS}
                            markerRowNumber={i} //takes into consideration the depart and return markers
                        />)

                }
                
            }
        }
    }

    if(departureAddress && returnAddress && departureAddress.formatted_address === returnAddress.formatted_address)
    {
        // if(departureAddress)
        // {
        //     newMarkers.unshift(<CustomMarker label={"D+R"} map={map.current} position={departureAddress.geometry.location} markerType={EMarkerType.DEP_RET} markerRowNumber={0}/>)
        // }
        
    }
    else
    {
        // if(departureAddress)
        // {
        //     newMarkers.unshift(<CustomMarker label={"Dep"} map={map.current} position={departureAddress.geometry.location} markerType={EMarkerType.DEP_RET} markerRowNumber={0}/>)
        // }
        // if(returnAddress)
        // {
        //     newMarkers.push(<CustomMarker label={"Ret"} map={map.current} position={returnAddress.geometry.location} markerType={EMarkerType.DEP_RET} markerRowNumber={1}/>)
        // }
    }

    

    return newMarkers;
}