/** @jsxImportSource @emotion/react */

import { Button, FormControl, Grid, MenuItem, Paper, Select, styled, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { GeocoderResult, Row } from "../../interfaces/simpleInterfaces";
import {loadSelection} from "../../services/worksheet.service"
import AddressCell from "../cells/AddressCell.component";
import DataCell from "../cells/DataCell.component";
import HeadingCell from "../cells/HeadingCell.component";
import { Heading } from "./Heading.interface";
import { TableData } from "./TableData.interface";

export default function RouteEditor()
{
    const [tableData, setTableData] = useState<TableData>({headings: [], rows: []})


    const map = useRef<google.maps.Map>()
    const geocoder = useRef<google.maps.Geocoder>()
    const directionsService = useRef<google.maps.DirectionsService>()
    const directionsRenderer = useRef<google.maps.DirectionsRenderer>()

    const [addressColIndex, setAddressColIndex] = useState(-1);

    const [startAddress, setStartAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    
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

    function calcRoute() {

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
  
          var request: google.maps.DirectionsRequest = {
            origin: startAddress,
            destination: destinationAddress,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
          };
          directionsService.current.route(request, (result, status) => {
            console.log(status)
            if (status === 'OK') {
              directionsRenderer.current.setDirections(result)
            }
            else
            {
              console.log(status)
            }
          });
        }


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
        let tempHeadings: Heading[] = [] 
        for(let k = 0; k < retreivedSelection[0].cells.length; k++)
        {
          tempHeadings.push({index: k ,headingName: "C" + k})
        }

        setTableData({headings: tempHeadings, rows: retreivedSelection})
        setAddressColIndex(-1)
      }  
    }

    function CreateTableHeadings(tableData_headings: Heading[]) : JSX.Element[]
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

    function CreateTableBody(tableData_rows: Row[]) : JSX.Element[][]
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

    function updateHeading(colNr: number, headingData: Heading)
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

    function geocodeAddress(address: string) : Promise<GeocoderResult>
    {
      let geoResPromise = new Promise<GeocoderResult>((resolve) => {
        geocoder.current.geocode({address: address, region: "ZA"},(res, status) => {
          resolve({status, results: res})
        })
      })

      return geoResPromise;
    }

    function handleStartAddress(addr: string)
    {
      setStartAddress(addr)
    }

    function handleDestinationAddress(addr: string)
    {
      setDestinationAddress(addr)
    }

    return(
        <div>
            Job editor
            <Button onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Get Selection</Button>
            <Button onClick={() => printRows()}>Print</Button>

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
            
            <br/>
            <TextField onChange={(e) => handleStartAddress(e.target.value)} label="Start Address"></TextField>
            <br/>
            <TextField onChange={(e) => handleDestinationAddress(e.target.value)} label="Destination Address"></TextField>
            <br/>
            <Button onClick={() => calcRoute()}>Calc Route</Button>
          </div>
              
          )}
            <div style={{width: "100%", height: 500}} id="map"></div>

        </div>
    )
}