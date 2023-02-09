import { Button } from "@mui/material"
import React from "react"
import { useTripStore } from "../../Zustand/tripStore"
import StandardHeader from "../common/StandardHeader.component"

import DepartureReturn from "./DepartureReturn/DepartureReturn.component"
import { TripNetwork } from "./Trip.network"
import { doRowsConform } from "../../Services/Trip.service"
import TripTable from "./TripTable/TripTable.component"
import { loadSelection } from "./Worksheet/worksheet.service"
import GMap from "../Maps/GMap.component"
import Statistics from "../Statistics/Statistics.component"
import { createTripDirections } from "../../Services/GMap.service"


const Trip : React.FC = () => {
  console.log("Trip Refresh")

  // const [mode, setMode] = useState< "planner" | "explore">("planner")

  const ZF_setRowsAsNewTrip = useTripStore(store => store.actions.setRowsAsNewTrip)
  const ZF_clearAndSetTripDirections = useTripStore(store => store.actions.clearAndSetTripDirections)

    function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      loadSelection().then((selection) => {
        console.log(selection)
        if(selection.length > 0)
        {
          const conformRes = doRowsConform(selection)
          console.log(conformRes)
          if(conformRes.status === false)
          {
            ZF_setRowsAsNewTrip([])
            return;
          }
          ZF_setRowsAsNewTrip(selection)
          ZF_clearAndSetTripDirections(null)
        } 
      })
    }




    return(
        <div >
          <StandardHeader title="Trip Builder" backNavStr="/workspaces"/> {/*Trip? Job? Route?*/}

          <div className={"p-2 space-y-2"}>

            
            {/* <GProgrammaticAutoComplete/> */}
            <TripNetwork/>

            <DepartureReturn/>

            {/* <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, value) => setMode(value)}
              aria-label="text alignment"
            >
              <ToggleButton value="planner" aria-label="left aligned">
                Planner
              </ToggleButton>
              <ToggleButton value="explore" aria-label="centered">
                Explore
              </ToggleButton>
            </ToggleButtonGroup> */}

            <div className={"mb-2"}>
              <Button variant="contained"  onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Use Current Selection</Button>
            </div>


            
            <TripTable/>

            <div className={"w-full"}>
              <Button className={"w-full"}  variant="contained" onClick={() => createTripDirections(true, false)}>Find Route</Button>
            </div>

            <GMap/>

            <Statistics/>




            
          </div>

          
        </div>
    )
}

export default Trip