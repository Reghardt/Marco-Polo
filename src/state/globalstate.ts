import { atom } from "recoil";
import { Row } from "../interfaces/simpleInterfaces";

export const workspaceID = atom({
    key: "workspaceID",
    default: ""
});

export const bearerToken = atom({
    key: "bearerToken",
    default: ""
})

export const SelectedCells = atom<Row[]>({
    key: "SelectedCells",
    default: []
})
