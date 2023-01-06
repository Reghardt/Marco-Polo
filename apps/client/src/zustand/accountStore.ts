import { immer } from "zustand/middleware/immer";
import create from 'zustand';

interface IAccountState{
    values: {
        bearer: string;
        workspaceId: string;
    },
    reducers: {
        setBearer: (bearer: string) => void;
        setWorkspaceId: (workspaceId: string) => void;

    }
}

export const useAccountStore = create<IAccountState>()(
    immer((set) => ({
        values: {
            bearer: "",
            workspaceId: "",

        },
        reducers: {
            setBearer(bearer: string){
                set(state => {
                    state.values.bearer = bearer
                })
            },
            setWorkspaceId(workspaceId: string){
                set(state => {
                    state.values.workspaceId = workspaceId
                })
            }
        }
    }))
)