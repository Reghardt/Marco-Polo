import { immer } from "zustand/middleware/immer";
import create from 'zustand';

interface IAccountState{
    values: {
        bearer: string;
        workspaceId: string;
    },
    actions: {
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
        actions: {
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