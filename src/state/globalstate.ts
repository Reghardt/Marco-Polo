import { atom } from "recoil";

export const RBearerToken = atom({
    key: "bearerToken",
    default: ""
})

export const RWorkspaceID = atom({
    key: "workspaceID",
    default: ""
});

export const RJobID = atom<{jobId: string, shouldFetch: boolean}>({
    key: "jobId",
    default: {jobId: "", shouldFetch: false}
})




