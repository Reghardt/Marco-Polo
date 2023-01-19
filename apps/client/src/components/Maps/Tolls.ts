

interface IToll{
    name: string;
    coordinates: google.maps.LatLng;
    tarrif: {class1: number, class2: number, class3: number, class4: number}
}

export const tolls: IToll[] = [
    {
        name: "BAOBAB", 
        coordinates: new google.maps.LatLng({lat: -22.64622765519418, lng: 29.9180764}), //-22.64622765519418, 29.9180764
        tarrif: {class1: 50.50, class2: 137.00, class3: 189.00, class4: 227.00}
    },
    {
        name: "CAPRICORN", 
        coordinates: new google.maps.LatLng({lat: -23.36699706246948, lng: 29.774955626988874}), //-23.36699706246948, 29.774955626988874
        tarrif: {class1: 50.50, class2: 137.00, class3: 189.00, class4: 227.00}
    },
    {
        name: "NYL", 
        coordinates: new google.maps.LatLng({lat: -24.289633621836114, lng: 28.97962286245042}), //-24.289633621836114, 28.97962286245042
        tarrif: {class1: 50.50, class2: 137.00, class3: 189.00, class4: 227.00}
    },
    {
        name: "KRANSKOP", 
        coordinates: new google.maps.LatLng({lat: -24.751118394827017, lng: 28.468837726453117}), //-24.751118394827017, 28.468837726453117
        tarrif: {class1: 50.50, class2: 137.00, class3: 189.00, class4: 227.00}
    },
    {
        name: "CAROUSEL", 
        coordinates: new google.maps.LatLng({lat: -25.324745837525985, lng: 28.297665938521007 }), //-25.324745837525985, 28.297665938521007 
        tarrif: {class1: 50.50, class2: 137.00, class3: 189.00, class4: 227.00}
    },
    {
        name: "PUMULANI", 
        coordinates: new google.maps.LatLng({lat: -25.63953696321038, lng: 28.275417398049704}), //-25.63953696321038, 28.275417398049704
        tarrif: {class1: 50.50, class2: 137.00, class3: 189.00, class4: 227.00}
    }
]