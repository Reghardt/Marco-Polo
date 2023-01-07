import React from "react"
import { useCounterStore } from "../../../Zustand/store"
import { addToCounter } from "./counter.service"

const Counter2: React.FC = () => {

    const altCounter = useCounterStore(state => state.altCounter.value)
    //const incAltCounter = useCounterStore(state => state.altCounter.incrementValue)

    console.log("refresh counter 2")
    
    return(
        <React.Fragment>
            <div>Counter 2</div>
            <div>{altCounter}</div>
            <button onClick={() => addToCounter()}>
                    Inc
            </button>
        </React.Fragment>
        
    )
}

export default Counter2