
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
        name: "Baobab",
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
        name: "Capricorn",
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
        name: "Sebetiela",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-24.16655562791549, 29.081228842689264), 
                type: ETollType.RAMP, 
                tarrif: {c1: 20.00, c2: 37.00, c3: 47.00, c4: 63.00},
                nameExtention: " - Ramp"
            }
        ],
    },
    {
        name: "Nyl",
        gateSection: [
            {coordinates: new google.maps.LatLng(-24.289843799511786, 28.979551201472905), type: ETollType.MAINLINE, tarrif: {c1: 65.00, c2: 122.00, c3: 147.00, c4: 197.00}, nameExtention: ""},
            {coordinates: new google.maps.LatLng(-24.28944213685294, 28.979562884786553), type: ETollType.RAMP, tarrif: {c1: 65.00, c2: 122.00, c3: 147.00, c4: 197.00}, nameExtention: " - N Ramp"},
            {coordinates: new google.maps.LatLng(-24.28975560445829, 28.97992262295386), type: ETollType.RAMP, tarrif: {c1: 65.00, c2: 122.00, c3: 147.00, c4: 197.00},nameExtention: " - S Ramp"}],
    },

    {
        name: "Kranskop",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-24.776969558177445, 28.474688371495883), 
                type: ETollType.MAINLINE, tarrif: {c1: 50.50, c2: 128.00, c3: 171.00, c4: 210.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-24.777949861516966, 28.472453737675657), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 37.00, c3: 44.00, c4: 66.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-24.778908355269362, 28.47401865602787), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 37.00, c3: 44.00, c4: 66.00}, 
                nameExtention: " - S Ramp"
            }
        ],
    },

    {
        name: "Maubane",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.281808487533873, 28.297236434418963), 
                type: ETollType.RAMP, tarrif: {c1: 27.00, c2: 72.00, c3: 80.00, c4: 92.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.282284335399773, 28.299159857563343), 
                type: ETollType.RAMP, tarrif: {c1: 27.00, c2: 72.00, c3: 80.00, c4: 92.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Carousel",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.325160250836824, 28.29773320678354), 
                type: ETollType.MAINLINE, tarrif: {c1: 62.00, c2: 167.00, c3: 184.00, c4: 213.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.325157826402073, 28.297967900053283), 
                type: ETollType.MAINLINE, tarrif: {c1: 62.00, c2: 167.00, c3: 184.00, c4: 213.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "Hammanskraal", //HAMMANSKRAAL
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.404115973803734, 28.297145569396626), 
                type: ETollType.RAMP, tarrif: {c1: 29.00, c2: 99.00, c3: 107.00, c4: 124.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.404008408767783, 28.298791007758183), 
                type: ETollType.RAMP, tarrif: {c1: 29.00, c2: 99.00, c3: 107.00, c4: 124.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Murrayhill",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.503470141409622, 28.287020689986228), 
                type: ETollType.RAMP, tarrif: {c1: 12.50, c2: 31.00, c3: 37.00, c4: 43.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.504164548181556, 28.288587801811023), 
                type: ETollType.RAMP, tarrif: {c1: 12.50, c2: 31.00, c3: 37.00, c4: 43.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Wallmansthal", //WALLMANSTHAL
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.57993237336703, 28.280695072636714), 
                type: ETollType.RAMP, tarrif: {c1: 6.20, c2: 15.50, c3: 18.50, c4: 21.50}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.58007991873222, 28.282501146791493), 
                type: ETollType.RAMP, tarrif: {c1: 6.20, c2: 15.50, c3: 18.50, c4: 21.50}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Pumulani",
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

    {
        name: "Zambesi",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.686056843084586, 28.28062997328666), 
                type: ETollType.RAMP, tarrif: {c1: 12.50, c2: 31.00, c3: 36.00, c4: 43.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.686365261271035, 28.282497311286267), 
                type: ETollType.RAMP, tarrif: {c1: 12.50, c2: 31.00, c3: 36.00, c4: 43.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Stormvoel",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.71245948142543, 28.265036683750335), 
                type: ETollType.RAMP, tarrif: {c1: 10.50, c2: 26.00, c3: 30.00, c4: 36.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.712757655898812, 28.266336317301757), 
                type: ETollType.RAMP, tarrif: {c1: 10.50, c2: 26.00, c3: 30.00, c4: 36.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },


    // N1: Johannesburg to bloem

    {
        name: "Grasmere",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.41289945792742, 27.882784551228045), 
                type: ETollType.MAINLINE, tarrif: {c1: 22.50, c2: 67.00, c3: 78.00, c4: 103.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.41298369902437, 27.883126163218066), 
                type: ETollType.MAINLINE, tarrif: {c1: 22.50, c2: 67.00, c3: 78.00, c4: 103.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.4161167412774, 27.879520040830506), 
                type: ETollType.RAMP, tarrif: {c1: 11.50, c2: 33.00, c3: 39.00, c4: 51.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-26.417327417312563, 27.880501536771412), 
                type: ETollType.RAMP, tarrif: {c1: 11.50, c2: 33.00, c3: 39.00, c4: 51.00}, 
                nameExtention: " - S Ramp"
            },
            { // to Joburg
                coordinates: new google.maps.LatLng(-26.413839218184094, 27.881256659453232), 
                type: ETollType.RAMP, tarrif: {c1: 11.50, c2: 33.00, c3: 39.00, c4: 51.00}, 
                nameExtention: " - N Ramp"
            },

            { //from joburg
                coordinates: new google.maps.LatLng(-26.414763664444045, 27.88259055170619), 
                type: ETollType.RAMP, tarrif: {c1: 11.50, c2: 33.00, c3: 39.00, c4: 51.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Vaal",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.857002729642943, 27.635041736783432), 
                type: ETollType.MAINLINE, tarrif: {c1: 74.50, c2: 140.00, c3: 169.00, c4: 225.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "Verkeerdevlei",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-28.800606730838677, 26.688030775646443), 
                type: ETollType.MAINLINE, tarrif: {c1: 64.00, c2: 128.00, c3: 193.00, c4: 271.00}, 
                nameExtention: ""
            },
        ],
    },

    //Worcester - Paarl

    {
        name: "Huguenot",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-33.74254615861604, 19.019349653530135), 
                type: ETollType.MAINLINE, tarrif: {c1: 44.50, c2: 123.00, c3: 193.00, c4: 313.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-33.74274131568921, 19.01914513510936), 
                type: ETollType.MAINLINE, tarrif: {c1: 44.50, c2: 123.00, c3: 193.00, c4: 313.00}, 
                nameExtention: ""
            },
        ],
    },


    //N2: Port Shepstone – Margate (South Coast Road)

    {
        name: "Umtenetweni", //UMTENETWENI
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-30.70085648988108, 30.444445293406204), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 25.00, c3: 35.00, c4: 57.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-30.700897592137895, 30.446283914786207), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 25.00, c3: 35.00, c4: 57.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Oribi",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-30.75187002954908, 30.433050283054335), 
                type: ETollType.MAINLINE, tarrif: {c1: 33.50, c2: 59.00, c3: 82.00, c4: 133.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-30.751868877017664, 30.433247425400925), 
                type: ETollType.MAINLINE, tarrif: {c1: 33.50, c2: 59.00, c3: 82.00, c4: 133.00}, 
                nameExtention: ""
            },
            { //top
                coordinates: new google.maps.LatLng(-30.751749218857558, 30.43235929374672), 
                type: ETollType.RAMP, tarrif: {c1: 18.00, c2: 31.00, c3: 44.00, c4: 82.00}, 
                nameExtention: " - N Ramp"
            },
            { // top
                coordinates: new google.maps.LatLng(-30.751669414150882, 30.433765890851063), 
                type: ETollType.RAMP, tarrif: {c1: 15.50, c2: 28.00, c3: 38.00, c4: 60.00}, 
                nameExtention: " - S Ramp"
            },
            { // bottom
                coordinates: new google.maps.LatLng(-30.753586989278894, 30.43193125465922), 
                type: ETollType.RAMP, tarrif: {c1: 18.00, c2: 31.00, c3: 44.00, c4: 82.00}, 
                nameExtention: " - N Ramp"
            },

            { //bottom
                coordinates: new google.maps.LatLng(-30.753998459669745, 30.43320763859783), 
                type: ETollType.RAMP, tarrif: {c1: 15.50, c2: 28.00, c3: 38.00, c4: 60.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Izotsha", //IZOTSHA
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-30.799158645233973, 30.40101338832859), 
                type: ETollType.RAMP, tarrif: {c1: 10.50, c2: 19.00, c3: 25.00, c4: 44.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-30.800470249550578, 30.402036970686282), 
                type: ETollType.RAMP, tarrif: {c1: 10.50, c2: 19.00, c3: 25.00, c4: 44.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    // N2: Tsitsikama (Garden Route)

    {
        name: "Tsitsikama",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-33.95038322301361, 23.623230945745387), 
                type: ETollType.MAINLINE, tarrif: {c1: 59.50, c2: 150.00, c3: 358.00, c4: 505.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-33.94590256120941, 23.619182538945793), 
                type: ETollType.RAMP, tarrif: {c1: 59.50, c2: 150.00, c3: 358.00, c4: 505.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-33.945559883119365, 23.620557536224908), 
                type: ETollType.RAMP, tarrif: {c1: 59.50, c2: 150.00, c3: 358.00, c4: 505.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    // N3: Heidelberg – Pietermaritzburg

    {
        name: "De Hoek",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.66371751266769, 28.38950262652649), 
                type: ETollType.MAINLINE, tarrif: {c1: 56.50, c2: 86.00, c3: 132.00, c4: 186.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.663618637553157, 28.38998140079676), 
                type: ETollType.MAINLINE, tarrif: {c1: 56.50, c2: 86.00, c3: 132.00, c4: 186.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "Wilge",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-27.040643013434668, 28.62616367353687), 
                type: ETollType.MAINLINE, tarrif: {c1: 77.00, c2: 133.00, c3: 177.00, c4: 251.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "Tugela",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-28.462428577897043, 29.561651421918857), 
                type: ETollType.MAINLINE, tarrif: {c1: 82.00, c2: 136.00, c3: 214.00, c4: 296.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-28.462379059678025, 29.56196456979591), 
                type: ETollType.MAINLINE, tarrif: {c1: 82.00, c2: 136.00, c3: 214.00, c4: 296.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-28.457306943387767, 29.566665412109117), 
                type: ETollType.RAMP, tarrif: {c1: 51.00, c2: 84.00, c3: 125.00, c4: 174.00}, 
                nameExtention: " East"
            },
        ],
    },

    {
        name: "Bergville",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-28.58902842646162, 29.60845922912829), 
                type: ETollType.RAMP, tarrif: {c1: 25.00, c2: 29.00, c3: 53.00, c4: 82.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-28.58886284524304, 29.609647153173256), 
                type: ETollType.RAMP, tarrif: {c1: 25.00, c2: 29.00, c3: 53.00, c4: 82.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Treverton",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-29.193067210259578, 29.992845612989672), 
                type: ETollType.RAMP, tarrif: {c1: 17.00, c2: 42.00, c3: 59.00, c4: 80.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-29.192658793667338, 29.994137840457633), 
                type: ETollType.RAMP, tarrif: {c1: 17.00, c2: 42.00, c3: 59.00, c4: 80.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "Mooi",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-29.219747182276475, 30.003847908689302), 
                type: ETollType.MAINLINE, tarrif: {c1: 58.00, c2: 141.00, c3: 197.00, c4: 267.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-29.219749523184735, 30.004126187851995), 
                type: ETollType.MAINLINE, tarrif: {c1: 58.00, c2: 141.00, c3: 197.00, c4: 267.00}, 
                nameExtention: ""
            },
            { //Top
                coordinates: new google.maps.LatLng(-29.219456194131837, 30.003401244485456), 
                type: ETollType.RAMP, tarrif: {c1: 17.00, c2: 42.00, c3: 59.00, c4: 80.00}, 
                nameExtention: " - N Ramp"
            },
            { //Top
                coordinates: new google.maps.LatLng(-29.219789681878744, 30.004626446027657), 
                type: ETollType.RAMP, tarrif: {c1: 40.00, c2: 98.00, c3: 138.00, c4: 187.00}, 
                nameExtention: " - S Ramp"
            },
            { //bottom
                coordinates: new google.maps.LatLng(-29.222150822837428, 30.003927386532), 
                type: ETollType.RAMP, tarrif: {c1: 17.00, c2: 42.00, c3: 59.00, c4: 80.00}, 
                nameExtention: " - N Ramp"
            },
            { //bottom
                coordinates: new google.maps.LatLng(-29.221512353088755, 30.00499624679949), 
                type: ETollType.RAMP, tarrif: {c1: 40.00, c2: 98.00, c3: 138.00, c4: 187.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    // N3: Mariannhill (between Key Ridge and Pinetown)

    {
        name: "Mariannhill",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-29.82293484242465, 30.802087438719962), 
                type: ETollType.MAINLINE, tarrif: {c1: 13.50, c2: 24.00, c3: 30.00, c4: 47.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-29.823477646752675, 30.80212161400206), 
                type: ETollType.MAINLINE, tarrif: {c1: 13.50, c2: 24.00, c3: 30.00, c4: 47.00}, 
                nameExtention: ""
            },
        ],
    },

    //TODO N4: Lobatse – Pretoria (Platinum corridor to Botswana)


    // N4: Hartbeespoort – Pretoria (Magaliesberg)

    {
        name: "PELINDABA",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.77778681719602, 27.96022417403346), 
                type: ETollType.MAINLINE, tarrif: {c1: 6.50, c2: 12.00, c3: 18.00, c4: 22.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.777984267437365, 27.960230209003253), 
                type: ETollType.MAINLINE, tarrif: {c1: 6.50, c2: 12.00, c3: 18.00, c4: 22.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "QUAGGA",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.749251869474588, 28.114499265466485), 
                type: ETollType.MAINLINE, tarrif: {c1: 5.00, c2: 9.50, c3: 13.00, c4: 18.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.74930501873702, 28.11486873972828), 
                type: ETollType.MAINLINE, tarrif: {c1: 5.00, c2: 9.50, c3: 13.00, c4: 18.00}, 
                nameExtention: ""
            },
        ],
    },

    //N4: Pretoria – Maputo (Maputo Corridor to Mozambique)

    {
        name: "DONKERHOEK",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.772061056679185, 28.4321866309188), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 20.00, c3: 29.00, c4: 55.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.77352998614081, 28.432639696331186), 
                type: ETollType.RAMP, tarrif: {c1: 14.00, c2: 20.00, c3: 29.00, c4: 55.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "CULLINAN",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.796193006719314, 28.51554718694459), 
                type: ETollType.RAMP, tarrif: {c1: 18.00, c2: 29.00, c3: 42.00, c4: 71.00}, 
                nameExtention: " - N Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.798654859328288, 28.51557401594382), 
                type: ETollType.RAMP, tarrif: {c1: 18.00, c2: 29.00, c3: 42.00, c4: 71.00}, 
                nameExtention: " - S Ramp"
            },
        ],
    },

    {
        name: "DIAMOND HILL",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.797844508000175, 28.54998636925116), 
                type: ETollType.MAINLINE, tarrif: {c1: 42.00, c2: 58.00, c3: 110.00, c4: 182.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.798076940645434, 28.54984421218492), 
                type: ETollType.MAINLINE, tarrif: {c1: 42.00, c2: 58.00, c3: 110.00, c4: 182.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "VALTAKI",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.79758287013007, 28.617676439788948), 
                type: ETollType.RAMP, tarrif: {c1: 32.00, c2: 46.00, c3: 67.00, c4: 151.00}, 
                nameExtention: " - E Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.801653142848654, 28.618271252105277), 
                type: ETollType.RAMP, tarrif: {c1: 32.00, c2: 46.00, c3: 67.00, c4: 151.00}, 
                nameExtention: " - W Ramp"
            },
        ],
    },

    {
        name: "EKANDUSTRIA",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.80657628405639, 28.69825436204115), 
                type: ETollType.RAMP, tarrif: {c1: 26.00, c2: 39.00, c3: 54.00, c4: 108.00}, 
                nameExtention: " - E Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-25.809487326570125, 28.697159946392375), 
                type: ETollType.RAMP, tarrif: {c1: 26.00, c2: 39.00, c3: 54.00, c4: 108.00}, 
                nameExtention: " - W Ramp"
            },
        ],
    },

    {
        name: "MIDDELBURG",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.86435475281504, 29.36644751948951), 
                type: ETollType.MAINLINE, tarrif: {c1: 70.00, c2: 151.00, c3: 229.00, c4: 301.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.8645291302542, 29.36657023054197), 
                type: ETollType.MAINLINE, tarrif: {c1: 70.00, c2: 151.00, c3: 229.00, c4: 301.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "MACHADO",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.633430390248932, 30.25421091748075), 
                type: ETollType.MAINLINE, tarrif: {c1: 104.00, c2: 289.00, c3: 421.00, c4: 601.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-25.63357246098092, 30.254276631596273), 
                type: ETollType.MAINLINE, tarrif: {c1: 104.00, c2: 289.00, c3: 421.00, c4: 601.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "NKOMAZI",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-25.53645575516049, 31.341463155845343), 
                type: ETollType.MAINLINE, tarrif: {c1: 79.00, c2: 160.00, c3: 232.00, c4: 334.00}, 
                nameExtention: ""
            },
        ],
    },

    // N17: Springs – Krugersdorp – Ermelo
    {
        name: "GOSFORTH",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.248115168996456, 28.158314090305193), 
                type: ETollType.MAINLINE, tarrif: {c1: 14.00, c2: 37.00, c3: 41.00, c4: 57.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.24845195798656, 28.15835700564595), 
                type: ETollType.MAINLINE, tarrif: {c1: 14.00, c2: 37.00, c3: 41.00, c4: 57.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.248673173795726, 28.158670751357853), 
                type: ETollType.RAMP, tarrif: {c1: 7.50, c2: 16.00, c3: 21.00, c4: 27.00}, 
                nameExtention: " - W Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-26.247881646520128, 28.158465921605934), 
                type: ETollType.RAMP, tarrif: {c1: 6.00, c2: 23.00, c3: 25.00, c4: 35.00}, 
                nameExtention: " - E Ramp"
            },
        ],
    },

    {
        name: "DALPARK",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.25614244931512, 28.327928388217252), 
                type: ETollType.MAINLINE, tarrif: {c1: 13.00, c2: 27.00, c3: 35.00, c4: 47.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.256497256027796, 28.327816405999975), 
                type: ETollType.MAINLINE, tarrif: {c1: 13.00, c2: 27.00, c3: 35.00, c4: 47.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "DENNE",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.267584298649357, 28.360806249163538), 
                type: ETollType.RAMP, tarrif: {c1: 11.00, c2: 22.00, c3: 29.00, c4: 38.00}, 
                nameExtention: " - E Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-26.267414599744242, 28.36183833988543), 
                type: ETollType.RAMP, tarrif: {c1: 11.00, c2: 22.00, c3: 29.00, c4: 38.00}, 
                nameExtention: " - W Ramp"
            },
        ],
    },

    {
        name: "LEANDRA",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.398588558707303, 28.949463739028044), 
                type: ETollType.MAINLINE, tarrif: {c1: 41.00, c2: 104.00, c3: 155.00, c4: 206.00}, 
                nameExtention: ""
            },
            {
                coordinates: new google.maps.LatLng(-26.395116695355597, 28.936792082866152), 
                type: ETollType.RAMP, tarrif: {c1: 24.00, c2: 63.00, c3: 93.00, c4: 124.00}, 
                nameExtention: " - Ramp"
            },
            {
                coordinates: new google.maps.LatLng(-26.39708777511478, 28.93686243635401), 
                type: ETollType.RAMP, tarrif: {c1: 24.00, c2: 63.00, c3: 93.00, c4: 124.00}, 
                nameExtention: " - Ramp"
            },
        ],
    },

    {
        name: "TRICHARDT",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.484054395947616, 29.325499141565167), 
                type: ETollType.MAINLINE, tarrif: {c1: 20.50, c2: 52.00, c3: 79.00, c4: 104.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "ERMELO",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-26.50623565760789, 29.861860301184013), 
                type: ETollType.MAINLINE, tarrif: {c1: 37.50, c2: 93.00, c3: 139.00, c4: 185.00}, 
                nameExtention: ""
            },
        ],
    },

    {
        name: "BRANDFORT",
        gateSection: [
            {
                coordinates: new google.maps.LatLng(-28.90239600060832, 26.3376781330123), 
                type: ETollType.MAINLINE, tarrif: {c1: 51.00, c2: 102.00, c3: 154.00, c4: 216.00}, 
                nameExtention: ""
            },
        ],
    },


]

