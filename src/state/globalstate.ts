import { atom, selector } from "recoil";
import { EDisplayRoute } from "../components/Maps/GMap.service";
import { EDepartReturn } from "../components/Trip/DepartureReturn/DepartureReturn.component";
import { ITripDirections } from "../interfaces/simpleInterfaces";

import { EColumnDesignations } from "../services/ColumnDesignation.service";
import { IRow } from "../services/worksheet/row.interface";

export const RSBearerToken = atom({
    key: "bearerToken",
    default: ""
})

export const RSWorkspaceID = atom({
    key: "workspaceID",
    default: ""
});

export const RSJobID = atom<{jobId: string, shouldFetch: boolean}>({
    key: "jobId",
    default: {jobId: "", shouldFetch: false}
})

export const RSDepartureAddress = atom<google.maps.GeocoderResult>({
    key: "departureAddress",
    default: null
})

export const RSReturnAddress = atom<google.maps.GeocoderResult>({
    key: "returnAddress",
    default: null
})

export const RSDepartReturnState = atom<EDepartReturn>({
    key: "departReturnState",
    default: EDepartReturn.return
})

export const RSJobColumnDesignations = atom<EColumnDesignations[]>({
    key: "jobColumnDesignations",
    default: []
})

export const RSJobHeadings = atom<IRow>({
    key: "jobHeadings",
    default: null
})

export const RSJobFirstRowIsHeading = atom<boolean>({
    key: "jobFirstRowIsHeaing",
    default: false
})

export const RSTripRows = atom<IRow[]>({
    key: "jobBody",
    default: []
})

export const RSInSequenceTripRows = atom<IRow[]>({
    key: "inSequenceJobRows",
    default: []
})


export const RSAddresColumIndex = selector({
    key: "addesColumIndex",
    get: ({get}) => {
        const columnDesignations = get(RSJobColumnDesignations);

        let colIdx = -1;

        for(let i = 0; i< columnDesignations.length; i++)
        {
            if(columnDesignations[i] === EColumnDesignations.Address)
            {
                colIdx = i;
                break;
            }
        }
        
        return colIdx;
    }
})

export const RSColumnVisibility = atom<boolean[]>({
    key: "columnVisibility",
    default: []
})

// export const RSFirstRowIsColumn = atom<boolean>({
//     key: "firstRowIsColumn",
//     default: false
// })

export const RSTokens = atom<number>({
    key: "tokens",
    default: 0
})


export const RSShortestTripDirections = atom<ITripDirections>({
    key: "shortestTripDirections",
    default: null
})

export const RSOriginalTripDirections = atom<ITripDirections>({
    key: "originalTripDirections",
    default: null
})

export const RSPreserveViewport = atom<boolean>({
    key: "preserveViewport",
    default: false
})

export const RSRouteToDisplay = atom<EDisplayRoute>({
    key: "routeToDisplay",
    default: EDisplayRoute.Original
})

export const RSTripTabValue = atom<number>({
    key: "tripTabsValue",
    default: 0
})






