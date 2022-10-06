/** @jsxImportSource @emotion/react */

import { Box, Button, Divider, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";

import {ITripDirections } from "../../interfaces/simpleInterfaces";
import {loadSelection} from "../../services/worksheet/worksheet.service"

import axios from "axios";
import { getServerUrl } from "../../services/server.service";

import { useRecoilState, useRecoilValue } from "recoil";
import { RSAddresColumnIndex, RSBearerToken, RSColumnVisibility, RSDepartureAddress, RSTripRows, RSJobColumnDesignations, RSJobID, RSReturnAddress, RSTokens, RSWorkspaceID, RSTripDirections, RSPreserveViewport, RSErrorMessage } from "../../state/globalstate";


import { EColumnDesignations, handleSetColumnAsAddress, handleSetColumnAsData } from "../../services/ColumnDesignation.service";
import { IRow } from "../../services/worksheet/row.interface";

import StandardHeader from "../common/StandardHeader.component";
import { createBasicHeadingCell, createBasicHeadingRow } from "../workspaces/workspace.service";

import { createDirections, createInSequenceJobRows, makeRowParentChildRelations, removeRowParentChildRelations, doRowsConform } from "./Trip.service";
import DepartureReturn from "./DepartureReturn/DepartureReturn.component";

import GMap from "../Maps/GMap.component";

import MasterSequence from "../Sequence/MasterSequence/MasterSequence.component";



const RouteBuilder: React.FC = () =>
{
  //used as temporary storage as there are alot of set states needed and set states are not batched in an async func which is used to retreive data from excel
  const [Cache_rowsToImport, Cache_setRowsToImport] = useState<IRow[]>([])
  

  const [R_jobColumnDesignations, R_setJobColumnDesignations] = useRecoilState(RSJobColumnDesignations)

  const [R_tripRows, R_setTripRows] = useRecoilState(RSTripRows)

  const R_addresColumIndex = useRecoilValue(RSAddresColumnIndex)

  const [R_columnVisibility, R_setColumnVisibility] = useRecoilState(RSColumnVisibility)
  
  const [,R_setPreserveViewport] = useRecoilState(RSPreserveViewport)
  

  const R_departureAddress = useRecoilValue(RSDepartureAddress);
  const R_returnAddress = useRecoilValue(RSReturnAddress);

  //const [R_tripStatisticsData, R_setTripStatisticsData] = useRecoilState(RSTripStatisticsData)
  
  const jobId = useRecoilValue(RSJobID)
  const R_workspaceId = useRecoilValue(RSWorkspaceID)

  //const [waypointOrder, setWaypointOrder] = useState<number[]>([])

  const R_addressColumIndex = useRecoilValue(RSAddresColumnIndex)

  const R_bearer = useRecoilValue(RSBearerToken)

  const [R_tokens, R_setTokens] = useRecoilState(RSTokens)

  const [, R_setTripDirections] = useRecoilState(RSTripDirections)


  const [Cache_tripDirections, Cache_setTripDirections] = useState<ITripDirections[]>([])

  const [R_errorMessage, R_setErrorMessage] = useRecoilState(RSErrorMessage)

    console.log("refresh")

    //START: useEffects
    useEffect(() => { //is this use effect neccesary? Yes: async functions dont batch setStates
      if(Cache_rowsToImport.length > 0)
      {
        let conformRes = doRowsConform(Cache_rowsToImport)
        if(conformRes.status === false)
        {
          console.error(conformRes.reason)

          R_setJobColumnDesignations([])
          R_setTripRows([])
          R_setColumnVisibility([])

          R_setTripDirections(null)
          return;
        }

        //create data for headings nad column designations
        let tempHeadings: IRow = { cells: [], children: []}
        let tempColumnDesignations: number[] = []
        let colVisibility: boolean[] = []
        for(let k = 0; k < Cache_rowsToImport[0].cells.length; k++)
        {
          tempHeadings.cells.push(createBasicHeadingCell("C" + k, k ))
          tempColumnDesignations.push(0) 
          colVisibility.push(true)
        }


        R_setJobColumnDesignations(tempColumnDesignations)
        R_setTripRows(Cache_rowsToImport)
        R_setColumnVisibility(colVisibility)

        R_setTripDirections(null)

      } 
    }, [Cache_rowsToImport]) //why does this throw a warning when the function is not in the dependency array?

    

    
    useEffect(() => {
      let jobBodyState: IRow[] = JSON.parse(JSON.stringify(R_tripRows))
      if(R_addresColumIndex === -1)
      {
        let removedRelationsRows = removeRowParentChildRelations(jobBodyState)
        R_setTripRows(removedRelationsRows)
      }
      else
      {
        let removedRelationsRows = removeRowParentChildRelations(jobBodyState) //remove relations as address column may have changed
        let parentWithChildrenRows = makeRowParentChildRelations(removedRelationsRows, R_addresColumIndex) //re-add relations as per new address col
        R_setTripRows(parentWithChildrenRows)
      }

    }, [R_addresColumIndex])

    useEffect(() => {
      if(Cache_tripDirections.length > 0)
      {
          //TODO cgeck if status is OK
          
          //This line reorders the rows according to what the fastest sequence is
          R_setPreserveViewport(false)
          R_setTripRows(createInSequenceJobRows(Array.from(R_tripRows), Cache_tripDirections[0].result.routes[0].waypoint_order))
          R_setTripDirections(Cache_tripDirections[0])
          R_setErrorMessage("")
          
      }
    }, [Cache_tripDirections])

    //END useEffects
    

    //TODO move setStates outside of func, async func setState not batched
    function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      loadSelection().then((selection) => {
        console.log(selection)
        Cache_setRowsToImport(selection)
        
      })
     
    }






    function calcFastestAndOriginalRoute()
    {
      if(R_departureAddress !== null && R_returnAddress !== null) //test if not "none"
      {
        let waypoints: google.maps.DirectionsWaypoint[]  = [];

        if(R_addressColumIndex > -1)
        {
          for(let i = 0; i < R_tripRows.length; i++)
          {
            if(R_tripRows[i].cells[R_addressColumIndex].geocodedAddressRes !== null)
            {
              waypoints.push({location: R_tripRows[i].cells[R_addressColumIndex].geocodedAddressRes.formatted_address, stopover: true})
            }
            else
            {
              R_setErrorMessage("Error: Check if all addresses are solved")
              return
            }
            
          }

          //TODO check if there are enought tokens available
          makeRouteOnDB(5)

          Promise.all(
            [createDirections(R_departureAddress.formatted_address, R_returnAddress.formatted_address, waypoints, true), 
              createDirections(R_departureAddress.formatted_address, R_returnAddress.formatted_address, waypoints, false)
            ]).then(res => {
            Cache_setTripDirections(res)
          })
        }
        else
        {
          R_setErrorMessage("Error: No address column set")
        }
      }
      else
      {
        R_setErrorMessage("Error: Check if Departure/Return are set")
      }
    }



    async function makeRouteOnDB(routeCost: number)
    {
      return axios.post(getServerUrl() + "/job/makeRoute",
        {
          workspaceId: R_workspaceId,
          routeCost: routeCost
        },
        {
            headers: {authorization: R_bearer}
        }).then((res) => {
            
            console.log("response received", res)
            //TODO dont set and return
            R_setTokens(res.data.tokens)
            return res.data;
            
        }).catch((err) => {
            console.error(err.response)
            return err;
        })
    }

    function handleColumnDesignation(colIdx: number, colValue: EColumnDesignations)
    {
      R_setJobColumnDesignations((currentDesignations) => {
        if(colValue === EColumnDesignations.Data)
        {
          return handleSetColumnAsData(colIdx, currentDesignations)
        }
        else if(colValue === EColumnDesignations.Address)
        {
          return handleSetColumnAsAddress(colIdx, currentDesignations)
        }
        else
        {
          return currentDesignations
        }
      })
    }

    return(
        <div>
          <StandardHeader title="Trip Builder" backNavStr="/routeMenu"/> {/*Trip? Job? Route?*/}

          <Paper elevation={10}>

            <Box sx={{padding: "0.3em"}}>

              <DepartureReturn/>
              
              <Divider sx={{marginTop: "0.5em", marginBottom: "0.5em"}}/>

              <Button variant="outlined" sx={{marginBottom: "1em"}} onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Import New Selection</Button>

              <MasterSequence handleColumnDesignation={handleColumnDesignation} calcRoute={calcFastestAndOriginalRoute}/>

              {/* <TripTabs 
                retrieveUserSelectionFromSpreadsheetAndSet={retrieveUserSelectionFromSpreadsheetAndSet} 
                handleColumnDesignation={handleColumnDesignation}
                calcRoute={calcFastestAndOriginalRoute}
                putFirstRowAsHeading={putFirstRowAsHeading}
              /> */}
            </Box>
          </Paper>
          <GMap/>

        </div>
    )
}

export default RouteBuilder