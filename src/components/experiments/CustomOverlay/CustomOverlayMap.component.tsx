import React, { useEffect, useRef, useState } from "react"
import CustomMarker from "./CustomMarker.component";
import { CustomOverlay } from "./CustomOverlay.class";



const CustomOverlayMap: React.FC = () => {

    const map = useRef<google.maps.Map>()
    const [markers, setMarkers] = useState<JSX.Element[]>([])
    const [pos, setPos] = useState(new google.maps.LatLng({lat: 62, lng: -150}))

    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: 62.28, lng: -150};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})

    }, [])

    function addMarkers()
    {
        if(markers.length > 0)
        {
            setMarkers([])
            return
        }
        
        let newMarkers: JSX.Element[] = []
        for(let i = 0; i < 3; i++)
        {
            newMarkers.push(<CustomMarker label={i.toString()} map={map.current} position={new google.maps.LatLng({lat: pos.lat(), lng: pos.lng() + i})} backgroundColor="blue" />)
        }
        setMarkers(newMarkers)
        //setPos(new google.maps.LatLng({lat: pos.lat(), lng: pos.lng() + 3}))
    }
    
    return(
        <div>
            <div style={{width: "100%", height: 500}} id="map"></div>
            <button onClick={() => {addMarkers()}}>Press me</button>

            {markers.length > 0 && (
                markers.map((marker) => {
                    return marker
                })
            )}
            
        </div>
    )
}

export default CustomOverlayMap