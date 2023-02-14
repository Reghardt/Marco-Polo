import React from "react"

const GMapLegends: React.FC = () => {
    return(
        <div>

            <div className={"text-base"}>Map Legends: </div>

            <div className={"text-sm"}>1, 2, 3.. = Address Visit Sequence </div>

            <div className={"text-sm"}>DEP = Departure, RET = Return, D+R = Departure + Return Address </div>

        </div>
    )
}

export default GMapLegends