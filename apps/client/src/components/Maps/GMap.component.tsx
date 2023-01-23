import { Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTripStore } from "../../Zustand/tripStore";
import { createCustomMapMarkers, createMarker, createPolyPathsFromDirections, TDirectionsLeg } from "../../Services/GMap.service";
import GMapLegends from "./GMapLegends.component";
import { createPortal } from "react-dom";
import LegsListControl from "./LegsListControl.component";
import { tolls } from "./Tolls";
import TollMarker from "./CustomMarker/TollMarker";

const GMap: React.FC = () => {

    const Z_tripDirections = useTripStore(state => state.data.tripDirections)
    const Z_tripRows = useTripStore(state => state.data.rows)
    const Z_addresColumIndex = useTripStore(state => state.data.addressColumnIndex)
    const Z_linkAddressColumnIndex = useTripStore(state => state.data.linkAddressColumnIndex)
    const Z_departureAddress = useTripStore(state => state.data.departureAddress)
    const Z_returnAddress = useTripStore(state => state.data.returnAddress)

    const map = useRef<google.maps.Map>()
    const polyLines = useRef<google.maps.Polyline[]>([])
    const controlContainer = useRef<HTMLDivElement | null>(null)

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8, disableDoubleClickZoom: true});
        
        controlContainer.current = document.createElement("div");
        controlContainer.current.style.marginLeft = '10px';

        map.current.controls[google.maps.ControlPosition.LEFT_TOP]?.push(controlContainer.current)
        

    }, [])

    useEffect(() => {
        if(Z_tripDirections && Z_tripDirections.status === "OK")
        {
            displayDirections()
        }
        else
        {
            for(let i = 0; i < polyLines.current.length; i++)
            {
                polyLines.current[i]?.setMap(null)
            }
            polyLines.current = []
        }
    }, [Z_tripDirections])

    function createPolyLinePath(directionsLeg: TDirectionsLeg, strokeColor: string)
    {
        // polyLines.current.push(
        //     new google.maps.Polyline({
        //     path: directionsLeg.path,
        //     strokeColor: strokeColor,
        //     strokeWeight: 5,
        //     map: map.current
        //     })
        // ) 

        return new google.maps.Polyline({
            path: directionsLeg.path,
            strokeColor: strokeColor,
            strokeWeight: 5,
            map: map.current
        })
         
    }

    function displayDirections()
    {
        const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex

        if(Z_tripDirections)
        {
            const directionsLegs = createPolyPathsFromDirections(Z_tripDirections)  

            if(directionsLegs)
            {
                
    
                for(let i = 0; i < polyLines.current.length; i++)
                {
                    polyLines.current[i]?.setMap(null)
                }
                polyLines.current = []
               
                for(let i = 0; i < Z_tripRows.length; i++)
                {
                    const row = Z_tripRows[i];
                    if(row)
                    {
                        const leg = directionsLegs.shift()
                        console.log(leg)
                        
                        if(leg)
                        {
                            polyLines.current.push(createPolyLinePath(leg, "hsl(208, 100%, 48%, 0.70)")) //blue
                        }
        
                        if(row.cells[Z_linkAddressColumnIndex]?.isAddressAccepted)
                        {
                            const linkLeg = directionsLegs.shift()
                            if(linkLeg)
                            {
                                polyLines.current.push(createPolyLinePath(linkLeg, "hsl(125, 100%, 36%, 0.70)")) //green
                            }
                        }
        
                    }
                }

                const finalLeg = directionsLegs.shift()
        
                if(finalLeg)
                {
                    polyLines.current.push(createPolyLinePath(finalLeg, "hsl(208, 100%, 48%, 0.70)")) //blue
                }

            }
 
        }
    }

    // {{color:"#1976d2"}}
    return(
        <>
            <div className={"py-2"}>

                <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
                <GMapLegends/>

                

                {tolls.map((toll) => {
                    return createMarker(
                        toll.name, 
                        map, 
                        toll.coordinates, 
                        <TollMarker tollInfo={toll}/>,
                        // index * -1,
                    )
                })}

                {createCustomMapMarkers(Z_tripRows, map, Z_addresColumIndex, Z_linkAddressColumnIndex, Z_departureAddress, Z_returnAddress)}

                {controlContainer.current && createPortal(<><LegsListControl polyLines={polyLines}/></>, controlContainer.current)}
            </div>
        </>
    )
        

}

export default GMap