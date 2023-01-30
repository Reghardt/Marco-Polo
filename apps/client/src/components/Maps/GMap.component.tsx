import { Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTripStore } from "../../Zustand/tripStore";
import { createCustomMapMarkers, createMarker} from "../../Services/GMap.service";
// import GMapLegends from "./GMapLegends.component";
import { tolls } from "./Tolls";
import TollMarker from "./CustomMarker/TollMarker";
import { createPortal } from "react-dom";
import LegsListControl from "./LegsListControl.component";
import { useMapsStore } from "../../Zustand/mapsStore";

enum ETollVisibility{
    ALL = 1,
    NONE = 2,
    PASSTHROUGH = 3
}

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

    const [tollVisibility, setTolVisibility] = useState<ETollVisibility>(ETollVisibility.NONE)

    //Creates map on mount and sets it in the maps store
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8, disableDoubleClickZoom: true});
        
        controlContainer.current = document.createElement("div");
        controlContainer.current.style.marginLeft = '10px';
        map.controls[google.maps.ControlPosition.LEFT_TOP]?.push(controlContainer.current)

        ZF_setMap(map)
    }, [])

    function createTollMarkers(visibility: ETollVisibility)
    {
        if(visibility === ETollVisibility.ALL)
        {
            return tolls.map((toll) => {
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
                
            })
        }
        else if(visibility === ETollVisibility.PASSTHROUGH)
        {
            if(Z_tripDirections?.legGroups && Z_tripDirections.legGroups.length)
            {
                const tollMarkers: JSX.Element[] = []
                let counter = 0;
                Z_tripDirections.legGroups.forEach((legGroup) => {
                    legGroup.legs.forEach((leg) => {
                        leg.passThroughTolls.forEach(tollAndGateIndex => {
                            tollMarkers.push(
                                createMarker(
                                    tollAndGateIndex.toll.name + "-"+ counter++,  
                                    Z_map,
                                    tollAndGateIndex.toll.gateSection[tollAndGateIndex.gateIndex]!.coordinates, 
                                    <TollMarker toll={tollAndGateIndex.toll} gateSectionIndex={tollAndGateIndex.gateIndex}/>,
                                    true
                                )
                            )
                                    
                        })
                    })
                    
                })
                return tollMarkers
            }
            else
            {
                return <></>
            }
        }
        else
        {
            return <></>
        }
    }


    return(
        <>
            <div className={"py-2"}>
                {/* <button onClick={() => {clearPolyLinesFromMap()}}>Clear</button> */}

                <Paper style={{width: "100%", height: "33em", marginBottom: "0.5em"}} id="map"></Paper>
                {/* <GMapLegends/> */}

                {/* {tolls.map((toll) => {
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
                    
                })} */}
                {/* <button onClick={() => {setTolVisibility(ETollVisibility.ALL)}}>All</button>
                <button onClick={() => {setTolVisibility(ETollVisibility.PASSTHROUGH)}}>Passthrough</button>
                <button onClick={() => {setTolVisibility(ETollVisibility.NONE)}}>None</button> */}

                <div className={"flex flex-wrap space-x-2"}>
                    <div>
                        <input name="checkAll" type={"checkbox"} checked={tollVisibility === ETollVisibility.ALL} onChange={(change) => {if(change.target.checked){setTolVisibility(ETollVisibility.ALL)} }}/>
                        <label htmlFor="checkAll"> All</label>
                    </div>

                    <div>
                        <input name="Passthrough" type={"checkbox"} checked={tollVisibility === ETollVisibility.PASSTHROUGH} onChange={(change) => {if(change.target.checked){setTolVisibility(ETollVisibility.PASSTHROUGH)} }} />
                        <label htmlFor="Passthrough"> Passthrough</label>
                    </div>

                    <div>
                        <input name="None" type={"checkbox"} checked={tollVisibility === ETollVisibility.NONE} onChange={(change) => {if(change.target.checked){setTolVisibility(ETollVisibility.NONE)} }}/>
                        <label htmlFor="None"> None</label>
                    </div>
                </div>







                {createTollMarkers(tollVisibility)}

                {createCustomMapMarkers(Z_tripRows, Z_map, Z_addresColumIndex, Z_linkAddressColumnIndex, Z_departureAddress, Z_returnAddress)}
                {controlContainer.current && Z_tripDirections && Z_tripDirections.legGroups.length > 0 && createPortal(<><LegsListControl mouldedDirections={Z_tripDirections}/></>, controlContainer.current)}
            </div>
        </>
    )
        

}

export default GMap