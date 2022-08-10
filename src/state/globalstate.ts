import { atom, selector } from "recoil";
import { EColumnDesignations } from "../services/ColumnDesignation.service";

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

export const RSColumnDesignations = atom<number[]>({
    key: "columnDesignations",
    default: []
})

export const RSAddesColumIndex = selector({
    key: "addesColumIndex",
    get: ({get}) => {
        const columnDesignations = get(RSColumnDesignations);

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




