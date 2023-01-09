import { Box, Paper, Typography } from "@mui/material"
import { Instance } from "@popperjs/core";
import React, { useEffect, useRef, useState } from "react"
import { useMapsStore } from "../../Zustand/mapsStore";
import { useTripStore } from "../../Zustand/tripStore";
import Statistics from "../Statistics/Statistics.component";


import { createCustomMapMarkers } from "../../Services/GMap.service"
import GMapLegends from "./GMapLegends.component";

export enum EMapPopperStates{
    CLOSE,
    OPEN,
    RESUME
}

const GMap: React.FC = () => {

    const Z_tripDirections = useTripStore(state => state.data.tripDirections)
    const Z_tripRows = useTripStore(state => state.data.rows)
    const Z_addresColumIndex = useTripStore(state => state.data.addressColumnIndex)
    const Z_departureAddress = useTripStore(state => state.data.departureAddress)
    const Z_returnAddress = useTripStore(state => state.data.returnAddress)
    
    const map = useRef<google.maps.Map>()
    const popperRefs = useRef<Array<Instance | null>>([])

    const fastestRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()
    const originalRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()

    

    
    const [markers, setMarkers] = useState<JSX.Element[]>([])

    const Z_preserveViewport = useMapsStore(state => state.data.preserveViewport)

    console.log("maps refresh")

    useEffect(() => {
        popperRefs.current = popperRefs.current.slice(0, Z_tripRows.length) //creates new refs array?
        
        setMarkers(createCustomMapMarkers(Z_tripRows, Z_addresColumIndex, map, Z_departureAddress, Z_returnAddress, popperRefs))
        console.log(popperRefs)
        for(let i = 0; i < popperRefs.current.length; i++)
        {
            popperRefs.current[i]?.update()
        }
    }, [Z_tripRows, Z_addresColumIndex, Z_departureAddress, Z_returnAddress])

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8, disableDoubleClickZoom: true})
              
        // directionsService.current = new google.maps.DirectionsService();
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()

        // R_setMapPopperStates(() => {
        //     const popperStates: EMapPopperStates[] = []
        //     for(let i = 0; i < R_tripRows.length; i++)
        //     {
        //         popperStates.push(EMapPopperStates.CLOSE)
        //     }
        //     console.log("first popper states", popperStates)
        //     return popperStates
        // })

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
            handleRouteToDisplay(Z_preserveViewport)    
        }
        else
        {
            fastestRouteDirectionsRenderer?.current?.setMap(null)
            originalRouteDirectionsRenderer?.current?.setMap(null)
        }
    }, [Z_tripDirections])

    function handleRouteToDisplay(preserveViewport: boolean)
    {
        if(Z_tripDirections)
        {
            fastestRouteDirectionsRenderer?.current?.setMap(null)
            fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: preserveViewport,
            directions: Z_tripDirections.result
            })
            originalRouteDirectionsRenderer?.current?.setMap(null)
        }

    }

    // function printPopperRefs()
    // {
    //     console.log(popperRefs.current)
    // }
    

    return(
        // <Paper sx={{padding: "0.3em", marginTop: "0.3em"}} variant="elevation" elevation={5}>
            <Box>
                <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Google Maps</Typography>   
                {/* <Button onClick={() => printPopperRefs()}>Print</Button>          */}
                <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
                <GMapLegends/>

                <Statistics/>

                {markers.length > 0 && (
                    markers.map((marker) => {
                        return marker
                    })
                )}
            </Box>

            


        // </Paper>
    )
}

export default GMap