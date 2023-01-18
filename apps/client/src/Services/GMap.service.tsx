import { Instance } from "@popperjs/core";
import React from "react";
import { IRow, ITripDirections } from "../Components/common/CommonInterfacesAndEnums";
import BodyMarker, { EMarkerType } from "../Components/Maps/CustomMarker/BodyMarker.component";
import DepRetMarker from "../Components/Maps/CustomMarker/DepRetMarker.component";
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

export function createCustomMapMarkers(
    rows: IRow[], 
    addressColumnIndex: number, 
    map: React.MutableRefObject<google.maps.Map | undefined>, 
    departureAddress: google.maps.GeocoderResult | null, 
    returnAddress: google.maps.GeocoderResult | null,
    popperRefs: React.MutableRefObject<(Instance | null)[]>,
    ): JSX.Element[]
{

    const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex

    const newMarkers: JSX.Element[] = []

    if(addressColumnIndex > -1)
    {
        for(let i = 0; i < rows.length; i++)
        {
            //const row: IRow = rows[i]
            

            {
                let label = (i + 1).toString()
                const linkAddressCell = rows[i]?.cells[Z_linkAddressColumnIndex]
                if(linkAddressCell?.geocodedDataAndStatus?.results && linkAddressCell.geocodedDataAndStatus.results.length > 0)
                {
                    label+= "->"
                }

                const cell = rows[i]?.cells[addressColumnIndex]
                if(cell?.geocodedDataAndStatus?.results && cell.geocodedDataAndStatus.results.length > 0)
                {
                    const addressRes = cell.geocodedDataAndStatus.results[cell.selectedGeocodedAddressIndex]
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

            const linkAddressCell = rows[i]?.cells[Z_linkAddressColumnIndex]
            const label = `->${(i + 1).toString()}`
            if(linkAddressCell?.geocodedDataAndStatus?.results && linkAddressCell.geocodedDataAndStatus.results.length > 0)
            {
                const addressRes = linkAddressCell.geocodedDataAndStatus.results[linkAddressCell.selectedGeocodedAddressIndex]
                if(addressRes)
                {

                    newMarkers.push(
                        <BodyMarker 
                            key={`custom-marker-to-${i}`}
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