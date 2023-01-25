import React from "react"

import OverlayView from "./OverlayView.component";




interface ICustomMarkerProps{
    map?: google.maps.Map;
    position: google.maps.LatLng;
    center: boolean;
    children: React.ReactNode

}

const CustomMarker: React.FC<ICustomMarkerProps> = ({map, position, center, children}) => {



    return(
        <div>
            {map && (
                    <OverlayView
                        position={position}
                        map={map}
                        pane={"floatPane"}
                    >
                        {center === true
                        ? 
                        <div style={{transform: 'translate(-50%, -50%)'}}>
                            {children}
                        </div>
                        : 
                        <div style={{transform: 'translate(-50%, -100%)'}}>
                            {children}
                        </div>
                         }
                        
                    </OverlayView>
                    
            )}
        </div>
    )
}

export default CustomMarker