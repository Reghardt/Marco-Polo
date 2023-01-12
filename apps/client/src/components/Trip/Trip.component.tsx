import { Box, Button } from "@mui/material"
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

const Trip : React.FC = () => {
  console.log("Trip Refresh")

  const ZF_setRowsAsNewTrip = useTripStore(store => store.reducers.setRowsAsNewTrip)

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
        } 
      })
    }




    return(
        <Box >

          <StandardHeader title="Trip Builder" backNavStr="/workspaces"/> {/*Trip? Job? Route?*/}

          <Box sx={{p: "0.5em"}}>
            <TripNetwork/>

            <DepartureReturn/>
            <Button variant="outlined" sx={{marginBottom: "1em"}} onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Use Current Selection</Button>

            <TripTable/>

            <GMap/>

            <Statistics/>

            
          </Box>

          
        </Box>
    )
}

export default Trip