import { useCounterStore } from "../../../Zustand/store";

export function addToCounter()
{
    useCounterStore.getState().counter.incrementValue()
}