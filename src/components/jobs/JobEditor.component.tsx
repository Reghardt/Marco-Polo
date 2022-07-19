/** @jsxImportSource @emotion/react */

import { Button, Grid, Paper, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { Row } from "../../interfaces/simpleInterfaces";
import {loadSelection} from "../../services/worksheet.service"
import Cell from "../cells/Cell.component";

import { css } from '@emotion/react'
import { useRecoilState } from "recoil";
import { SelectedCells } from "../../state/globalstate";




export default function JobEditor()
{
    const [selectionData, setSelectionData] = useRecoilState<Row[]>(SelectedCells)

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
        });
      }

    async function getSelectedCells()
    {
        const selectionRows = (await loadSelection()).rows

        console.log(selectionRows)

        setSelectionData(selectionRows)
        //console.log(CreateTable(selectionRows))
    }

    function CreateTable(selecData: Row[])
    {
      const tableData: JSX.Element[][] = [];
      if(selecData.length > 0)
      {
        
        for(let i = 0; i< selecData.length; i++)
        {
          const row = selecData[i];
          const elementSize = 12 / row.cells.length
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
                j ={j}
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

    function testFunc(i: number)
    {
      console.log(i)
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
        console.log(selectionData)
      }

    return(
        <div>
            Job editor
            <Button onClick={() => getSelectedCells()}>Get Selection</Button>
            <Button onClick={() => printRows()}>Print</Button>
            <Grid container spacing={0.3}>
              {CreateTable(selectionData).map((elem, idx) => {
                  return <React.Fragment key={idx}>{elem}</React.Fragment>
                })} 
            </Grid>


            <div style={{width: "100%", height: 500}} id="map"></div>
            <Button onClick={() => addMarker()}>Add Marker</Button>
            <Button onClick={() => calcRoute()}>Calc Route</Button>




              


        </div>
    )
}