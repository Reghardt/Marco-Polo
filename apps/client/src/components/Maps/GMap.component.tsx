import { Paper } from "@mui/material"
import { Instance } from "@popperjs/core";
import React, { useEffect, useRef, useState } from "react"
// import { useMapsStore } from "../../Zustand/mapsStore";
import { useTripStore } from "../../Zustand/tripStore";



import { createCustomMapMarkers, createPolyPathsFromDirections, TDirectionsLeg } from "../../Services/GMap.service"
import GMapLegends from "./GMapLegends.component";
import { createPortal } from "react-dom";
import LegsListControl from "./LegsListControl.component";
// import { createPortal } from "react-dom";

// export enum EMapPopperStates{
//     CLOSE,
//     OPEN,
//     RESUME
// }

const GMap: React.FC = () => {

    const Z_tripDirections = useTripStore(state => state.data.tripDirections)
    const Z_tripRows = useTripStore(state => state.data.rows)
    const Z_addresColumIndex = useTripStore(state => state.data.addressColumnIndex)
    const Z_departureAddress = useTripStore(state => state.data.departureAddress)
    const Z_returnAddress = useTripStore(state => state.data.returnAddress)

    
    
    const map = useRef<google.maps.Map>()
    const popperRefs = useRef<Array<Instance | null>>([])

    const polyLines = useRef<google.maps.Polyline[]>([])

    const controlContainer = useRef<HTMLDivElement | null>(null)
   

    
    const [markers, setMarkers] = useState<JSX.Element[]>([])

    
    // testControl.textContent = "center";
    // testControl.title = "click me"

    //const Z_preserveViewport = useMapsStore(state => state.data.preserveViewport)

    useEffect(() => {
        popperRefs.current = popperRefs.current.slice(0, Z_tripRows.length) //creates new refs array?
        
        setMarkers(createCustomMapMarkers(Z_tripRows, Z_addresColumIndex, map, Z_departureAddress, Z_returnAddress, popperRefs))
        for(let i = 0; i < popperRefs.current.length; i++)
        {
            popperRefs.current[i]?.update()
        }
    }, [Z_tripRows, Z_addresColumIndex, Z_departureAddress, Z_returnAddress])

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8, disableDoubleClickZoom: true});
        
        controlContainer.current = document.createElement("div");
        controlContainer.current.style.marginLeft = '10px';

        map.current.controls[google.maps.ControlPosition.LEFT_TOP]?.push(controlContainer.current)
        
        map.current.addListener("drag", () => {
            console.log("drag")
            for(let i = 0; i < popperRefs.current.length; i++)
            {
                popperRefs.current[i]?.update()
            }
        })

        map.current.addListener("dragend", () => {
            console.log("dragged")
            if(map && map.current)
            {
                
                const mapCenter = map.current.getCenter()
                if(mapCenter)
                map.current.setCenter(mapCenter)
            }
            
        });

        map.current.addListener("idle", () => {
            if(map && map.current)
            {
                const mapCenter = map.current.getCenter()
                if(mapCenter)
                map.current.setCenter(mapCenter)

                for(let i = 0; i < popperRefs.current.length; i++)
                {
                    popperRefs.current[i]?.update()
                }
            }
            
        });
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
                {/* <Button onClick={() => printPopperRefs()}>Print</Button>          */}
                <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
                <GMapLegends/>

                {markers.length > 0 && (
                    markers.map((marker) => {
                        return marker
                    })
                )}

                {controlContainer.current && createPortal(<><LegsListControl polyLines={polyLines}/></>, controlContainer.current)}
            </div>
        </>
    )
        

}

export default GMap