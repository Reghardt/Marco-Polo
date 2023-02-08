import { useRef } from "react"
import { useMapsStore } from "../../Zustand/mapsStore"

// const options: google.maps.places.AutocompleteOptions = {
//     componentRestrictions: {country: "ZA"},
//     bounds: {north: -21.7, south: -35.3, east: 33.05, west: 15.91},
//     strictBounds: true,
//     fields: ["formatted_address", "geometry"],
    
// }

const GProgrammaticAutoComplete: React.FC = () => {



    const autoCompleteService = useRef(new google.maps.places.AutocompleteService())


    async function getPlacePredictions()
    {

        const autoReq: google.maps.places.AutocompletionRequest = {
            input: "",
            sessionToken: new google.maps.places.AutocompleteSessionToken(),
            bounds: {north: -21.7, south: -35.3, east: 33.05, west: 15.91},
            componentRestrictions: {country: "ZA"},
        }

        const response = await autoCompleteService.current.getPlacePredictions(autoReq)
        console.log(response.predictions)

        const placeService = new google.maps.places.PlacesService(useMapsStore.getState().data.map!);
        placeService.getDetails({placeId: response.predictions[0]!.place_id, fields: ["formatted_address", "geometry"]}, (res, status) => {
            console.log(res, status)
            
            // google.maps.places.PlacesServiceStatus.
            // if(res)
            // {
            //     res.formatted_address
            // }
        })

    }
    

    return(
        <div>
            <button onClick={() => getPlacePredictions()}>Press me to auto complete</button>
        </div>
    )
}

export default GProgrammaticAutoComplete