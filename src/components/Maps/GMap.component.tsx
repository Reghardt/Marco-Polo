import { Button, Paper, Typography } from "@mui/material"
import { Instance } from "@popperjs/core";
import React, { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { RSAddresColumnIndex, RSTripRows, RSTripDirections, RSPreserveViewport, RSDepartureAddress, RSReturnAddress, RMapPopperStates } from "../../state/globalstate";
import Statistics from "../Statistics/Statistics.component";
import { createCustomMapMarkers } from "./GMap.service"
import GMapLegends from "./GMapLegends.component";

export enum EMapPopperStates{
    CLOSE,
    OPEN,
    RESUME
}

const GMap: React.FC = () => {

    const R_tripDirections = useRecoilValue(RSTripDirections)
    
    const map = useRef<google.maps.Map>()

    const popperRefs = useRef<Array<Instance | null>>([])
    // const directionsService = useRef<google.maps.DirectionsService>()
    const fastestRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()
    const originalRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const R_tripRows = useRecoilValue(RSTripRows)

    const R_addresColumIndex = useRecoilValue(RSAddresColumnIndex)
    const [markers, setMarkers] = useState<JSX.Element[]>([])

    const R_preserveViewport = useRecoilValue(RSPreserveViewport)

    const R_departureAddress = useRecoilValue(RSDepartureAddress);
    const R_returnAddress = useRecoilValue(RSReturnAddress);

    const [, R_setMapPopperStates] = useRecoilState(RMapPopperStates)
    //const [, R_setMapPopperStates] = useRecoilState(RMapPopperStates)

    useEffect(() => {
        popperRefs.current = popperRefs.current.slice(0, R_tripRows.length) //creates new refs array?

        R_setMapPopperStates(() => {
            return R_tripRows.map(() => {
                return EMapPopperStates.CLOSE
            })
        })
        
        setMarkers(createCustomMapMarkers(R_tripRows, R_addresColumIndex, map, R_departureAddress, R_returnAddress, popperRefs))
        console.log(popperRefs)
        for(let i = 0; i < popperRefs.current.length; i++)
        {
            popperRefs.current[i]?.update()
        }
    }, [R_tripRows, R_addresColumIndex, R_departureAddress, R_returnAddress])

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
        if(R_tripDirections && R_tripDirections.status === "OK")
        {
            handleRouteToDisplay(R_preserveViewport)     
        }
        else
        {
            fastestRouteDirectionsRenderer?.current?.setMap(null)
            originalRouteDirectionsRenderer?.current?.setMap(null)
        }
    }, [R_tripDirections])

    function handleRouteToDisplay(preserveViewport: boolean)
    {
        if(R_tripDirections)
        {
            fastestRouteDirectionsRenderer?.current?.setMap(null)
            fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: preserveViewport,
            directions: R_tripDirections.result
            })
            originalRouteDirectionsRenderer?.current?.setMap(null)
        }

    }

    function printPopperRefs()
    {
        console.log(popperRefs.current)
    }
    

    return(
        <Paper sx={{padding: "0.3em", marginTop: "0.3em"}} variant="elevation" elevation={5}>

            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Google Maps</Typography>   
            <Button onClick={() => printPopperRefs()}>Print</Button>         
            <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
            <GMapLegends/>

            <Statistics/>

            {markers.length > 0 && (
                markers.map((marker) => {
                    return marker
                })
            )}


        </Paper>
    )
}

export default GMap