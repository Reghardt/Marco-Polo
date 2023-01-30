import create from "zustand"
import { immer } from "zustand/middleware/immer"


interface IMapStoreState{
    data: {
        map: google.maps.Map | undefined
        // preserveViewport: boolean;
    },
    actions: {
        setMap: (map: google.maps.Map) => void;
        // setPreserveViewport: (preserve: boolean) => void;
    }
}

export const useMapsStore = create<IMapStoreState>()(
    immer((set) => ({
        data: {
            map: undefined,
            preserveViewport: false
        },
        actions: {

            setMap(map){
                set(state => {
                    state.data.map = map
                })
            },

            // setPreserveViewport(preserve) {
            //     set(state => {
            //         state.data.preserveViewport = preserve
            //     })
            // },

        }
    }))
)