import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { RSAddresColumIndex, RSTripRows, RSInSequenceTripRows, RSShortestTripDirections, RSOriginalTripDirections, RSPreserveViewport, RSDepartureAddress, RSReturnAddress, RSRouteToDisplay } from "../../state/globalstate";
import { createCustomMapMarkers, EDisplayRoute } from "./GMap.service"


const GMap: React.FC = () => {

    const [R_shortestTripDirections, R_setShortestTripDirections] = useRecoilState(RSShortestTripDirections)
    const [R_originalTripDirections, R_setOriginalTripDirections] = useRecoilState(RSOriginalTripDirections)
    
    const map = useRef<google.maps.Map>()
    // const directionsService = useRef<google.maps.DirectionsService>()
    const fastestRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()
    const originalRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const [R_routeToDisplay, R_setRouteToDisplay] = useRecoilState(RSRouteToDisplay)

    const R_tripRows = useRecoilValue(RSTripRows)
    const R_inSequenceTripRows = useRecoilValue(RSInSequenceTripRows)

    const R_addresColumIndex = useRecoilValue(RSAddresColumIndex)
    const [markers, setMarkers] = useState<JSX.Element[]>([])

    const R_preserveViewport = useRecoilValue(RSPreserveViewport)

    const R_departureAddress = useRecoilValue(RSDepartureAddress);
    const R_returnAddress = useRecoilValue(RSReturnAddress);

    useEffect(() => {
        //setMarkers(createMapMarkers(R_jobBody, markers, R_addresColumIndex, map))
        if(R_routeToDisplay === EDisplayRoute.Fastest)
        {
            setMarkers(createCustomMapMarkers(R_inSequenceTripRows, R_addresColumIndex, map, R_routeToDisplay, R_departureAddress, R_returnAddress))
        }
        else
        {
            setMarkers(createCustomMapMarkers(R_tripRows, R_addresColumIndex, map, R_routeToDisplay, R_departureAddress, R_returnAddress))
        } 
    }, [R_tripRows, R_inSequenceTripRows, R_addresColumIndex, R_routeToDisplay, R_departureAddress, R_returnAddress])

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        
        // directionsService.current = new google.maps.DirectionsService();
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
    }, [])

    useEffect(() => {
        if(R_shortestTripDirections && R_originalTripDirections && R_shortestTripDirections.status === "OK" && R_originalTripDirections.status === "OK")
        {
                handleRouteToDisplay(R_routeToDisplay, R_preserveViewport)     
        }
        else
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            originalRouteDirectionsRenderer.current.setMap(null)
        }
    }, [R_shortestTripDirections, R_originalTripDirections])

    function handleRouteToDisplay(value: EDisplayRoute, preserveViewport: boolean)
    {
        if(value === EDisplayRoute.Fastest && R_shortestTripDirections)
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: preserveViewport,
            directions: R_shortestTripDirections.result
            })
            originalRouteDirectionsRenderer.current.setMap(null)
            R_setRouteToDisplay(value)
        }
        else if(value === EDisplayRoute.Original && R_originalTripDirections)
        {
            originalRouteDirectionsRenderer.current.setMap(null)
            originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: preserveViewport,
            directions: R_originalTripDirections.result
            })
            fastestRouteDirectionsRenderer.current.setMap(null)
            R_setRouteToDisplay(value)
        }
    }
    

    return(
        <Paper sx={{padding: "0.3em", marginTop: "0.3em"}} variant="elevation" elevation={5}>

            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}} >Google Maps</Typography>

            <Stack direction={"row"} spacing={1} alignItems="center" sx={{marginBottom: "1em"}}>
                <Box>
                    <ToggleButtonGroup
                        sx={{maxHeight:"100%", height: "100%"}}
                        size="small"
                        color="primary"
                        value={R_routeToDisplay}
                        exclusive
                        onChange={(_e, v) => {handleRouteToDisplay(v, true)}}
                        aria-label="Address Type"
                        >
                        <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EDisplayRoute.Fastest}>Fastest Route</ToggleButton>
                        <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EDisplayRoute.Original}>Original Route</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Stack>
            <Paper style={{width: "100%", height: 500}} id="map"></Paper>

            {markers.length > 0 && (
                markers.map((marker) => {
                    return marker
                })
            )}
        </Paper>
    )
}

export default GMap