import React from "react";
import { IRow, ITripDirections } from "../Components/common/CommonInterfacesAndEnums";
import AddressMarker, { EAddressMarkerType } from "../Components/Maps/CustomMarker/AddressMarker";
import CustomMarker from "../Components/Maps/CustomMarker/CustomMarker";

import { useMapsStore } from "../Zustand/mapsStore";
import { useTripStore } from "../Zustand/tripStore";
import { createLinkedAddressesDirections, createSimplePointToPointDirections } from "./Trip.service";

export type TDirectionsLeg= {
    distance : google.maps.Distance, 
    duration: google.maps.Duration, 
    path: google.maps.LatLng[]
    startAddress: string,
    endAddress: string
}

export function createMarker(
    keyId: string, 
    map: React.MutableRefObject<google.maps.Map | undefined>,
    position: google.maps.LatLng,
    content: React.ReactNode,
    )
{
    return <CustomMarker
        key={`custom-marker-${keyId}`}
        map={map.current} 
        position={position} 
    >
        {content}
    </CustomMarker>
}

export function createCustomMapMarkers(
    rows: IRow[], 
    map: React.MutableRefObject<google.maps.Map | undefined>, 
    addressColumnIndex: number,
    linkAddressColumnIndex: number,
    departureAddress: google.maps.GeocoderResult | null, 
    returnAddress: google.maps.GeocoderResult | null
    )
{
    if(departureAddress && returnAddress)
    {

    }



    const addressMarkers: JSX.Element[] = []

    if(addressColumnIndex > -1)
    {
        for(let i = 0; i < rows.length; i++)
        {
            const row = rows[i]
            if(row)
            {
                const addressCell = addressColumnIndex > -1 ? row.cells[addressColumnIndex] : undefined
                const linkAddressCell = linkAddressColumnIndex > -1 ? row.cells[linkAddressColumnIndex] : undefined
                
                if(addressCell?.geocodedDataAndStatus?.results && addressCell.geocodedDataAndStatus.results.length > 0)
                {
                    const selectedAddressRes = addressCell.geocodedDataAndStatus.results[addressCell.selectedGeocodedAddressIndex]
                    if(selectedAddressRes)
                    {
                        let label = (i + 1).toString()
                        if(linkAddressCell?.geocodedDataAndStatus?.results && linkAddressCell.geocodedDataAndStatus.results.length > 0) //add -> to label if row has a valid link address
                        {
                            label+= "->"
                        }
                        addressMarkers.push(
                            createMarker(
                                label, 
                                map, 
                                selectedAddressRes.geometry.location, 
                                <AddressMarker label={label} markerType={EAddressMarkerType.ADDRESS}/>
                            ))
                    }
                }
                
                if(linkAddressCell?.geocodedDataAndStatus?.results && linkAddressCell.geocodedDataAndStatus.results.length > 0)
                {
                    const selectedAddressRes = linkAddressCell.geocodedDataAndStatus.results[linkAddressCell.selectedGeocodedAddressIndex]
                    if(selectedAddressRes)
                    {
                        const label = `->${(i + 1).toString()}`
                        addressMarkers.push(
                            createMarker(
                                label, 
                                map, 
                                selectedAddressRes.geometry.location, 
                                <AddressMarker label={label} markerType={EAddressMarkerType.ADDRESS}/>
                            ))
                    }
                }
            }

        }
    }

    if(departureAddress && returnAddress && departureAddress.formatted_address === returnAddress.formatted_address)
    {
        if(departureAddress)
        {
            const label = "D+R"
            addressMarkers.unshift(
                createMarker(
                    label, 
                    map, 
                    departureAddress.geometry.location, 
                    <AddressMarker label={label} markerType={EAddressMarkerType.DEP_RET}/>
                ))
        }
    }
    else
    {
        if(departureAddress)
        {
            const label = "Dep"
            addressMarkers.unshift(
                createMarker(
                    label, 
                    map, 
                    departureAddress.geometry.location, 
                    <AddressMarker label={label} markerType={EAddressMarkerType.DEP_RET}/>
                ))
        }
        if(returnAddress)
        {
            const label = "Ret"
            addressMarkers.push(
                createMarker(
                    label, 
                    map, 
                    returnAddress.geometry.location, 
                    <AddressMarker label={label} markerType={EAddressMarkerType.DEP_RET}/>
                ))
        }
    }
    return addressMarkers;
}

//retuns a directions waypoint, unless something goes wrong, then null gets returned
export function isValidAddress(row: IRow, columnIndex: number): boolean
{
    const cell = row.cells[columnIndex]
    if(cell)
    {
        if(cell.displayData && cell.geocodedDataAndStatus?.status === google.maps.GeocoderStatus.OK && cell.geocodedDataAndStatus?.results)
        {

            const location = cell.geocodedDataAndStatus?.results[cell.selectedGeocodedAddressIndex]?.formatted_address
            if(location)
            {
                return true
            }
            else
            {
                return false
            }

        }
        else
        {   
            return false
        }
    }
    else
    {
        return false
    }
}

function createWaypoint(row: IRow, columnIndex: number) : google.maps.DirectionsWaypoint
{
    return {location: row.cells[columnIndex]!.displayData, stopover: true}
}

function createWaypointsListFromRows(): google.maps.DirectionsWaypoint[] | null
{
    const Z_rows = useTripStore.getState().data.rows
    const Z_addressColumnIndex = useTripStore.getState().data.addressColumnIndex
    const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex

    if(Z_addressColumnIndex >= 0)
    {
        const waypoints: google.maps.DirectionsWaypoint[]  = [];
        for(let i = 0; i < Z_rows.length; i++)
        {
            const row = Z_rows[i]
            if(row)
            {
                const addressWaypoint = isValidAddress(row, Z_addressColumnIndex)
                if(addressWaypoint) //check if address is valid, if true, a waypoint can be created from it
                {
                    waypoints.push(createWaypoint(row, Z_addressColumnIndex)) //create the waypoint
                    if(Z_linkAddressColumnIndex >= 0)
                    {
                        const linkAddressWaypoint = isValidAddress(row, Z_linkAddressColumnIndex)
                        if(linkAddressWaypoint)
                        {
                            waypoints.push(createWaypoint(row, Z_linkAddressColumnIndex))
                        }
                        else 
                        {
                            if(row.cells[Z_linkAddressColumnIndex]?.displayData !== "")
                            {
                                console.error("Non empty Link Address not valid")
                                return null
                            }
                        }
                    } //mo else, there is no linkAddressColumn
                }
                else
                {
                    console.error("Address not valid")
                    return null
                }
            }
        }
        return waypoints
    }
    else
    {
        console.error("No address column selected")
        return null
    }
    
}

async function calculateDirectionsFromWaypoints(): Promise<ITripDirections | null>
{   const Z_departureAddress = useTripStore.getState().data.departureAddress
    const Z_returnAddress = useTripStore.getState().data.returnAddress
    const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex

    const ZF_setRowOrderPerWaypoints = useTripStore.getState().reducers.setRowOrderPerWaypoints

    const waypoints = createWaypointsListFromRows()
    console.log(waypoints)
    if(waypoints)
    {
        if(Z_departureAddress)
        {
            if(Z_returnAddress)
            {
                if(Z_linkAddressColumnIndex < 0) //no link addresses
                {
                    const pointToPointDirections = await createSimplePointToPointDirections(Z_departureAddress.formatted_address, Z_returnAddress.formatted_address, waypoints, true )
                    if(pointToPointDirections.result?.routes[0])
                    {
                        //reorder row as per optimized route
                        ZF_setRowOrderPerWaypoints(pointToPointDirections.result?.routes[0].waypoint_order);
                        return pointToPointDirections
                    }
                    else
                    {
                        return null
                    }
                    
                    
                }
                else //there are link addresses
                {
                    //TODO modify function to use dijikstras algorithm to calulate shortest path for when link addresses are present
                    return await createLinkedAddressesDirections(Z_departureAddress.formatted_address, Z_returnAddress.formatted_address, waypoints )
                }
            }
            else
            {
                //no return address
                console.error("No return address set")
                return null
            }
        }
        else
        {
            //No departure address
            console.error("No departure address set")
            return null
        }
    }
    else
    {
        console.error("No waypoints")
        return null
    }
}



export async function handleCalculateFastestDirections()
{
    const ZF_setPreserveViewport = useMapsStore.getState().reducers.setPreserveViewport
    const ZF_setTripDirections = useTripStore.getState().reducers.setTripDirections
    
    const directions = await calculateDirectionsFromWaypoints()
    console.log(directions)

    ZF_setPreserveViewport(false);
    if(directions)
    {
        ZF_setTripDirections(directions);
    }
    
}

export function createPolyPathsFromDirections(directions: ITripDirections) : TDirectionsLeg[] | null
{
    
    if(directions.result?.routes[0])
    {
        const route = directions.result?.routes[0]
        const directionsLegs: TDirectionsLeg[] = []
        
        for(let i = 0; i < route.legs.length; i++)
        {
            const legPath: google.maps.LatLng[] = []
            const leg = route.legs[i]
            if(leg)
            {
                for( let j = 0; j < leg.steps.length; j++)
                {
                    const step = leg.steps[j]
                    if(step)
                    {
                        legPath.push(...step.path)
                    }
                }
                
                
                directionsLegs.push({distance: leg.distance ?? {text: "", value: 0}, duration: leg.duration ?? {text: "", value: 0}, path: legPath, startAddress: leg.start_address, endAddress: leg.end_address})
            }
        }
        return directionsLegs
    }
    else
    {
        return null
    }
}