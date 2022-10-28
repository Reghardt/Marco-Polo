import { Paper, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil";
import { RSAddresColumnIndex, RSTripRows, RSTripDirections, RSPreserveViewport, RSDepartureAddress, RSReturnAddress } from "../../state/globalstate";
import Statistics from "../Statistics/Statistics.component";
import { createCustomMapMarkers } from "./GMap.service"
import GMapLegends from "./GMapLegends.component";


const GMap: React.FC = () => {

    const R_tripDirections = useRecoilValue(RSTripDirections)
    
    const map = useRef<google.maps.Map>()
    // const directionsService = useRef<google.maps.DirectionsService>()
    const fastestRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()
    const originalRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const R_tripRows = useRecoilValue(RSTripRows)

    const R_addresColumIndex = useRecoilValue(RSAddresColumnIndex)
    const [markers, setMarkers] = useState<JSX.Element[]>([])

    const R_preserveViewport = useRecoilValue(RSPreserveViewport)

    const R_departureAddress = useRecoilValue(RSDepartureAddress);
    const R_returnAddress = useRecoilValue(RSReturnAddress);

    useEffect(() => {

        setMarkers(createCustomMapMarkers(R_tripRows, R_addresColumIndex, map, R_departureAddress, R_returnAddress))
        
    }, [R_tripRows, R_addresColumIndex, R_departureAddress, R_returnAddress])

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        
        // directionsService.current = new google.maps.DirectionsService();
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
    }, [])

    useEffect(() => {
        if(R_tripDirections && R_tripDirections.status === "OK")
        {
                handleRouteToDisplay(R_preserveViewport)     
        }
        else
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            originalRouteDirectionsRenderer.current.setMap(null)
        }
    }, [R_tripDirections])

    function handleRouteToDisplay(preserveViewport: boolean)
    {
        if(R_tripDirections)
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: preserveViewport,
            directions: R_tripDirections.result
            })
            originalRouteDirectionsRenderer.current.setMap(null)
        }

    }
    

    return(
        <Paper sx={{padding: "0.3em", marginTop: "0.3em"}} variant="elevation" elevation={5}>

            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}} >Google Maps</Typography>            
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