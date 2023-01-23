import { Button } from "@mui/material";


export enum EAddressMarkerType{
    DEP_RET,
    ADDRESS,
    TOLL
}

interface IAddressMarker{
    label: string,
    markerType: EAddressMarkerType;
}

const AddressMarker: React.FC<IAddressMarker> = ({label, markerType}) => {

    function getMarkerColor(markerType: EAddressMarkerType)
    {
        if(markerType === EAddressMarkerType.DEP_RET)
        {
            return "green"
        }
        else if(markerType === EAddressMarkerType.ADDRESS)
        {
            return "primary"
        }
        else
        {
            return "#cf0000"
        }
    }

    return (
        <Button variant="contained" sx={{borderRadius: 8, backgroundColor: getMarkerColor(markerType)}}>{label}</Button>

    )
}

export default AddressMarker