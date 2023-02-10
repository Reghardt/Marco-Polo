import React from "react"

import StandardHeader from "../common/StandardHeader.component"
import DepartureReturn from "./DepartureReturn/DepartureReturn.component"
import { TripNetwork } from "./Trip.network"
import TripTable from "./TripTable/TripTable.component"
import GMap from "../Maps/GMap.component"
import Statistics from "../Statistics/Statistics.component"



const Trip : React.FC = () => {
  console.log("Trip Refresh")

  // const [mode, setMode] = useState< "planner" | "explore">("planner")








    return(
        <div >
          <StandardHeader title="Trip Builder" backNavStr="/workspaces"/> {/*Trip? Job? Route?*/}

          <div className={"p-2 space-y-2"}>

            
            {/* <GProgrammaticAutoComplete/> */}
            <TripNetwork/>

            <DepartureReturn/>




            
            <TripTable/>



            <GMap/>

            <Statistics/>




            
          </div>

          
        </div>
    )
}

export default Trip