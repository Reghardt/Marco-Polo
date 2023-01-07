import produce from "immer";
import { StateCreator } from "zustand";

export interface IAltCounterSlice {
    altCounter: {
        value: number;
        incrementValue: () => void;
    }  
}

export const altCounterSlice: StateCreator<IAltCounterSlice> = (set, _get) => ({
    altCounter: {
        value: 0,
        incrementValue() {
            set(produce<IAltCounterSlice>((state) => {
                state.altCounter.value++
            }))
        },
    }
    
})