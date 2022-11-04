import { Box, Button, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { Instance } from "@popperjs/core";
import React from "react"
import { useRecoilState } from "recoil";
import { RMapPopperStates } from "../../../state/globalstate";
import { EMapPopperStates } from "../../Maps/GMap.component";
import MapTooltip from "./MapTooltip.component";
import OverlayView from "./OverlayView.component";

export enum EMarkerType{
    DEP_RET,
    ADDRESS
}

interface ICustomMarkerProps{
    label: string;
    map?: google.maps.Map;
    position: google.maps.LatLng;
    markerType: EMarkerType;
    markerRowNumber: number;
}

const CustomMarker = React.forwardRef<Instance, ICustomMarkerProps>(({label, map, position, markerType, markerRowNumber} , popperRef) => {

    // const [open, setOpen] = useState(false)

    //const popperRef = React.useRef<Instance>(null);
    const areaRef = React.useRef<any>(null);

    const [R_mapPopperStates, R_setMapPopperStates] = useRecoilState(RMapPopperStates)

    function handlePopperVisibility()
    {
        console.log("handle popper vis fired")
        R_setMapPopperStates((states) => {
            const newMapPopperStates = states.map(() => EMapPopperStates.CLOSE)
            console.log("original states", states)
            if(states[markerRowNumber] === EMapPopperStates.CLOSE)
            {
                newMapPopperStates[markerRowNumber] = EMapPopperStates.OPEN
                console.log("new vis state", newMapPopperStates)
                return newMapPopperStates
            }
            else
            {
                console.log("new vis state", newMapPopperStates)
                return newMapPopperStates
            }
        })
    }

    function getMarkerColor(markerType: EMarkerType)
    {
        if(markerType === EMarkerType.DEP_RET)
        {
            return "green"
        }
        else
        {
            return "primary"
        }
    }

        const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
            [`& .${tooltipClasses.arrow}`]: {
                color: '#585858',
              },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: '#ffffff',
                color: 'rgba(0, 0, 0, 0.87)',
                maxWidth: 220,
                fontSize: theme.typography.pxToRem(12),
                border: '1px solid #4b4b4b',
            },
        }));


    return(
        <Box>
            {map && (
                    <OverlayView
                        position={position}
                        map={map}
                        pane={"floatPane"}

                    >
                        <CustomTooltip enterNextDelay={0} enterDelay={0} leaveDelay={0} arrow open={R_mapPopperStates[markerRowNumber] === EMapPopperStates.OPEN ? true : false} title={<MapTooltip markerRowNumber={markerRowNumber} handlePopperVisibility={handlePopperVisibility}/>}
                            PopperProps={{
                                popperRef,
                                anchorEl: {
                                    getBoundingClientRect: () => {
                                        return new DOMRect(
                                        areaRef.current!.getBoundingClientRect().x,
                                        areaRef.current!.getBoundingClientRect().y,
                                        areaRef.current!.getBoundingClientRect().width,
                                        areaRef.current!.getBoundingClientRect().height,
                                        );
                                    },
                                }
                            }}
                        >
                            <Button ref={areaRef} onClick={() => {handlePopperVisibility()}}  variant="contained" sx={{transform: 'translate(-50%, -100%)', borderRadius: 8, backgroundColor: getMarkerColor(markerType)}}>{label}</Button>
                        </CustomTooltip>
                    </OverlayView>
                    
            )}
        </Box>
    )
})

export default CustomMarker