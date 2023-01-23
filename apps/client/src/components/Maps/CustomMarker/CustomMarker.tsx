import React from "react"

import OverlayView from "./OverlayView.component";




interface ICustomMarkerProps{
    map?: google.maps.Map;
    position: google.maps.LatLng;
    children: React.ReactNode
    // markerRowNumber: number;
}

const CustomMarker: React.FC<ICustomMarkerProps> = ({map, position, children}) => {



    return(
        <div>
            {map && (
                    <OverlayView
                        position={position}
                        map={map}
                        pane={"floatPane"}
                    >
                        <div style={{transform: 'translate(-50%, -100%)'}}>
                            {children}
                        </div>
                    </OverlayView>
                    
            )}
        </div>
    )
}

export default CustomMarker