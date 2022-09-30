import { Button } from "@mui/material";
import React from "react"
import OverlayView from "./OverlayView.component";

interface ICustomMarkerProps{
    label: string;
    map?: google.maps.Map;
    position: google.maps.LatLng;
    backgroundColor: string;
}

const CustomMarker: React.FC<ICustomMarkerProps> = ({label, map, position, backgroundColor}) => {

    
    return(
        <React.Fragment>
            {map && (
                <OverlayView
                    position={position}
                    map={map}
                    pane={"floatPane"}

                >
                    <Button variant="contained" sx={{transform: 'translate(-50%, -100%)', borderRadius: 8, backgroundColor: backgroundColor}}>{label}</Button>
                </OverlayView>
            )}
        </React.Fragment>
    )
}

export default CustomMarker