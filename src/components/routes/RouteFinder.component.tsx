/** @jsxImportSource @emotion/react */

import { Button, FormControl, MenuItem, Paper, Select, styled, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { IGeocoderResult, IRouteResult, IRouteStatistics } from "../../interfaces/simpleInterfaces";
import {loadSelection} from "../../services/worksheet/worksheet.service"
import DestinationAddress from "./DestinationAddress.component";
import { IHeading } from "./interfaces/Heading.interface";
import StartAddress from "./StartAddress.component";
import { IRawRouteTableData } from "./interfaces/RawRouteDataTable.interface";
import RouteStatistics from "./RouteStatistics.component";
import axios from "axios";
import { getServerUrl } from "../../services/server.service";

import { useRecoilState, useRecoilValue } from "recoil";
import { RSAddresColumIndex, RSColumnDesignations, RSFirstRowIsColumn, RSJobID, RSWorkspaceID } from "../../state/globalstate";
import RawRouteDataTableEditor from "./RouteDataEditor/RawRouteDataTableEditor.component";
import WriteBack from "./writeback/Writeback.component";
import RouteSequence from "../Sequence/RouteSequence.component";
import { EColumnDesignations, handleSetColumnAsAddress, handleSetColumnAsData } from "../../services/ColumnDesignation.service";
import { IRow } from "../../services/worksheet/row.interface";

const RouteFinder: React.FC = () =>
{
    const [rawRouteTableData, setRawRouteTableData] = useState<IRawRouteTableData>({headings: [], rows: []})
    const [userSelectionRows, setUserSelectionRows] = useState<IRow[]>([])

    const map = useRef<google.maps.Map>()
    const geocoder = useRef<google.maps.Geocoder>()
    const directionsService = useRef<google.maps.DirectionsService>()
    const directionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const [R_columnDesignations, R_setColumnDesignations] = useRecoilState(RSColumnDesignations);

    const [startAddress, setStartAddress] = useState("none");
    const [destinationAddress, setDestinationAddress] = useState("none");
    const [, R_firstRowIsColumn] = useRecoilState(RSFirstRowIsColumn)

    const [routeStatisticsData, setRouteStatisticsData] = useState<IRouteStatistics>(null)
    
    const [jobId, setJobId] = useRecoilState(RSJobID)
    const workspaceId = useRecoilValue(RSWorkspaceID)

    const [waypointOrder, setWaypointOrder] = useState<number[]>([])

    const R_addressColumIndex = useRecoilValue(RSAddresColumIndex)

    console.log("refresh")



    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        geocoder.current = new google.maps.Geocoder();
        directionsService.current = new google.maps.DirectionsService();
        directionsRenderer.current = new google.maps.DirectionsRenderer()
        directionsRenderer.current.setMap(map.current)
        // axios.post(getServerUrl() + "/job/load",
        // {
        //     workspaceId: workspaceId,
        //     jobId: jobId.jobId,
        // },
        // {
        //   //add bearer
        // }).then(res => {
        //     console.log(res.data)
        //     setRawRouteTableData({headings: res.data.job.headings, rows: res.data.job.rows})
        // }).catch(err => {
        //     console.error(err)
        // })

    }, [])

    useEffect(() => {
      console.log("user selection changed")
      if(userSelectionRows.length > 0)
      {
        const nrOfColumns = userSelectionRows[0].cells.length;

        for(let i = 0; i < userSelectionRows.length; i++)
        {
          const row = userSelectionRows[i];
          if(nrOfColumns !== row.cells.length)
          {
            console.error("Each row should have the same number of cells")
            setRawRouteTableData({headings: [], rows: []})
            return;
          }
        }

        //create data for headings
        let tempHeadings: IHeading[] = [] 
        for(let k = 0; k < userSelectionRows[0].cells.length; k++)
        {
          tempHeadings.push({index: k ,headingName: "C" + k})
        }

        setRawRouteTableData({headings: tempHeadings, rows: userSelectionRows});
        setRouteStatisticsData(null);
        setWaypointOrder([]);
        R_setColumnDesignations(new Array(userSelectionRows[0].cells.length).fill(0));
      } 
    }, [R_setColumnDesignations, userSelectionRows]) //why does this throw a warning when the function is not in the dependency array?

    async function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      setUserSelectionRows(await loadSelection())
    }

    function putFirstRowAsHeading(isHeadings: boolean)
    {
      if(isHeadings)
      {
        let tempUserSelectionRows = JSON.parse(JSON.stringify(userSelectionRows)) as IRow[];
        let firstRow = tempUserSelectionRows[0]
        let tempHeadings: IHeading[] = [] 
        for(let i = 0; i< firstRow.cells.length; i++)
        {
          tempHeadings.push({index: i, headingName: firstRow.cells[i].data})
        }
        tempUserSelectionRows.shift()
        setRawRouteTableData({headings: tempHeadings, rows: tempUserSelectionRows})
      }
      else
      {
        let tempHeadings: IHeading[] = [] 
        for(let k = 0; k < userSelectionRows[0].cells.length; k++)
        {
          tempHeadings.push({index: k ,headingName: "C" + k})
        }
        setRawRouteTableData({headings: tempHeadings, rows: userSelectionRows});
        
      }
      R_firstRowIsColumn(isHeadings)
    }

    function addMarker()
    {
        const marker = new google.maps.Marker({
            position: { lat: -25.344, lng: 131.031 },
            map: map.current,
          });
    }

    function calcRoute()
    {
      
      if(startAddress !== "" && destinationAddress !== "") //test if not "none"
      {
        let waypoints: google.maps.DirectionsWaypoint[]  = [];
        if(R_addressColumIndex > -1)
        {
          for(let i = 0; i < rawRouteTableData.rows.length; i++)
          {
            console.log(rawRouteTableData.rows[i].cells[R_addressColumIndex].data)
            
            waypoints.push({location: rawRouteTableData.rows[i].cells[R_addressColumIndex].data, stopover: true})
          }
        }

        Promise.all([calcRouteOptimized(waypoints), calcRouteUnoptimized(waypoints)]).then(res => {
          
          if(res[0].status === "OK")
          {
            directionsRenderer.current.setDirections(res[0].result)
            console.log(res[0].result)
            setWaypointOrder(res[0].result.routes[0].waypoint_order)
            let oplegs = res[0].result.routes[0].legs;
            let opRouteDistance = 0;
            let opRouteTime = 0;
            for(let i = 0; i < oplegs.length; i++)
            {
              opRouteDistance += oplegs[i].distance.value
              opRouteTime += oplegs[i].duration.value
            }

            if(res[1].status === "OK")
            {
              let unoplegs = res[1].result.routes[0].legs;
              console.log(res[1].result.routes[0].legs)
              let unopRouteDistance = 0;
              let unopRouteTime = 0;
              for(let i = 0; i < unoplegs.length; i++)
              {
                unopRouteDistance += unoplegs[i].distance.value
                unopRouteTime += unoplegs[i].duration.value
              }
              console.log("Fastest", opRouteDistance, opRouteTime)
              console.log("Unop", unopRouteDistance, unopRouteTime)
              setRouteStatisticsData({
                optimized: {dist: opRouteDistance, time: opRouteTime }, 
                origional: {dist: unopRouteDistance, time: unopRouteTime}
              })
            }
            else
            {
              console.error("UnOp Route status not OK")
            }
          }
          else
          {
            console.error("Fastest Route status not OK")
          }
        })
      }
      
    }

    function calcRouteOptimized(waypoints: google.maps.DirectionsWaypoint[]) {

      var request: google.maps.DirectionsRequest = {
        origin: startAddress,
        destination: destinationAddress,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      };

      return new Promise<IRouteResult>((resolve) => {
        directionsService.current.route(request, (result, status) => {
            resolve({result, status})
        });
      })  
    }

    function calcRouteUnoptimized(waypoints: google.maps.DirectionsWaypoint[]) {

      var request: google.maps.DirectionsRequest = {
        origin: startAddress,
        destination: destinationAddress,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
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
      if(colValue === EColumnDesignations.Data)
      {
        R_setColumnDesignations(handleSetColumnAsData(colIdx, R_columnDesignations))
      }
      else if(colValue === EColumnDesignations.Address)
      {
        R_setColumnDesignations(handleSetColumnAsAddress(colIdx, R_columnDesignations))
      }
    }

    function geocodeAddress(address: string) : Promise<IGeocoderResult>
    {
      let geoResPromise = new Promise<IGeocoderResult>((resolve) => {
        geocoder.current.geocode({address: address, region: "ZA"},(res, status) => {
          resolve({status, results: res})
        })
      })

      return geoResPromise;
    }

    function saveRoute()
    {
      axios.post(getServerUrl() + "/job/save",
        {
            workspaceId: workspaceId,
            jobId: jobId.jobId,
            data: rawRouteTableData,
        },
        {
          //add bearer
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.error(err)
        })
    }



    return(
        <div>
            <Typography variant="h4" gutterBottom >Route Finder</Typography>
            <Button onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Load Selection From Excel</Button>

            <br/>
            <StartAddress startAddress={startAddress} setStartAddress={setStartAddress} geocodeAddress={geocodeAddress}/>
            <br/>
            <DestinationAddress destinationAddress={destinationAddress} setDestinationAddress={setDestinationAddress} geocodeAddress={geocodeAddress}/>
            <br/>

          {rawRouteTableData.rows[0] && (
            <div>
              <RawRouteDataTableEditor 
                rawRouteTableData={rawRouteTableData} 
                setRawRouteTableData={setRawRouteTableData} 
                handleColumnDesignation={handleColumnDesignation}
                geocodeAddress={geocodeAddress}
                calcRoute={calcRoute}
                putFirstRowAsHeading={putFirstRowAsHeading}
              />

              <div style={{padding:"0.5em"}}/>
              
              {routeStatisticsData && (
                <div>
                  <RouteStatistics routeStatisticsData={routeStatisticsData}/>
                </div>
              )}
              {/* <Button onClick={()=> saveRoute()}>Save</Button> */}
              <div style={{padding:"0.5em"}}/>

              {waypointOrder.length > 0 && (
                <React.Fragment>
                  <RouteSequence rawRouteTableData={rawRouteTableData} waypointOrder={waypointOrder}/>
                  
                </React.Fragment>
                
              )}
            </div>
            

          )}
          <div style={{padding:"0.5em"}}/>
          <Paper>
            <div style={{width: "100%", height: 500}} id="map"></div>
          </Paper>
          
        </div>
    )
}

export default RouteFinder