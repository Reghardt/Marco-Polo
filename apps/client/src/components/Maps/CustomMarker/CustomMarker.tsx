import { Box, Button} from "@mui/material";
import { Instance } from "@popperjs/core";
import React from "react"

import OverlayView from "./OverlayView.component";


export enum EMarkerType{
    DEP_RET,
    ADDRESS,
    TOLL
}

interface ICustomMarkerProps{
    label: string;
    map?: google.maps.Map;
    position: google.maps.LatLng;
    markerType: EMarkerType;
    // markerRowNumber: number;
}

const CustomMarker = React.forwardRef<Instance, ICustomMarkerProps>(({label, map, position, markerType} , _popperRef) => {

    const areaRef = React.useRef<any>(null);

    function getMarkerColor(markerType: EMarkerType)
    {
        if(markerType === EMarkerType.DEP_RET)
        {
            return "green"
        }
        else if(markerType === EMarkerType.ADDRESS)
        {
            return "primary"
        }
        else
        {
            return "#cf0000"
        }
    }

    return(
        <Box>
            {map && (
                    <OverlayView
                        position={position}
                        map={map}
                        pane={"floatPane"}
                    >
                        <Button ref={areaRef} variant="contained" sx={{transform: 'translate(-50%, -100%)', borderRadius: 8, backgroundColor: getMarkerColor(markerType)}}>{label}</Button>
                    </OverlayView>
                    
            )}
        </Box>
    )
})

export default CustomMarker