import produce from "immer";
import create from "zustand/react";

interface IAuthStore{
    values: {
        token: string
    },
    actions: {
        setToken: (token: string) => void;
    }
}

export const useAuthStore = create<IAuthStore>()((set) => (
    {
        values: {
            token: ""
        },
        actions: {
            setToken(token){
                set(produce<IAuthStore>((state) => {
                    state.values.token = token
                }))
            }
        }
    })
)