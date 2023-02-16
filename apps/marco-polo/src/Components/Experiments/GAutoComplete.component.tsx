import { useEffect, useRef } from "react"
import { EAddressSolveStatus, IAddress } from "../common/CommonInterfacesAndEnums"

const options: google.maps.places.AutocompleteOptions = {
    componentRestrictions: {country: "ZA"},
    bounds: {north: -21.7, south: -35.3, east: 33.05, west: 15.91},
    strictBounds: true,
    fields: ["formatted_address", "geometry", "place_id"],
    
}

interface IGAutoComplete{
    setAddress: (address: IAddress | null) => void,
    currentAddress: string
}

const GAutoComplete: React.FC<IGAutoComplete> = ({setAddress, currentAddress}) => {

    const autoCompleteRef = useRef<HTMLInputElement>(null)

    // const [textBoxValue, setTextBoxValue] = useState(currentAddress)

    useEffect(() => {
        if(autoCompleteRef.current)
        {
            autoCompleteRef.current.value = currentAddress
        }
       
    }, [currentAddress])

    useEffect(() => {
        if(autoCompleteRef.current)
        {
            const autoComplete = new google.maps.places.Autocomplete(autoCompleteRef.current, options);
            autoComplete.addListener("place_changed", () => {
                
                const place = autoComplete.getPlace()
                console.log(place)
                if(place.formatted_address && place.geometry?.location && place.place_id)
                {
                    setAddress({formatted_address: place.formatted_address, latLng: place.geometry.location, solveStatus: EAddressSolveStatus.OK, isAddressAccepted: true, placeId: place.place_id })
                }
                else
                {
                    setAddress( {formatted_address: "", latLng: null, solveStatus: EAddressSolveStatus.UNKNOWN_ERROR, isAddressAccepted: false, placeId: ""} )
                }
            })
        }
    }, [autoCompleteRef])

    return(
        <div>
            <input ref={autoCompleteRef} type="text" 

            onKeyDown={key => { //if backspace is pressed, clear address. This is to remove the marker on the map when the user starts to press backspace as to not get confused
                if(key.code === "Backspace")
                {
                    setAddress(null)
                }
            }}
            defaultValue={currentAddress}
            placeholder="Search Google Maps"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:outline-none "
            ></input>
        </div>
    )
}

export default GAutoComplete