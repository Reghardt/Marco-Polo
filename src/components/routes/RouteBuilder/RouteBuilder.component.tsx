/** @jsxImportSource @emotion/react */

import { Box, Button, Divider, IconButton, Paper, Stack, styled, Tab, Tabs, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import {IRouteResult, IRouteStatistics } from "../../../interfaces/simpleInterfaces";
import {loadSelection} from "../../../services/worksheet/worksheet.service"

import RouteStatistics from "../RouteStatistics.component";
import axios from "axios";
import { getServerUrl } from "../../../services/server.service";

import { useRecoilState, useRecoilValue } from "recoil";
import { RSAddresColumIndex, RSBearerToken, RSColumnVisibility, RSDepartureAddress, RSJobBody, RSJobColumnDesignations, RSJobFirstRowIsHeading, RSJobHeadings, RSJobID, RSReturnAddress, RSTokens, RSWorkspaceID } from "../../../state/globalstate";

import RouteSequence from "../../Sequence/RouteSequence.component";
import { EColumnDesignations, handleSetColumnAsAddress, handleSetColumnAsData } from "../../../services/ColumnDesignation.service";
import { IRow } from "../../../services/worksheet/row.interface";

import StandardHeader from "../../common/StandardHeader.component";
import { createBasicHeadingCell, createBasicHeadingRow } from "../../workspaces/workspace.service";
import RouteEditor from "../RouteEditor/RouteEditor";
import { makeRowParentChildRelations, removeRowParentChildRelations, TabPanel, tabProps } from "./RouteBuilder.service";
import DepartureReturn from "./DepartureReturn/DepartureReturn.component";

import GMap from "./Maps/GMap.component";



const RouteBuilder: React.FC = () =>
{
  //used as temporary storage as there are alot of set states needed and set states are not batched in an async func which is used to retreive data from excel
  const [userSelectionRows, setUserSelectionRows] = useState<IRow[]>([])

  const [tabValue, setTabValue] = useState(0);

  const [R_jobColumnDesignations, R_setJobColumnDesignations] = useRecoilState(RSJobColumnDesignations)
  const [R_jobHeadings, R_setJobHeadings] = useRecoilState(RSJobHeadings)
  const [R_jobFirstRowIsHeading, R_setJobFirstRowIsHeading] = useRecoilState(RSJobFirstRowIsHeading)
  const [R_jobBody, R_setJobBody] = useRecoilState(RSJobBody)

  const R_addresColumIndex = useRecoilValue(RSAddresColumIndex)

  const [R_columnVisibility, R_setColumnVisibility] = useRecoilState(RSColumnVisibility)
  

  

  

  const R_departureAddress = useRecoilValue(RSDepartureAddress);
  const R_returnAddress = useRecoilValue(RSReturnAddress);

  const [routeStatisticsData, setRouteStatisticsData] = useState<IRouteStatistics>(null)
  
  const jobId = useRecoilValue(RSJobID)
  const R_workspaceId = useRecoilValue(RSWorkspaceID)

  const [waypointOrder, setWaypointOrder] = useState<number[]>([])

  const R_addressColumIndex = useRecoilValue(RSAddresColumIndex)

  const R_bearer = useRecoilValue(RSBearerToken)

  const [R_tokens, R_setTokens] = useRecoilState(RSTokens)

  const [fastestRouteResult, setFastestRouteResult] = useState<IRouteResult>(null)
  const [originalRouteResult, setOriginalRouteResult] = useState<IRouteResult>(null)

    

    console.log("refresh")

    //START: useEffects



    useEffect(() => { //is this use effect neccesary? Yes: async functions dont batch setStates
      if(userSelectionRows.length > 0)
      {
        
        const nrOfColumns = userSelectionRows[0].cells.length;

        for(let i = 0; i < userSelectionRows.length; i++)
        {
          const row = userSelectionRows[i];
          if(nrOfColumns !== row.cells.length)
          {
            console.error("Each row should have the same number of cells")
            R_setJobColumnDesignations([])
            R_setJobHeadings(null)
            R_setJobFirstRowIsHeading(false)
            R_setJobBody([])
            R_setColumnVisibility([])
            return;
          }
        }

        //create data for headings nad column designations
        let tempHeadings: IRow = {cells: [], children: []}
        let tempColumnDesignations: number[] = []
        let colVisibility: boolean[] = []
        for(let k = 0; k < userSelectionRows[0].cells.length; k++)
        {
          tempHeadings.cells.push(createBasicHeadingCell("C" + k, k ))
          tempColumnDesignations.push(0) 
          colVisibility.push(true)
        }


        R_setJobColumnDesignations(tempColumnDesignations)
        R_setJobHeadings(tempHeadings)
        R_setJobFirstRowIsHeading(false)
        R_setJobBody(userSelectionRows)
        R_setColumnVisibility(colVisibility)
        console.log(colVisibility)

        setRouteStatisticsData(null);
        setWaypointOrder([]);
      } 
    }, [userSelectionRows]) //why does this throw a warning when the function is not in the dependency array?

    

    useEffect(() => {
      let jobBodyState: IRow[] = JSON.parse(JSON.stringify(R_jobBody))
      if(R_addresColumIndex === -1)
      {
        let removedRelationsRows = removeRowParentChildRelations(jobBodyState)
        R_setJobBody(removedRelationsRows)
      }
      else
      {
        let removedRelationsRows = removeRowParentChildRelations(jobBodyState) //remove relations as address column may have changed
        let parentWithChildrenRows = makeRowParentChildRelations(removedRelationsRows, R_addresColumIndex) //re-add relations as per new address col
        R_setJobBody(parentWithChildrenRows)
      }

    }, [R_addresColumIndex])

    //END useEffects

    function putFirstRowAsHeading(isHeading: boolean)
    {      
      let tempJobBody: IRow[] =  JSON.parse(JSON.stringify(R_jobBody))
      if(isHeading)
      {
        let bodyRowToColumnRow = tempJobBody.shift()
        R_setJobHeadings(bodyRowToColumnRow)
        R_setJobFirstRowIsHeading(true)
        R_setJobBody(tempJobBody)

      }
      else
      {
        tempJobBody.unshift(R_jobHeadings)
        R_setJobHeadings(createBasicHeadingRow(R_jobHeadings.cells.length))
        R_setJobFirstRowIsHeading(false)
        R_setJobBody(tempJobBody)

      }
    }
    

    //TODO move setStates outside of func, async func setState not batched
    function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      loadSelection().then((selection) => {
        setUserSelectionRows(selection)
        setRouteStatisticsData(null);
        setWaypointOrder([]);
        
      })
     
    }


    function generateRouteStatistics(directions: google.maps.DirectionsResult, directionsIndex: number)
    {
      let legs = directions.routes[directionsIndex].legs;
      let totalDistance = 0;
      let totalTime = 0;
      let order = directions.routes[0].waypoint_order
      for(let i = 0; i < legs.length; i++)
      {
        totalDistance += legs[i].distance.value
        totalTime += legs[i].duration.value
      }

      return {totalDistance, totalTime, order}
    }

    function calcRoute()
    {
      if(R_departureAddress !== "" && R_returnAddress !== "") //test if not "none"
      {
        let waypoints: google.maps.DirectionsWaypoint[]  = [];

        if(R_addressColumIndex > -1)
        {
          for(let i = 0; i < R_jobBody.length; i++)
          {
            waypoints.push({location: R_jobBody[i].cells[R_addressColumIndex].data, stopover: true})
          }
        }

        //TODO check if there are enought tokens available

        makeRouteOnDB(5)

        Promise.all([createDirections(waypoints, true), createDirections(waypoints, false)]).then(res => {

          const fastestRouteStats = generateRouteStatistics(res[0].result, 0)
          const originalRouteStats = generateRouteStatistics(res[1].result, 0)

          setRouteStatisticsData({
            optimized: {dist: fastestRouteStats.totalDistance, time: fastestRouteStats.totalTime }, 
            origional: {dist: originalRouteStats.totalDistance, time: originalRouteStats.totalTime}
          })

          setWaypointOrder(fastestRouteStats.order)

          setFastestRouteResult(res[0])
          setOriginalRouteResult(res[1])
        })
      }
    }

    function createDirections(waypoints: google.maps.DirectionsWaypoint[], optimize: boolean) {

      var request: google.maps.DirectionsRequest = {
        origin: R_departureAddress,
        destination: R_returnAddress,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: optimize
      };

      return new Promise<IRouteResult>((resolve) => {
        let directionsService = new google.maps.DirectionsService();
        directionsService.route(request, (result, status) => {
            resolve({result, status})
        });
      })  
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
            <Tabs value={tabValue} onChange={(_e, v) => (setTabValue(v))}>
              <Tab label="Edit" {...tabProps(0)}/>
              <Tab label="Finalize" {...tabProps(1)}/>
            </Tabs>

            <Box sx={{padding: "0.3em"}}>
              <TabPanel value={tabValue} index={0}>

              <DepartureReturn/>
              
              <Divider sx={{marginTop: "0.5em", marginBottom: "0.5em"}}/>

              <RouteEditor 
                retrieveUserSelectionFromSpreadsheetAndSet={retrieveUserSelectionFromSpreadsheetAndSet}
                handleColumnDesignation={handleColumnDesignation}
                calcRoute={calcRoute}
                putFirstRowAsHeading={putFirstRowAsHeading}
                />

              </TabPanel>

              <TabPanel value={tabValue} index={1}>

                <RouteStatistics routeStatisticsData={routeStatisticsData}/>

                <Divider sx={{marginTop: "0.8em", marginBottom: "0.8em"}}/>

                <RouteSequence waypointOrder={waypointOrder}/>

              </TabPanel>
            </Box>
            
          </Paper>



          <GMap fastestRouteResult={fastestRouteResult} originalRouteResult={originalRouteResult}/>

        </div>
    )
}

export default RouteBuilder