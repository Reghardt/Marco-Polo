import produce from "immer";
import { StateCreator } from "zustand";

export interface ICounterSlice {
    counter: {
        value: number;
        isEven: boolean;
        incrementValue: () => void;
    }  
}

export const counterSlice: StateCreator<ICounterSlice> = (set, _get) => ({
    counter: {
        value: 0,
        isEven: false,
        incrementValue() {
            set(produce<ICounterSlice>((state) => {
                state.counter.value++
                if(state.counter.value % 2 === 0)
                {
                    state.counter.isEven = true;
                }
                else
                {
                    state.counter.isEven = false;
                }
            }))
        },
    }
})


