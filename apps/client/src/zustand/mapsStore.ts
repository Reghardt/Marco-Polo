import create from "zustand"
import { immer } from "zustand/middleware/immer"


interface IMapStoreState{
    data: {
        preserveViewport: boolean;
    },
    reducers: {
        setPreserveViewport: (preserve: boolean) => void;
    }
}

export const useMapsStore = create<IMapStoreState>()(
    immer((set) => ({
        data: {
            preserveViewport: false
        },
        reducers: {
            setPreserveViewport(preserve) {
                set(state => {
                    state.data.preserveViewport = preserve
                })
            },
        }
    }))
)