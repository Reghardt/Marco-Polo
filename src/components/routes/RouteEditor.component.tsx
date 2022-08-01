/** @jsxImportSource @emotion/react */

import { Button, FormControl, Grid, MenuItem, Paper, Select, styled, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { IGeocoderResult, IRouteResult, IRouteStatistics, IRow } from "../../interfaces/simpleInterfaces";
import {loadSelection} from "../../services/worksheet.service"
import AddressCell from "../cells/AddressCell.component";
import DataCell from "../cells/DataCell.component";
import HeadingCell from "../cells/HeadingCell.component";
import DestinationAddress from "./DestinationAddress.component";
import { IHeading } from "./interfaces/Heading.interface";
import StartAddress from "./StartAddress.component";
import { ITableData } from "./interfaces/TableData.interface";
import RouteStatistics from "./RouteStatistics.component";
import axios from "axios";
import { getServerUrl } from "../../services/server.service";

export default function RouteEditor()
{
    const [tableData, setTableData] = useState<ITableData>({headings: [], rows: []})


    const map = useRef<google.maps.Map>()
    const geocoder = useRef<google.maps.Geocoder>()
    const directionsService = useRef<google.maps.DirectionsService>()
    const directionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const [addressColIndex, setAddressColIndex] = useState(-1);

    const [startAddress, setStartAddress] = useState("none");
    const [destinationAddress, setDestinationAddress] = useState("none");

    const [routeStatisticsData, setRouteResultData] = useState<IRouteStatistics>()
    
    //console.log("rerender")

    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        geocoder.current = new google.maps.Geocoder();
        directionsService.current = new google.maps.DirectionsService();
        directionsRenderer.current = new google.maps.DirectionsRenderer()
        directionsRenderer.current.setMap(map.current)

    }, [])

    function addMarker()
    {
        const marker = new google.maps.Marker({
            position: { lat: -25.344, lng: 131.031 },
            map: map.current,
          });
    }

    function calcRoute()
    {
      if(startAddress !== "" && destinationAddress !== "")
      {
        let waypoints: google.maps.DirectionsWaypoint[]  = [];
        if(addressColIndex > -1)
        {
          for(let i = 0; i < tableData.rows.length; i++)
          {
            console.log(tableData.rows[i].cells[addressColIndex].data)
            
            waypoints.push({location: tableData.rows[i].cells[addressColIndex].data, stopover: true})
          }
        }

        
        
        Promise.all([calcRouteOptimized(waypoints), calcRouteUnoptimized(waypoints)]).then(res => {
          
          if(res[0].status === "OK")
          {
            directionsRenderer.current.setDirections(res[0].result)
            console.log(res[0].result.routes[0].legs)
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
              setRouteResultData({optimized: {dist: opRouteDistance, time: opRouteTime }, 
                                  origional: {dist: unopRouteDistance, time: unopRouteTime}})
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

    async function retrieveUserSelectionFromSpreadsheetAndSet()
    {
      const retreivedSelection = (await loadSelection()).rows
      console.log(retreivedSelection)

      if(retreivedSelection.length > 0)
      {
        const nrOfColumns = retreivedSelection[0].cells.length;

        for(let i = 0; i < retreivedSelection.length; i++)
        {
          const row = retreivedSelection[i];
          if(nrOfColumns !== row.cells.length)
          {
            console.error("Each row should have the same number of cells - test")
            setTableData({headings: [], rows: []})
            return;
          }
        }

        //create data for headings
        let tempHeadings: IHeading[] = [] 
        for(let k = 0; k < retreivedSelection[0].cells.length; k++)
        {
          tempHeadings.push({index: k ,headingName: "C" + k})
        }

        setTableData({headings: tempHeadings, rows: retreivedSelection})
        setAddressColIndex(-1)
      }  
    }

    function CreateTableHeadings(tableData_headings: IHeading[]) : JSX.Element[]
    {
      const headingRow: JSX.Element[] = [];
      if(tableData_headings.length > 0)
      {
        const elementSize = 12 / tableData_headings.length;
        for(let i = 0; i< tableData_headings.length; i++)
        {
          headingRow.push(
            <Grid item xs={elementSize}>
              <HeadingCell colId={i} addressColIndex={addressColIndex} headingDetails={tableData_headings[i]} updateHeading={updateHeading}/>
            </Grid>
          )
        }
        return headingRow;
      }
      return [];
    }

    function CreateTableBody(tableData_rows: IRow[]) : JSX.Element[][]
    {
      const cellTable: JSX.Element[][] = [];
      if(tableData_rows.length > 0)
      {
        const elementSize = 12 / tableData_rows[0].cells.length;
        
        for(let i = 0; i< tableData_rows.length; i++)
        {
          const row = tableData_rows[i];
          
          for(let j = 0; j < row.cells.length; j++)
          {
            if(cellTable[i] === undefined)
            {
              cellTable[i] = []; //create row at index for table if the index is undefined
            }
            //add elements to table
            if(j === addressColIndex)
            {
              cellTable[i][j] = <Grid item xs={elementSize}> 
              <AddressCell 
                i={i}
                j={j}
                addressColIndex={addressColIndex}
                cellRef={tableData_rows[i].cells[j]}
                geocodeAddress={geocodeAddress}
                updateAddressCell={updateAddressCell}
                // updateDataCell = {updateDataCell}
                />
              </Grid>
            }
            else
            {
              cellTable[i][j] = <Grid item xs={elementSize}> 
              <DataCell 
                i={i}
                j={j}
                addressColIndex={addressColIndex}
                cellRef={tableData_rows[i].cells[j]}
                updateDataCell = {updateDataCell}
                />
              </Grid>
            }
            
          }
        }

        return cellTable
      }
      else
      {
        return []
      }
    }

    function updateHeading(colNr: number, headingData: IHeading)
    {
      const headings = tableData.headings.slice();
      headings[colNr] = headingData;

      setTableData({headings: headings, rows: tableData.rows})
    }

    function updateDataCell(i: number, j: number, updatedData: string)
    {
      const rows = tableData.rows.slice()
      rows[i].cells[j].data = updatedData
      setTableData({headings: tableData.headings, rows: rows})
    }

    function updateAddressCell(i: number, j: number, address: string)
    {
      const rows = tableData.rows.slice()
      rows[i].cells[j].data = address
      setTableData({headings: tableData.headings, rows: rows})
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    function printRows()
    {
      console.log(tableData)
    }
  
    function handleAddressColSelector(value: number | string)
    {
      console.log(value)
      if(typeof value === "string")
      {
        setAddressColIndex(parseInt(value))
        return;
      }
      setAddressColIndex(value)
      
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
            data: tableData,
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
            Job editor
            <Button onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Get Selection</Button>

            <br/>
            <StartAddress startAddress={startAddress} setStartAddress={setStartAddress} geocodeAddress={geocodeAddress}/>
            <br/>
            <DestinationAddress destinationAddress={destinationAddress} setDestinationAddress={setDestinationAddress} geocodeAddress={geocodeAddress}/>
            <br/>

            Designate Address Column:
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              value={addressColIndex}
              onChange={(e) => handleAddressColSelector(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={-1}><em>None</em></MenuItem>
              {tableData.headings.map((elem, idx) => {
                    return <MenuItem value={elem.index} key={idx}>{elem.headingName}</MenuItem>
                  })}
            </Select>

          </FormControl>
          {tableData.rows[0] && (
            <div>
              <Grid container spacing={0.3}>
              {CreateTableHeadings(tableData.headings).map((elem, idx) => {
                    return <React.Fragment key={idx}>{elem}</React.Fragment>
                  })}
              {CreateTableBody(tableData.rows).map((elem, idx) => {
                  return <React.Fragment key={idx}>{elem}</React.Fragment>
                })} 
            </Grid>
            
            <Button onClick={() => calcRoute()}>Calc Route</Button>

            {routeStatisticsData && (
              <div>
                <RouteStatistics routeStatisticsData={routeStatisticsData}/>
              </div>
            )}

            <Button onClick={()=> saveRoute()}>Save</Button>
          </div>
              
          )}
            <div style={{width: "100%", height: 500}} id="map"></div>

        </div>
    )
}