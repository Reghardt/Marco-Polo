
enum ETollType{
    MAINLINE = 1,
    RAMP = 2
}

interface IGateSection{coordinates: google.maps.LatLng, type: ETollType, tarrif: {c1: number, c2: number, c3: number, c4: number}, nameExtention: string};

export interface IToll{
    name: string;
    gateSection: IGateSection[];
}

export const tolls: IToll[] = [
    {
        name: "BAOBAB",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-22.64713239980734, 29.91811059604816), 
                type: ETollType.MAINLINE, 
                tarrif: {c1: 50.50, c2: 137.00, c3: 189.00, c4: 227.00},
                nameExtention: ""
            }
        ]
    },
    {
        name: "BAOBAB",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-23.36828254780838, 29.773856923204086), 
                type: ETollType.MAINLINE, 
                tarrif: {c1: 52.00, c2: 143.00, c3: 167.00, c4: 209.00},
                nameExtention: ""
            }
        ],
    },
    {
        name: "NYL",
        gateSection: [
            {coordinates: new google.maps.LatLng(-24.289843799511786, 28.979551201472905), type: ETollType.MAINLINE, tarrif: {c1: 65.00, c2: 122.00, c3: 147.00, c4: 197.00}, nameExtention: ""},
            {coordinates: new google.maps.LatLng(-24.28944213685294, 28.979562884786553), type: ETollType.RAMP, tarrif: {c1: 65.00, c2: 122.00, c3: 147.00, c4: 197.00}, nameExtention: " - N Ramp"},
            {coordinates: new google.maps.LatLng(-24.28975560445829, 28.97992262295386), type: ETollType.RAMP, tarrif: {c1: 65.00, c2: 122.00, c3: 147.00, c4: 197.00},nameExtention: " - S Ramp"}],
    },

    {
        name: "KRANSKOP",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-24.776969558177445, 28.474688371495883), 
                type: ETollType.MAINLINE, tarrif: {c1: 50.50, c2: 128.00, c3: 171.00, c4: 210.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-24.777949861516966, 28.472453737675657), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 37.00, c3: 44.00, c4: 66.00}, 
                nameExtention: " - Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-24.778908355269362, 28.47401865602787), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 37.00, c3: 44.00, c4: 66.00}, 
                nameExtention: " - Ramp"
            }
        ],
    },

    {
        name: "CAROUSEL",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.325012122944962, 28.297733451410945), 
                type: ETollType.MAINLINE, tarrif: {c1: 62.00, c2: 167.00, c3: 184.00, c4: 213.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.325025457351536, 28.29796546247189), 
                type: ETollType.MAINLINE, tarrif: {c1: 62.00, c2: 167.00, c3: 184.00, c4: 213.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "PUMULANI",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.63983331591996, 28.27532297828632), 
                type: ETollType.MAINLINE, tarrif: {c1: 13.50, c2: 34.00, c3: 39.00, c4: 47.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.639843592831664, 28.275638808372168), 
                type: ETollType.MAINLINE, tarrif: {c1: 13.50, c2: 34.00, c3: 39.00, c4: 47.00}, 
                nameExtention: ""
            },
        ],
    },


]

