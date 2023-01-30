import { Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTripStore } from "../../Zustand/tripStore";
import { createCustomMapMarkers, createMarker} from "../../Services/GMap.service";
// import GMapLegends from "./GMapLegends.component";
import { tolls } from "./Tolls";
import TollMarker from "./CustomMarker/TollMarker";
import { createPortal } from "react-dom";
import LegsListControl from "./LegsListControl.component";
import { useMapsStore } from "../../Zustand/mapsStore";

const GMap: React.FC = () => {

    const ZF_setMap = useMapsStore(state => state.actions.setMap)
    const Z_map = useMapsStore(state => state.data.map)

    const Z_tripDirections = useTripStore(state => state.data.tripDirections)
    const Z_tripRows = useTripStore(state => state.data.rows)
    const Z_addresColumIndex = useTripStore(state => state.data.addressColumnIndex)
    const Z_linkAddressColumnIndex = useTripStore(state => state.data.linkAddressColumnIndex)
    const Z_departureAddress = useTripStore(state => state.data.departureAddress)
    const Z_returnAddress = useTripStore(state => state.data.returnAddress)

    const controlContainer = useRef<HTMLDivElement | null>(null)

    //Creates map on mount and sets it in the maps store
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8, disableDoubleClickZoom: true});
        
        controlContainer.current = document.createElement("div");
        controlContainer.current.style.marginLeft = '10px';
        map.controls[google.maps.ControlPosition.LEFT_TOP]?.push(controlContainer.current)

        ZF_setMap(map)
    }, [])


    return(
        <>
            <div className={"py-2"}>
                {/* <button onClick={() => {clearPolyLinesFromMap()}}>Clear</button> */}

                <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
                {/* <GMapLegends/> */}

                {tolls.map((toll) => {
                    const tollMarkers: JSX.Element[] = []
                    for(let i = 0; i < toll.gateSection.length; i++)
                    {
                        tollMarkers.push(
                            createMarker(
                                toll.name + `-${i}`,  
                                Z_map,
                                toll.gateSection[i]!.coordinates, 
                                <TollMarker toll={toll} gateSectionIndex={i}/>,
                                true
                            )
                        )
                    }
                    return tollMarkers
                    
                })}

                {createCustomMapMarkers(Z_tripRows, Z_map, Z_addresColumIndex, Z_linkAddressColumnIndex, Z_departureAddress, Z_returnAddress)}
                {controlContainer.current && Z_tripDirections && Z_tripDirections.legGroups.length > 0 && createPortal(<><LegsListControl mouldedDirections={Z_tripDirections}/></>, controlContainer.current)}
            </div>
        </>
    )
        

}

export default GMap