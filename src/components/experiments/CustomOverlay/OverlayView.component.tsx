import React, { useEffect, useMemo } from "react"
import { createPortal } from "react-dom";
import { CustomOverlay } from "./CustomOverlay.class";

interface IOverlayViewProps{
    position: google.maps.LatLng;
    pane: keyof google.maps.MapPanes;
    map: google.maps.Map;
    zIndex?: number
}

const OverlayView: React.FC<IOverlayViewProps> = ({position, pane, map, zIndex, children}) => {
    const container = useMemo(() => {
        const div = document.createElement('div')
        div.style.position = 'absolute'
        return div
    }, [])

    const overlay = useMemo(() => {
        return new CustomOverlay(container, pane, position)   
    }, [container, pane, position])

    useEffect(() => {
        // console.log("Map set")
        overlay?.setMap(map)
        return () => { //TODO read up on cleanup functions for use effect
            // console.log("set to null")
            overlay?.setMap(null)
        }
    }, [map, overlay])

    useEffect(() => {
        container.style.zIndex = `${zIndex}`
    }, [zIndex, container])

    return createPortal(children, container) //what is create portal?
}

export default OverlayView