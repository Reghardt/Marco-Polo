
import create from "zustand";
import { altCounterSlice, IAltCounterSlice } from "./altCounter.slice";
import { counterSlice, ICounterSlice } from "./counter.slice";


type IStore = ICounterSlice & IAltCounterSlice

export const useCounterStore = create<IStore>(
    (...a) => 
        (
            {
                ...counterSlice(...a),
                ...altCounterSlice(...a),
            }
        )
)