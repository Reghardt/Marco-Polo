import { useEffect, useRef } from "react"
import { EAddressSolveStatus, IAddress } from "../common/CommonInterfacesAndEnums"

const options: google.maps.places.AutocompleteOptions = {
    componentRestrictions: {country: "ZA"},
    bounds: {north: -21.7, south: -35.3, east: 33.05, west: 15.91},
    strictBounds: true,
    //fields: ["formatted_address", "geometry"],
    
}

interface IGAutoComplete{
    setAddress: (address: IAddress) => void,
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
                console.log(place.geometry?.location)
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
            defaultValue={currentAddress}
            placeholder="Enter a address, name or location"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></input>
        </div>
    )
}

export default GAutoComplete