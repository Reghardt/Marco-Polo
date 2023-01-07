import { PanToolOutlined } from "@mui/icons-material"
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material"
import React, { useEffect } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { useTripStore } from "../../../Zustand/tripStore"
//import { ICell } from "../../common/CommonInterfacesAndEnums"
import Dragger from "../../DragNDrop/Dragger.component"
import Dropper from "../../DragNDrop/Dropper.component"
import { calcRoute, createColumnDecorators, createColumnVisibilityOptions, CreateTableHeadingElements, createTripTableRow, doRowsConform, geocodeAddress, reorder, writeBackToSpreadsheet } from "../Trip.service"
import { loadSelection } from "../Worksheet/worksheet.service"
import { Driver } from "./Driver/Driver.component"
import TripTableLegends from "./TripTableLegends.component"

const TripTable: React.FC = () => {

    const Z_tripRows = useTripStore(store => store.data.rows)
    const Z_columnVisibility = useTripStore(store => store.data.columnVisibility)
    const Z_columnDesignations = useTripStore(store => store.data.columnDesignations)
    const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)

    const Z_errorMessage = useTripStore(store => store.data.errorMessage)

    const ZF_setTripRows = useTripStore(store => store.reducers.setTripRows)
    const ZF_appendRows = useTripStore(store => store.reducers.appendRows)
    const ZF_reverseRows = useTripStore(store => store.reducers.reverseRows)

    const ZF_setErrorMessage = useTripStore(store => store.reducers.setErrorMessage)

    const ZF_updateBodyCell = useTripStore(store => store.reducers.updateBodyCell)




    async function solveAddresses(){
      if(Z_addressColumnIndex >= 0)
      {
        for(let i = 0; i < Z_tripRows.length; i++)
        {
          const row = Z_tripRows[i];
          const addressCell = row.cells[Z_addressColumnIndex]

          

          if(addressCell.geoStatusAndRes === null) //if the cell has no geocoded address, find one
          {
            const geoRes = await geocodeAddress(addressCell.displayData)
            ZF_updateBodyCell({...addressCell, geoStatusAndRes: geoRes});
            return;
          }
          else if(addressCell.geoStatusAndRes && addressCell.geoStatusAndRes.status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
          {
            await setTimeout(() => {
              ZF_updateBodyCell({...addressCell, geoStatusAndRes: null});
            }, 2000)
            return;
          }
        }


        // for(let i = 0; i < Z_tripRows.length; i++)
        // {
        //   const row = Z_tripRows[i];
        //   const addressCell = row.cells[Z_addressColumnIndex]
        //   if(addressCell.selectedGeocodedAddressIndex === -1)
        //   {
        //     const geoRes = await geocodeAddress(addressCell.displayData)
        //     console.log(geoRes)
        //     if(geoRes.status === google.maps.GeocoderStatus.OK)
        //     {
        //       if(geoRes.results && geoRes.results.length === 1){
        //         const updatedCell: ICell = JSON.parse(JSON.stringify(addressCell))
        //         updatedCell.selectedGeocodedAddressIndex = 0;
        //         updatedCell.geocodedResults = geoRes.results;
        //         ZF_updateBodyCell(updatedCell)
        //         return;
        //       } 
        //       else if(geoRes.results && geoRes.results.length > 1){
        //         const updatedCell: ICell = JSON.parse(JSON.stringify(addressCell))
        //         updatedCell.selectedGeocodedAddressIndex = -2;
        //         updatedCell.geocodedResults = geoRes.results;
        //         ZF_updateBodyCell(updatedCell)
        //         return;
        //       }
        //     }
        //     else if(geoRes.status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
        //     {
        //       const updatedCell: ICell = JSON.parse(JSON.stringify(addressCell))
        //       updatedCell.selectedGeocodedAddressIndex = -2;
        //     }
        //     else
        //     {
        //       const updatedCell: ICell = JSON.parse(JSON.stringify(addressCell))
        //       updatedCell.selectedGeocodedAddressIndex = -3; //error
        //     }
        //   }
        //   else if(addressCell.selectedGeocodedAddressIndex === -2)
        //   {
        //     setTimeout(() => {
        //       const updatedCell: ICell = JSON.parse(JSON.stringify(addressCell))
        //       updatedCell.selectedGeocodedAddressIndex = -2;
        //     }, 2000)
        //   }
          
        // }
      }
    }

    useEffect(() => {
      
      solveAddresses()
      
      
    }, [Z_tripRows])

    function onDragEnd(result: DropResult)
    {
      if(!result.destination)
      {
          return;
      }
  
      const reorderedRows = reorder(Z_tripRows, result.source.index, result.destination.index)
      ZF_setTripRows(reorderedRows)
      calcRoute(false, true)
    }

    function handleReverseOrder()
    {
      ZF_reverseRows()
      calcRoute(false, true)
    }

    function appendRows()
    {
      loadSelection().then(selection => {
        const conformRes = doRowsConform(selection, Z_tripRows[0])
        if(conformRes.status === false)
        {
          console.error(conformRes.reason)
        }
        else
        {
          ZF_appendRows(selection)
        }
      })
    }

    async function handleWriteBackToSpreadsheet()
    {
      const newRows = await writeBackToSpreadsheet(Z_tripRows, Z_addressColumnIndex)
      console.log(newRows)
      ZF_setTripRows(newRows)
    }

    async function handleCalcFastestRoute()
    {
      const routeRes = await calcRoute(true, false)
      console.log(routeRes.status)
      if(routeRes.status){
        ZF_setErrorMessage("");
      }
      else{
        ZF_setErrorMessage(routeRes.msg)
      }
    }

    function ConfirmAllAddressesAsAcceptedButton()
    {
      function confirmAll()
      {
        for(let i = 0; i < Z_tripRows.length; i++)
        {
          const cell = Z_tripRows[i].cells[Z_addressColumnIndex]
          ZF_updateBodyCell({...cell, isGeoResAccepted: true})
        }
      }

      if(Z_addressColumnIndex >= 0)
      {
        for(let i = 0; i < Z_tripRows.length; i++)
        {
          const cell = Z_tripRows[i].cells[Z_addressColumnIndex]
          if(cell.isGeoResAccepted === false)
          {
            return(
              <Box sx={{display: "flex", justifyContent:"right"}}>
                <Button onClick={() => confirmAll()} variant="outlined">Confirm all</Button>
              </Box>
            )
          }
        }
      }
      return <></>
    }

    

    if(Z_tripRows.length > 0)
    {
      return(
        <Box>

            <Box sx={{marginBottom: "0.8em"}}>
              <TripTableLegends/>
            </Box>

            <Box sx={{marginBottom: "0.5em"}}>
              <Typography variant="body2">Show/Hide Columns:</Typography>
              {createColumnVisibilityOptions(Z_tripRows[0], Z_columnVisibility)}
            </Box>

            <Grid container spacing={0.3} sx={{paddingBottom: "1px"}}>
              {createColumnDecorators(Z_columnVisibility)}
            </Grid>
            <Grid container spacing={0.3}>
              {CreateTableHeadingElements(Z_tripRows[0], Z_columnVisibility)}
            </Grid>

            <Box sx={{p: "0.3em"}}>
              <Divider/>
            </Box>
            


            <DragDropContext onDragEnd={onDragEnd}>
                <Dropper droppableId="droppable">
                    {Z_tripRows.map((row, idx) => {
                    return (
                        <Dragger key={row.cells[0].y} draggableId={row.cells[0].y.toString()} index={idx}>
                            {createTripTableRow(row, idx, Z_columnDesignations, Z_columnVisibility)}
                        </Dragger>)
                    })}
                </Dropper>                    
            </DragDropContext>

            <Stack sx={{marginTop: "1em"}} spacing={1}>
              <ConfirmAllAddressesAsAcceptedButton/>
              <Box>
                <Stack direction={"row"} spacing={1}>
                  <Box>
                    <Typography variant="body2">Note: drag and drop rows to change the route sequence </Typography>
                  </Box>
                  <Box>
                    <PanToolOutlined fontSize="small"/>
                  </Box>
                </Stack>
                
              </Box>
              <Box>
                  <Stack direction={"row"} spacing={1} >
                    <Box >
                        <Button  variant="outlined" onClick={() => {appendRows()}}>Add Selection</Button>
                    </Box>
                    <Box>
                        <Button variant="outlined" onClick={() => {handleReverseOrder()}}>Reverse Order</Button>
                    </Box>
                    <Box>
                        <Button variant='outlined' onClick={() => {handleWriteBackToSpreadsheet()}}>Write back</Button>
                    </Box>
                  </Stack>
                  
              </Box>
              <Box sx={{width: "100%"}}>
                  <Button sx={{ width: "100%"}} onClick={() => handleCalcFastestRoute()} variant="outlined">Find Route</Button>
              </Box>
              
              <Box sx={{width: "100%"}}>
                <Driver/>
              </Box>


              <Box>
                  <Typography variant="body1" sx={{color: "red"}}>{Z_errorMessage}</Typography>
              </Box>
            </Stack>
        </Box>
      )
    }
    else
    {
        return(
          <Box sx={{backgroundColor: "lightGrey", height: "10em", justifyContent:"center", alignItems: "center", display: "flex", marginBottom: "1em"}}>
              <Typography align="center" variant="body1" gutterBottom sx={{paddingLeft: "0.5em", paddingRight: "0.5em"}}>No data selected. <br/>Select the desired addresses and their corresponding data in Excel then press "Use Current Selection" to begin</Typography>
          </Box>
        )
    }
}

export default TripTable