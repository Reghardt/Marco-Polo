import { useEffect, useRef } from "react"

const options: google.maps.places.AutocompleteOptions = {
    componentRestrictions: {country: "ZA"},
    bounds: {north: -21.7, south: -35.3, east: 33.05, west: 15.91},
    strictBounds: true,
    fields: ["formatted_address", "geometry"],
    
}

const GAutoComplete: React.FC = () => {

    const autoCompleteRef = useRef<HTMLInputElement>(null)



    useEffect(() => {
        if(autoCompleteRef.current)
        {
            const autoComplete = new google.maps.places.Autocomplete(autoCompleteRef.current, options);
            autoComplete.addListener("place_changed", () => {
                const place = autoComplete.getPlace()
                console.log(place)
            })
        }
        
    }, [autoCompleteRef])

    

    return(
        <div>
            <input ref={autoCompleteRef} type="text" className="h-8 border-2 border-slate-200 w-80 bg-slate-50"></input>
        </div>
    )
}

export default GAutoComplete