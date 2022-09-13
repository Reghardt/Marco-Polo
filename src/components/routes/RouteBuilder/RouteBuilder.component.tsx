/** @jsxImportSource @emotion/react */

import { Box, Button, Divider, IconButton, Paper, Stack, styled, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import {IRouteResult, IRouteStatistics } from "../../../interfaces/simpleInterfaces";
import {loadSelection} from "../../../services/worksheet/worksheet.service"
import DestinationAddress from "./DestinationAddress.component";
import { IHeading } from "../interfaces/Heading.interface";
import StartAddress from "./StartAddress.component";
import { IRawRouteTableData } from "../interfaces/RawRouteDataTable.interface";
import RouteStatistics from "../RouteStatistics.component";
import axios from "axios";
import { getServerUrl } from "../../../services/server.service";

import { useRecoilState, useRecoilValue } from "recoil";
import { RSAddresColumIndex, RSBearerToken, RSJobBody, RSJobColumnDesignations, RSJobFirstRowIsHeading, RSJobHeadings, RSJobID, RSTokens, RSWorkspaceID } from "../../../state/globalstate";
import RawRouteDataTableEditor from "../RouteDataEditor/RawRouteDataTableEditor.component";
import RouteSequence from "../../Sequence/RouteSequence.component";
import { EColumnDesignations, handleSetColumnAsAddress, handleSetColumnAsData } from "../../../services/ColumnDesignation.service";
import { IRow } from "../../../services/worksheet/row.interface";

import StandardHeader from "../../common/StandardHeader.component";
//import { createBasicHeadingCell } from "../Route.service";
import { createBasicHeadingCell, createBasicHeadingRow } from "../../workspaces/workspace.service";

enum EDisplayRoute{
  Fastest,
  Original
}

const RouteBuilder: React.FC = () =>
{
    const [R_jobColumnDesignations, R_setJobColumnDesignations] = useRecoilState(RSJobColumnDesignations)
    const [R_jobHeadings, R_setJobHeadings] = useRecoilState(RSJobHeadings)
    const [R_jobFirstRowIsHeading, R_setJobFirstRowIsHeading] = useRecoilState(RSJobFirstRowIsHeading)
    const [R_jobBody, R_setJobBody] = useRecoilState(RSJobBody)

    const R_addresColumIndex = useRecoilValue(RSAddresColumIndex)
    

    const [userSelectionRows, setUserSelectionRows] = useState<IRow[]>([])

    const map = useRef<google.maps.Map>()
    const directionsService = useRef<google.maps.DirectionsService>()
    const fastestRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()
    const originalRouteDirectionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const [startAddress, setStartAddress] = useState("none");
    const [destinationAddress, setDestinationAddress] = useState("none");
  
    const [routeStatisticsData, setRouteStatisticsData] = useState<IRouteStatistics>(null)
    
    const jobId = useRecoilValue(RSJobID)
    const R_workspaceId = useRecoilValue(RSWorkspaceID)

    const [waypointOrder, setWaypointOrder] = useState<number[]>([])

    const R_addressColumIndex = useRecoilValue(RSAddresColumIndex)

    const R_bearer = useRecoilValue(RSBearerToken)

    const [R_tokens, R_setTokens] = useRecoilState(RSTokens)

    const [fastestRouteResult, setFastestRouteResult] = useState<IRouteResult>(null)
    const [originalRouteResult, setOriginalRouteResult] = useState<IRouteResult>(null)

    const [routeToDisplay, setRouteToDisplay] = useState<EDisplayRoute>(EDisplayRoute.Fastest)

    console.log("refresh")

    //START: useEffects

    //Creates map on mount
    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        
        directionsService.current = new google.maps.DirectionsService();
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
    }, [])

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
            return;
          }
        }

        //create data for headings nad column designations
        let tempHeadings: IRow = {cells: [], children: []}
        let tempColumnDesignations: number[] = []
        for(let k = 0; k < userSelectionRows[0].cells.length; k++)
        {
          tempHeadings.cells.push(createBasicHeadingCell("C" + k, k ))
          tempColumnDesignations.push(0) 
        }

        fastestRouteDirectionsRenderer.current.setMap(null)
        originalRouteDirectionsRenderer.current.setMap(null)
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer()


        R_setJobColumnDesignations(tempColumnDesignations)
        R_setJobHeadings(tempHeadings)
        R_setJobFirstRowIsHeading(false)
        R_setJobBody(userSelectionRows)

        setRouteStatisticsData(null);
        setWaypointOrder([]);
      } 
    }, [userSelectionRows]) //why does this throw a warning when the function is not in the dependency array?

    useEffect(() => {
      if(fastestRouteResult && originalRouteResult && fastestRouteResult.status === "OK" && originalRouteResult.status === "OK")
      {
        const fastestRouteStats = getRouteDistance_Time_WaypointOrder(fastestRouteResult.result, 0)
        const originalRouteStats = getRouteDistance_Time_WaypointOrder(originalRouteResult.result, 0)
        
        fastestRouteDirectionsRenderer.current.setDirections(fastestRouteResult.result)
        originalRouteDirectionsRenderer.current.setDirections(originalRouteResult.result)
        fastestRouteDirectionsRenderer.current.setMap(map.current)
        originalRouteDirectionsRenderer.current.setMap(null)

        //TODO route cost calculation
        makeRouteOnDB(5).then(res => {
          console.log(res)

          setWaypointOrder(fastestRouteStats.order)
          setRouteStatisticsData({
            optimized: {dist: fastestRouteStats.totalDistance, time: fastestRouteStats.totalTime }, 
            origional: {dist: originalRouteStats.totalDistance, time: originalRouteStats.totalTime}
          })
        })
      }
      else
      {
        //TODO handle errors
      }
    }, [fastestRouteResult, originalRouteResult])

    useEffect(() => {
      if(R_addresColumIndex === -1)
      {
        let jobBodyState: IRow[] = JSON.parse(JSON.stringify(R_jobBody))
        console.log("reset parent- children")
        let childlessJobBody: IRow[] = [];
        for(let i = 0; i < jobBodyState.length; i++)
        {
          childlessJobBody.push(jobBodyState[i])
          let children = jobBodyState[i].children
          
          for(let j = 0; j < children.length; j++)
          {
            childlessJobBody.push(children[j])
          }
          jobBodyState[i].children = []
        }
        R_setJobBody(childlessJobBody)
      }
      else
      {
        console.log("make parent- children")
        let jobBodyState: IRow[] = JSON.parse(JSON.stringify(R_jobBody))
        let parentsBody: IRow[] = [];
        for(let i = 0; i < jobBodyState.length; i++)
        {
          if(jobBodyState[i].cells[R_addresColumIndex].data !== "")
          {
            parentsBody.push(jobBodyState[i])
          }
          else
          {
            if(parentsBody.length > 0 && parentsBody[parentsBody.length - 1].cells[R_addresColumIndex].data !== "")
            {
              let lastParent = parentsBody[parentsBody.length - 1]
              lastParent.children.push(jobBodyState[i])
            }
            else
            {
              parentsBody.push(jobBodyState[i])
            }
            
          }
        }
        R_setJobBody(parentsBody)
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
    async function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      setUserSelectionRows(await loadSelection())
      setRouteStatisticsData(null);
      setWaypointOrder([]);
      fastestRouteDirectionsRenderer.current.setMap(null)
    }


    function removeDirections()
    {
      fastestRouteDirectionsRenderer.current.setMap(null)
      setTimeout(() => {
        fastestRouteDirectionsRenderer.current.setMap(map.current)
      },4000)
    }

    function getRouteDistance_Time_WaypointOrder(directions: google.maps.DirectionsResult, directionsIndex: number)
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
      if(startAddress !== "" && destinationAddress !== "") //test if not "none"
      {
        let waypoints: google.maps.DirectionsWaypoint[]  = [];

        if(R_addressColumIndex > -1)
        {
          for(let i = 0; i < R_jobBody.length; i++)
          {
            waypoints.push({location: R_jobBody[i].cells[R_addressColumIndex].data, stopover: true})
          }
        }

        Promise.all([createDirections(waypoints, true), createDirections(waypoints, false)]).then(res => {
          setFastestRouteResult(res[0])
          setOriginalRouteResult(res[1])
        })
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

    function createDirections(waypoints: google.maps.DirectionsWaypoint[], optimize: boolean) {

      var request: google.maps.DirectionsRequest = {
        origin: startAddress,
        destination: destinationAddress,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: optimize
      };

      return new Promise<IRouteResult>((resolve) => {
        directionsService.current.route(request, (result, status) => {
            resolve({result, status})
        });
      })  
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

  
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

  
    // function saveRoute()
    // {
    //   axios.post(getServerUrl() + "/job/save",
    //     {
    //         workspaceId: R_workspaceId,
    //         jobId: jobId.jobId,
    //         data: R_rawRouteTableData,
    //     },
    //     {
    //       //add bearer
    //     }).then(res => {
    //         console.log(res.data)
    //     }).catch(err => {
    //         console.error(err)
    //     })
    // }

    function handleRouteToDisplay(value: EDisplayRoute)
    {
      if(value === EDisplayRoute.Fastest)
      {
        fastestRouteDirectionsRenderer.current.setMap(null)
        fastestRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
          map: map.current,
          preserveViewport: true,
          directions: fastestRouteResult.result
        })
        originalRouteDirectionsRenderer.current.setMap(null)
        setRouteToDisplay(value)
      }
      else if(value === EDisplayRoute.Original)
      {
        originalRouteDirectionsRenderer.current.setMap(null)
        originalRouteDirectionsRenderer.current = new google.maps.DirectionsRenderer({
          map: map.current,
          preserveViewport: true,
          directions: originalRouteResult.result
        })
        fastestRouteDirectionsRenderer.current.setMap(null)
        setRouteToDisplay(value)
      }
    }

    return(
        <div>
          <StandardHeader title="Route Builder" backNavStr="/routeMenu"/>


          <div style={{padding: "0.3em"}}>
            <Button variant="outlined" onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Import Selection</Button>

            <Stack spacing={0.8} sx={{marginTop: "0.5em", marginBottom: "1em"}}>
              <Box>
                <StartAddress startAddress={startAddress} setStartAddress={setStartAddress}/>
              </Box>
              <Box>
                <DestinationAddress destinationAddress={destinationAddress} setDestinationAddress={setDestinationAddress}/>
              </Box>
            </Stack>

            {R_jobBody.length > 0 && (
              <div>
                <RawRouteDataTableEditor 
                  handleColumnDesignation={handleColumnDesignation}
                  calcRoute={calcRoute}
                  putFirstRowAsHeading={putFirstRowAsHeading}
                />

                {routeStatisticsData && (
                    <RouteStatistics routeStatisticsData={routeStatisticsData}/>
                )}
                {/* <Button onClick={()=> saveRoute()}>Save</Button> */}
                
                {waypointOrder.length > 0 && (
                    <RouteSequence waypointOrder={waypointOrder}/>
                )}
              </div>
            )}

            <Paper sx={{padding: "10px", color:"#1976d2"}} variant="elevation" elevation={5}>

              {/* <Button onClick={() => {removeDirections()}}>Remove</Button> */}
              <Typography variant="h5" gutterBottom >Google Maps</Typography>

              <Stack direction={"row"} spacing={1} alignItems="center" sx={{marginBottom: "1em"}}>
                  <Box>
                    <ToggleButtonGroup
                      sx={{maxHeight:"100%", height: "100%"}}
                      size="small"
                      color="primary"
                      value={routeToDisplay}
                      exclusive
                      onChange={(_e, v) => {handleRouteToDisplay(v)}}
                      aria-label="Address Type"
                      
                      >
                        <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EDisplayRoute.Fastest}>Fastest Route</ToggleButton>
                        <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EDisplayRoute.Original}>Original Route</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Stack>

              
              <div style={{width: "100%", height: 500}} id="map"></div>
            </Paper>
          </div>

          
        </div>
    )
}

export default RouteBuilder