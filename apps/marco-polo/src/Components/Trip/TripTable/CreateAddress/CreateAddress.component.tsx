import { Button, FormControlLabel, Switch, } from "@mui/material"
import GAutoComplete from "../../../Experiments/GAutoComplete.component";
import { useState } from "react";
import { IAddress } from "../../../common/CommonInterfacesAndEnums";
import { addCustomRow } from "../../../../Services/Trip.service";
import { useMapsStore } from "../../../../Zustand/mapsStore";
import { createMarker } from "../../../../Services/GMap.service";
import AddressMarker, { EAddressMarkerType } from "../../../Maps/CustomMarker/AddressMarker";

const CreateAddress: React.FC = () => {

    const ZOOM_LEVEL = 11

    const [newAddress, setNewAddress] = useState<{address: IAddress, marker: JSX.Element} | null>(null)
    const [newLinkAddress, setNewLinkAddress] = useState<{address: IAddress, marker: JSX.Element} | null>(null)

    const [isLinkEnabled, setIsLinkEnabled] = useState(false)
    const Z_map = useMapsStore(state => state.data.map)

    function handleSetNewAddress(address: IAddress | null)
    {
        if(address)
        {
            let marker = <></>
            if(address.latLng)
            {
                Z_map?.panTo(address.latLng)
                Z_map?.setZoom(ZOOM_LEVEL)
                marker = createMarker(
                    "new-address" + Math.random(),  
                    Z_map,
                    address.latLng, 
                    <AddressMarker label="A" markerType={EAddressMarkerType.CUSTOM} popperData={null}/>,
                    true
                )
                
            }

            setNewAddress({address: address, marker: marker})
        }
        else
        {
            setNewAddress(current => {
                if(current)
                {
                    return {address: current?.address, marker: <></>}
                }
                else
                {
                    return null
                }
                
            })
        }
    }

    function handleSetNewLinkAddress(address: IAddress | null)
    {
        if(address)
        {
            
            let marker = <></>
            if(address.latLng)
            {
                Z_map?.panTo(address.latLng)
                Z_map?.setZoom(ZOOM_LEVEL)
                marker = createMarker(
                    "new-address" + Math.random(),  
                    Z_map,
                    address.latLng, 
                    <AddressMarker label="LA" markerType={EAddressMarkerType.CUSTOM} popperData={null}/>,
                    true
                )
                
            }
            setNewLinkAddress({address: address, marker: marker})
        }
        else
        {
            setNewLinkAddress(current => {
                if(current)
                {
                    return {address: current?.address, marker: <></>}
                }
                else
                {
                    return null
                }
                
            })
        }
    }


    return(
        <>
            <div>
                <div className="text-sm">
                    Address:
                </div>
                <div>
                    <GAutoComplete setAddress={handleSetNewAddress} currentAddress={newAddress?.address?.formatted_address ? newAddress.address.formatted_address : ""}/>
                </div>
            </div>

            <div className="pl-2 ">
                <FormControlLabel sx={{}} control={<Switch size="small" value={isLinkEnabled} onChange={(change) => {
                    if(change.target.checked === false)
                    {
                        setNewLinkAddress(null)
                    }
                    setIsLinkEnabled(change.target.checked)
                    }} />} label={<div className="text-sm ">Has Link Address</div>} />
            </div>

            {isLinkEnabled && (
                <div>
                    <div className="text-sm">
                        Link Address:
                    </div>
                    <div>
                        <GAutoComplete setAddress={handleSetNewLinkAddress} currentAddress={newLinkAddress?.address?.formatted_address ? newLinkAddress.address.formatted_address : ""}/>
                    </div>
                </div>
            )}

            <div className="mt-2">
                <Button variant="contained" onClick={() => {
                        if(newAddress)
                        {
                            console.log(newAddress, newLinkAddress)
                            addCustomRow(newAddress.address, newLinkAddress ? newLinkAddress.address : null)
                            setNewAddress(null)
                            setNewLinkAddress(null)
                        }
                        else
                        {
                            
                        }
                        
                    }}
                >Add</Button>
            </div>

            {newAddress?.marker && (
                <>{newAddress.marker}</>
            )}

            {newLinkAddress?.marker && (
                <>{newLinkAddress.marker}</>
            )}
        </>
    )
}

export default  CreateAddress