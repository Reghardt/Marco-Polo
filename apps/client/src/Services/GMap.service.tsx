import React from "react";
import { IRow, ITripDirections } from "../Components/common/CommonInterfacesAndEnums";
import AddressMarker, { EAddressMarkerType } from "../Components/Maps/CustomMarker/AddressMarker";
import CustomMarker from "../Components/Maps/CustomMarker/CustomMarker";
import { IToll, tolls } from "../Components/Maps/Tolls";

import { useMapsStore } from "../Zustand/mapsStore";
import { useTripStore } from "../Zustand/tripStore";
import { createLinkedAddressesDirections, createSimplePointToPointDirections } from "./Trip.service";

export type TMouldedDirectionsLeg= {
    distance : google.maps.Distance, 
    duration: google.maps.Duration, 
    path: google.maps.LatLng[],
    polyLine: google.maps.Polyline | null,
    startAddress: string,
    endAddress: string,
    passThroughTolls: {toll: IToll, gateIndex: number}[]
}

type TMouldedDirectionsLegGroup = {
    legs: TMouldedDirectionsLeg[]
}

export type TMouldedDirections = {
    legGroups: TMouldedDirectionsLegGroup[],
    bounds: google.maps.LatLngBounds
    //boundedTolls: IToll[]
}



export function createMarker(
    keyId: string, 
    map: google.maps.Map | undefined,
    position: google.maps.LatLng,
    content: React.ReactNode,
    center: boolean = false
    )
{
    return <CustomMarker
        key={`custom-marker-${keyId}`}
        map={map} 
        position={position} 
        center={center}
    >
        {content}
    </CustomMarker>
}

export function createCustomMapMarkers(
    rows: IRow[], 
    map: google.maps.Map | undefined, 
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
                                <AddressMarker label={label} markerType={EAddressMarkerType.ADDRESS} popperData={{cell: addressCell, rowIndex: i}}/>
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
                                <AddressMarker label={label} markerType={EAddressMarkerType.ADDRESS} popperData={{cell: linkAddressCell, rowIndex: i}}/>
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
                    <AddressMarker label={label} markerType={EAddressMarkerType.DEP_RET} popperData={null}/>
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
                    <AddressMarker label={label} markerType={EAddressMarkerType.DEP_RET} popperData={null}/>
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
                    <AddressMarker label={label} markerType={EAddressMarkerType.DEP_RET} popperData={null}/>
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
        if(cell.displayData && cell.geocodedDataAndStatus?.status === google.maps.GeocoderStatus.OK && cell.geocodedDataAndStatus?.results && cell.isAddressAccepted)
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

    const ZF_setErrorMessage = useTripStore.getState().actions.setErrorMessage

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
                                console.error("ERROR: Check if all link addresses are confirmed")
                                ZF_setErrorMessage("ERROR: Check if all link addresses are confirmed")
                                return null
                            }
                        }
                    } //mo else, there is no linkAddressColumn
                }
                else
                {
                    console.error("Error: Check if all addresses are confirmed")
                    ZF_setErrorMessage("ERROR: Check if all addresses are confirmed")
                    return null
                }
            }
        }
        return waypoints
    }
    else
    {
        ZF_setErrorMessage("ERROR: No address column selected")
        console.error("No address column selected")
        
        return null
    }
    
}

async function calculateDirectionsFromWaypoints(optimize: boolean): Promise<ITripDirections | null>
{   const Z_departureAddress = useTripStore.getState().data.departureAddress
    const Z_returnAddress = useTripStore.getState().data.returnAddress
    const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex

    const ZF_setRowOrderPerWaypoints = useTripStore.getState().actions.setRowOrderPerWaypoints
    const ZF_setErrorMessage = useTripStore.getState().actions.setErrorMessage

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
                    const pointToPointDirections = await createSimplePointToPointDirections(Z_departureAddress.formatted_address, Z_returnAddress.formatted_address, waypoints, optimize )
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
                ZF_setErrorMessage("Error: No return address set")
                return null
            }
        }
        else
        {
            //No departure address
            console.error("No departure address set")
            ZF_setErrorMessage("Error: No departure address set")
            return null
        }
    }
    else
    {
        console.error("No waypoints")
        ZF_setErrorMessage("Error: No waypoints")
        return null
    }
}

function addTollsWithinBoundsTo(mouldedDirections: TMouldedDirections)
{
    const boundedTolls: IToll[] = [];
    for(let i = 0; i < tolls.length; i++)
    {
        const toll = tolls[i]
        if(toll)
        {
            for(let j = 0; j < toll.gateSection.length; j++)
            {
                const gateSection = toll.gateSection[j];
                if(mouldedDirections.bounds.contains(gateSection!.coordinates))
                {
                    boundedTolls.push(toll)
                    break; //break out of this toll's gate sections and move on to next toll
                }
            }
            
        }
    }

    console.log(boundedTolls)
    if(boundedTolls.length)
    {
        for(let i = 0; i < mouldedDirections.legGroups.length; i++) //loop through leg groups of directions
        {
            const group = mouldedDirections.legGroups[i];
            if(group)
            {
                for(let j = 0; j < group.legs.length; j++) // loop through each leg of a leg group
                {
                    const leg = group.legs[j];
                    if(leg)
                    {
                        for(let k = 0; k < boundedTolls.length; k++) //loop through bounded tolls
                        {
                            const toll = boundedTolls[k];
                            if(toll)
                            {
                                for(let l = 0; l < toll.gateSection.length; l++) //loop trhough each section of a toll
                                {
                                    const gateSection = toll.gateSection[l];
                                    if(gateSection)
                                    {
                                        //if true, polyline intersects toll: then add toll to passThroughTolls of the leg and break the gate section loop to move on to the next toll.
                                        if(google.maps.geometry.poly.isLocationOnEdge(gateSection.coordinates, leg.polyLine!, 10 * 10 **(-5)))
                                        {
                                            leg.passThroughTolls.push({toll: toll, gateIndex: l})
                                            
                                        }
                                    }
                                }
                            }
                        } 
                    }
                }
            }
        }
    }
}


export async function createTripDirections(optimize: boolean, preserveViewport: boolean)
{
    const Z_rows = useTripStore.getState().data.rows
    const Z_addressColumnIndex = useTripStore.getState().data.addressColumnIndex
    const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex
    const ZF_clearAndSetTripDirections = useTripStore.getState().actions.clearAndSetTripDirections
    const Z_map = useMapsStore.getState().data.map
   
    const directions = await calculateDirectionsFromWaypoints(optimize) //calculate new directions
    if(directions && directions.status === google.maps.DirectionsStatus.OK && Z_map) //if successfull
    {
        const mouldedDirections = mouldDirectionsAndDisplay(Z_rows, directions, Z_addressColumnIndex, Z_linkAddressColumnIndex, Z_map) //transform directions
        if(mouldedDirections)
        {
            if(preserveViewport === false) //zoom in on route by using directions renderer temporarily
            {
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map: Z_map,
                    directions: directions.result,
                    suppressMarkers: true, 
                    suppressPolylines: true
                })
                if(directionsRenderer)
                {
                    setTimeout(() => {
                        directionsRenderer.setMap(null)
                        console.log("Directions renderer set to null")
                    }, 5000)
                    
                }
            }

            addTollsWithinBoundsTo(mouldedDirections)
            ZF_clearAndSetTripDirections(mouldedDirections);
        }
    } 
}

function createLatLngPathFromLeg(leg: google.maps.DirectionsLeg)
{
    const path: google.maps.LatLng[] = [];
    for( let j = 0; j < leg.steps.length; j++)
    {
        const step = leg.steps[j]
        if(step)
        {
            path.push(...step.path)
        }
    }

    return path

}

export function createPolyLineFromPath(path: google.maps.LatLng[], strokeColor: string, map: google.maps.Map | undefined)
{
    return new google.maps.Polyline({
        path: path,
        strokeColor: strokeColor,
        strokeWeight: 5,
        map: map
    })
}

//TODO error handeling feedback
export function mouldDirectionsAndDisplay(
    rows: IRow[], 
    directions: ITripDirections, 
    addressColumnIndex: number, 
    linkAddressColumnIndex: number,
    map: google.maps.Map

    ): TMouldedDirections | null
{
    const ZF_setErrorMessage = useTripStore.getState().actions.setErrorMessage
    if(addressColumnIndex < 0)
    {
        ZF_setErrorMessage("No Address Column Set");
        return null //no address column
    }

    const route = directions.result?.routes[0]

    if(route)
    {
        console.log(route)
        let routeLegIndex = 0; //used to crawl down the list of legs of the route. 
        const mouldedDirectionsLegGroups: TMouldedDirectionsLegGroup[] = []
        for(let i = 0; i < rows.length; i++)
        {
            const row = rows[i]
            if(row)
            {
                const addressCell = row.cells[addressColumnIndex]
                if(addressCell && addressCell.geocodedDataAndStatus?.status === google.maps.GeocoderStatus.OK)
                {
                    if(!mouldedDirectionsLegGroups[i]) //if undefined at index, create new empty array at index
                    {
                        mouldedDirectionsLegGroups[i] = {legs: []}
                    }

                    const leg = route.legs[routeLegIndex]
                    if(leg)
                    {
                        const path = createLatLngPathFromLeg(leg)
                        mouldedDirectionsLegGroups[i]?.legs.push(
                            {
                                distance: leg.distance ?? {text: "", value: 0}, 
                                duration: leg.duration ?? {text: "", value: 0}, 
                                path: path, 
                                polyLine: createPolyLineFromPath(path, "hsl(208, 100%, 48%, 0.70)", map), //blue
                                startAddress: leg.start_address, 
                                endAddress: leg.end_address,
                                passThroughTolls: []
                            }
                        )
                        routeLegIndex++; //increment on success
                    }
                    else
                    {
                        ZF_setErrorMessage("INTERNAL ERROR: Trip leg does not exist (address)");
                        return null //leg does not exist
                    }
                }
                else
                {
                    ZF_setErrorMessage("INTERNAL ERROR: Address cell not valid");
                    return null //address cell not valid
                }

                if(linkAddressColumnIndex > -1) //if there are link addresses
                {
                    const linkAddressCell = row.cells[linkAddressColumnIndex]
                    if(linkAddressCell && linkAddressCell.geocodedDataAndStatus?.status === google.maps.GeocoderStatus.OK)
                    {
                        const linkLeg = route.legs[routeLegIndex]
                        if(linkLeg)
                        {
                            const path = createLatLngPathFromLeg(linkLeg)
                            mouldedDirectionsLegGroups[i]?.legs.push(
                                {
                                    distance: linkLeg.distance ?? {text: "", value: 0}, 
                                    duration: linkLeg.duration ?? {text: "", value: 0}, 
                                    path: path, 
                                    polyLine: createPolyLineFromPath(path, "hsl(125, 100%, 36%, 0.70)", map), //green
                                    startAddress: linkLeg.start_address, 
                                    endAddress: linkLeg.end_address,
                                    passThroughTolls: []
                                }
                            )
                            routeLegIndex++
                        }
                        else
                        {
                            ZF_setErrorMessage("INTERNAL ERROR: Trip leg does not exist (linkAddress)");
                            return null //leg does not exist
                        }
                    }
                }
            }
            else
            {
                ZF_setErrorMessage("INTERNAL ERROR: Row does not exist");
                return null //row does not exist
            }
        }

        //create poly line for return leg
        const retunLeg = route.legs.at(-1)
        if(retunLeg)
        {
            const path = createLatLngPathFromLeg(retunLeg)
            mouldedDirectionsLegGroups.push({legs: [
                {
                    distance: retunLeg.distance ?? {text: "", value: 0}, 
                    duration: retunLeg.duration ?? {text: "", value: 0},
                    path: path,
                    polyLine: createPolyLineFromPath(path, "hsl(208, 100%, 48%, 0.70)", map),
                    startAddress: retunLeg.start_address, 
                    endAddress: retunLeg.end_address,
                    passThroughTolls: []
                }
            ]})
        }
        ZF_setErrorMessage("");
        return {legGroups: mouldedDirectionsLegGroups, bounds: route.bounds}
    }
    else
    {
        ZF_setErrorMessage("INTERNAL ERROR: No Route Calculated");
        return null //no route has been calculated
    }
}