import React from "react"
import { useCounterStore } from "../../../Zustand/store"



const Counter1: React.FC = () => {

    const counter = useCounterStore(state => state.counter.value)
    //const increment = useCounterStore(state => state.counter.incrementValue)
    const isEven = useCounterStore(state => state.counter.isEven)

    console.log("refresh counter 1")

    
    return(
        <React.Fragment>
            <div>Counter 1</div>
            <div>{counter}</div>
            <div>{isEven ? "even" : "not even"}</div>
            <div>
                
            </div>
            
        </React.Fragment>
        
    )
}

export default Counter1