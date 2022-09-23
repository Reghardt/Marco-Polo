import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil";
import { IRouteResult } from "../../interfaces/simpleInterfaces";
import { RSAddresColumIndex, RSDepartReturnState, RSDepartureAddress, RSJobBody, RSReturnAddress } from "../../state/globalstate";
import { createCustomMapMarkers, createMapMarkers, EDisplayRoute } from "./GMap.service"

interface IGMapsProps{
    fastestRouteResult: IRouteResult
    originalRouteResult: IRouteResult
    waypointOrder: number[]
}

const GMap: React.FC<IGMapsProps> = ({fastestRouteResult, originalRouteResult, waypointOrder}) => {

    const map = useRef<google.maps.Map>()
    // const directionsService = useRef<google.maps.DirectionsService>()
    const fastestRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()
    const originalRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const [routeToDisplay, setRouteToDisplay] = useState<EDisplayRoute>(EDisplayRoute.Fastest)

    const R_jobBody = useRecoilValue(RSJobBody)
    const R_addresColumIndex = useRecoilValue(RSAddresColumIndex)
    const [markers, setMarkers] = useState<JSX.Element[]>([])

    useEffect(() => {
        //setMarkers(createMapMarkers(R_jobBody, markers, R_addresColumIndex, map))
        setMarkers(createCustomMapMarkers(R_jobBody, R_addresColumIndex, map, routeToDisplay, waypointOrder))
        
    }, [R_jobBody, R_addresColumIndex, routeToDisplay, waypointOrder])

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        
        // directionsService.current = new google.maps.DirectionsService();
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
    }, [])

    useEffect(() => {
        if(fastestRouteResult && originalRouteResult && fastestRouteResult.status === "OK" && originalRouteResult.status === "OK")
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            originalRouteDirectionsRenderer.current.setMap(null)

            fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            directions: fastestRouteResult.result
            })
            originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            directions: originalRouteResult.result
            })
            fastestRouteDirectionsRenderer.current.setMap(map.current)
            originalRouteDirectionsRenderer.current.setMap(null)

        }
        else
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            originalRouteDirectionsRenderer.current.setMap(null)
        }
    }, [fastestRouteResult, originalRouteResult])

    function handleRouteToDisplay(value: EDisplayRoute)
    {
        if(value === EDisplayRoute.Fastest)
        {
            fastestRouteDirectionsRenderer.current.setMap(null)
            fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: true,
            directions: fastestRouteResult.result
            })
            originalRouteDirectionsRenderer.current.setMap(null)
            setRouteToDisplay(value)
        }
        else if(value === EDisplayRoute.Original)
        {
            originalRouteDirectionsRenderer.current.setMap(null)
            originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: true,
            preserveViewport: true,
            directions: originalRouteResult.result
            })
            fastestRouteDirectionsRenderer.current.setMap(null)
            setRouteToDisplay(value)
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
                        value={routeToDisplay}
                        exclusive
                        onChange={(_e, v) => {handleRouteToDisplay(v)}}
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