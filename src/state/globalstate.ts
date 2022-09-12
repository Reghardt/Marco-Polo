import { atom, selector } from "recoil";
import { IRawRouteTableData } from "../components/routes/interfaces/RawRouteDataTable.interface";
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

export const RSJobColumnDesignations = atom<EColumnDesignations[]>({
    key: "jobColumnDesignations",
    default: []
})

export const RSJobHeadings = atom<IRow>({
    key: "jobHeadings",
    default: null
})

export const RSJobFirstRowIsHeaing = atom<boolean>({
    key: "jobFirstRowIsHeaing",
    default: false
})

export const RSJobBody = atom<IRow[]>({
    key: "jobBody",
    default: []
})


export const RSAddresColumIndex = selector({
    key: "addesColumIndex",
    get: ({get}) => {
        const columnDesignations = get(RSJobColumnDesignations);

        for(let i = 0; i< columnDesignations.length; i++)
        {
            if(columnDesignations[i] === EColumnDesignations.Address)
            {
                return i;
            }
        }
        return -1;
    }
})

// export const RSFirstRowIsColumn = atom<boolean>({
//     key: "firstRowIsColumn",
//     default: false
// })

export const RSTokens = atom<number>({
    key: "tokens",
    default: 0
})




