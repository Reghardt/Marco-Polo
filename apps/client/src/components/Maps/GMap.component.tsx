import { Box, Paper, Typography } from "@mui/material"
import { Instance } from "@popperjs/core";
import React, { useEffect, useRef, useState } from "react"
// import { useMapsStore } from "../../Zustand/mapsStore";
import { useTripStore } from "../../Zustand/tripStore";



import { createCustomMapMarkers } from "../../Services/GMap.service"
import GMapLegends from "./GMapLegends.component";
import { ITripDirections } from "../common/CommonInterfacesAndEnums";

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

    const directionRenderers = useRef<google.maps.DirectionsRenderer[]>([])
   

    
    const [markers, setMarkers] = useState<JSX.Element[]>([])

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
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8, disableDoubleClickZoom: true})
              

        //directionsRenderer.current = new google.maps.DirectionsRenderer()

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
            handleRouteToDisplay()    
        }
        else
        {
            for(let i = 0; i < directionRenderers.current.length; i++)
            {
                directionRenderers.current[i]?.setMap(null)
            }
            directionRenderers.current = []
        }
    }, [Z_tripDirections])

    function createCustomLeg(leg: google.maps.DirectionsLeg, writabelDirections: ITripDirections, strokeColor: string)
    {
        console.log(leg)
        const customDirections: ITripDirections = {result: {...writabelDirections!.result!}, status: writabelDirections.status}
        if(customDirections.result?.routes[0]?.legs)
        {
            customDirections.result.routes[0].legs = [] //point to new empty legs array
            customDirections.result.routes[0].legs.push(leg)
            directionRenderers.current.push(
                new google.maps.DirectionsRenderer(
                {
                    map: map.current,
                    suppressMarkers: true,
                    preserveViewport: true,
                    directions: customDirections.result,
                    polylineOptions: {
                        strokeColor: strokeColor,
                        strokeWeight: 5,
                        // strokeOpacity: 0.5
                    }
                }
            ))
        }
            
        
    }

    function handleRouteToDisplay()
    {
        const Z_rows = useTripStore.getState().data.rows
        const Z_linkAddressColumnIndex = useTripStore.getState().data.linkAddressColumnIndex


        console.log("handleRouteToDisplay fired ")
        if(Z_tripDirections?.result && Z_tripDirections.status === google.maps.DirectionsStatus.OK)
        {
            for(let i = 0; i < directionRenderers.current.length; i++)
            {
                directionRenderers.current[i]?.setMap(null)
            }
            directionRenderers.current = []

            const route = Z_tripDirections.result?.routes[0]
            if(route)
            {
                const legs = JSON.parse(JSON.stringify(route.legs)) as google.maps.DirectionsLeg[]

                for(let i = 0; i < Z_rows.length; i++)
                {
                    const row = Z_rows[i]
                    if(row)
                    {
                        const leg = legs.shift()
                        if(leg)
                        {
                            //stringify and parse to create a copy of trip directions that is writable. The one from google is not writable
                            //only the legs inside the writableDirections object is written over as needed
                            const writabelDirections = JSON.parse(JSON.stringify(Z_tripDirections)) as ITripDirections
                            createCustomLeg(leg, writabelDirections, "hsl(208, 100%, 48%, 0.70)")
                        }   
                        if(row.cells[Z_linkAddressColumnIndex]?.isAddressAccepted)
                        {
                            const linkLeg = legs.shift()
                            if(linkLeg)
                            {
                                const writabelDirections = JSON.parse(JSON.stringify(Z_tripDirections)) as ITripDirections
                                createCustomLeg(linkLeg, writabelDirections, "hsl(125, 100%, 36%, 0.70)")
                            }
                            
                        }
                       
                    }
                }

                const writabelDirections = JSON.parse(JSON.stringify(Z_tripDirections)) as ITripDirections
                const finalLeg = legs.shift()
               
                if(finalLeg)
                {
                    createCustomLeg(finalLeg, writabelDirections, "hsl(208, 100%, 48%, 0.70)")
                }
            }

            

            // directionsRenderer.current = new google.maps.DirectionsRenderer(
            //     {
            //         map: map.current,
            //         suppressMarkers: true,
            //         preserveViewport: preserveViewport,
            //         directions: Z_tripDirections.result,
            //         // polylineOptions: {
            //         //     strokeColor: "lightblue"
            //         // }
            //     }
            // )
        }

    }

    // function printPopperRefs()
    // {
    //     console.log(popperRefs.current)
    // }
    

    return(
        <Box>
            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Google Maps</Typography>   
            {/* <Button onClick={() => printPopperRefs()}>Print</Button>          */}
            <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
            <GMapLegends/>

            

            {markers.length > 0 && (
                markers.map((marker) => {
                    return marker
                })
            )}
        </Box>
    )
}

export default GMap