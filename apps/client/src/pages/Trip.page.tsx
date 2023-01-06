import React from "react"
import DepartureReturn from "../components/DepartureReturn/DepartureReturn.component"
import TripTable from "../components/TripTable/TripTable.component"

import { loadSelection } from "../services/Excel.service"
import { doRowsConform } from "../services/Trip.service"
import StandardButton from "../ui/StandardButton"
import { useTripStore } from "../zustand/tripStore"



const Trip : React.FC = () => {
  console.log("Trip Refresh")

  const ZF_setRowsAsNewTrip = useTripStore(store => store.reducers.setRowsAsNewTrip)

    function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      loadSelection().then((selection) => {
        if(selection.length > 0)
        {
          const conformRes = doRowsConform(selection)
          if(conformRes.status === false)
          {
            ZF_setRowsAsNewTrip([])
            return;
          }
          console.log(selection)
          ZF_setRowsAsNewTrip(selection)
        } 
      })
    }

    return(
        <>

          {/* <StandardHeader title="Trip Builder" backNavStr="/workspaces"/> Trip? Job? Route? */}

          <div className="p-2">
            

            {/* <DepartureReturn/> */}
            <StandardButton onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Use Current Selection</StandardButton>

            <TripTable/>

            {/* <GMap/> */}
          </div>

          
        </>
    )
}

export default Trip