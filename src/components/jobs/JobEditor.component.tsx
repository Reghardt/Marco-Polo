/** @jsxImportSource @emotion/react */

import { Button, Grid, Paper, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { Row } from "../../interfaces/simpleInterfaces";
import {loadSelection} from "../../services/worksheet.service"
import Cell from "../cells/Cell.component";

import { css } from '@emotion/react'






export default function JobEditor()
{
    const [userSelection, setUserSelection] = useState<Row[]>([])

    const map = useRef<google.maps.Map>()
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    
    console.log("rerender")

    useEffect(() => {
        const center: google.maps.LatLngLiteral = {lat: -25.74, lng: 28.22};
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {center, zoom: 8})
        directionsRenderer.setMap(map.current);
    }, [])

    function addMarker()
    {
        const marker = new google.maps.Marker({
            position: { lat: -25.344, lng: 131.031 },
            map: map.current,
          });
    }

    function calcRoute() {

        var request: google.maps.DirectionsRequest = {
          origin: "Pretoria",
          destination: "Cape Town",
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
          if (status == 'OK') {
            directionsRenderer.setDirections(result);
          }
          else
          {
            console.log(status)
          }
        });
      }

    async function retrieveUserSelectionFromSpreadsheetAndSet()
    {
        const retreivedSelection = (await loadSelection()).rows

        console.log(retreivedSelection)

        setUserSelection(retreivedSelection)
    }

    function CreateTable(local_userSelection: Row[])
    {
      const tableData: JSX.Element[][] = [];
      if(local_userSelection.length > 0)
      {
        const nrOfRowElements = local_userSelection[0].cells.length;

        for(let i = 0; i< local_userSelection.length; i++)
        {
          
          const row = local_userSelection[i];
          const elementSize = 12 / row.cells.length;

          if(row.cells.length !== nrOfRowElements)
          {
            console.error("Each row should have the same number of cells")
            return []
          }
          
          for(let j = 0; j < row.cells.length; j++)
          {
            if(tableData[i] === undefined)
            {
              tableData[i] = [];
            }
            // tableData[i][j] = <Grid item xs={elementSize}><Button variant="contained" style={{width: "100%", justifyContent: "flex-start"}}>{row.cells[j].data}</Button></Grid>
            tableData[i][j] = <Grid item xs={elementSize}>
              <Cell 
                i={i}
                j={j}
                cellRef={local_userSelection[i].cells[j]}
                testFunc = {testFunc}
    
                />
            </Grid>
          }
        }
        return tableData
      }
      else
      {
        return [];
      }
    }

    function testFunc(i: number, j: number, updatedData: string)
    {
      const rows = userSelection.slice()
      rows[i].cells[j].data = updatedData
      setUserSelection(rows)
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
        console.log(userSelection)
      }

    return(
        <div>
            Job editor
            <Button onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Get Selection</Button>
            <Button onClick={() => printRows()}>Print</Button>
            <Grid container spacing={0.3}>
              {CreateTable(userSelection).map((elem, idx) => {
                  return <React.Fragment key={idx}>{elem}</React.Fragment>
                })} 
            </Grid>


            <div style={{width: "100%", height: 500}} id="map"></div>
            <Button onClick={() => addMarker()}>Add Marker</Button>
            <Button onClick={() => calcRoute()}>Calc Route</Button>




              


        </div>
    )
}