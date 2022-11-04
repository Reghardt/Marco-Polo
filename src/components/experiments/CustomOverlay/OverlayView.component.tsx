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
    console.log("Overlay view fired")

    const container = useMemo(() => {
        const div = document.createElement('div')
        div.style.position = 'absolute'
        div.style.zIndex = `${zIndex}`
        return div
    }, [zIndex])

    const overlay = useMemo(() => {
        return new CustomOverlay(container, pane, position)   
    }, [container, pane, position])

    useEffect(() => {
        overlay?.setMap(map)
        return () => { //TODO read up on cleanup functions for use effect
            overlay?.setMap(null)
        }
    }, [map, overlay])

    // useEffect(() => {
    //     container.style.zIndex = `${zIndex}`
    // }, [zIndex, container])

    return createPortal(children, container) //what is create portal?
}

export default OverlayView