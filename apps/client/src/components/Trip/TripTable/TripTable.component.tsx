import { PanToolOutlined } from "@mui/icons-material"
import { Box, Button, Stack, Typography } from "@mui/material"
import React, { useEffect } from "react"
import { ETableMode, useTripStore } from "../../../Zustand/tripStore"
import { calcRoute, createColumnDesignationSelectors, createColumnVisibilityCheckboxes, CreateTableHeadingElements, createTripTableRow, doRowsConform, isAllAddressesInColumnValidAndAccepted, writeBackToSpreadsheet } from "../../../Services/Trip.service"
import { loadSelection } from "../Worksheet/worksheet.service"
import { Driver } from "./Driver/Driver.component"
import TripTableLegends from "./Legends/TripTableLegends.component"
import GridContainer from "../../DragAndDrop/GridContainer"
import GridRow from "../../DragAndDrop/GridRow"
import ConfirmAllAddresses from "./ConfirmAllAddresses/ConfirmAllAddresses"


const TripTable: React.FC = () => {

  const Z_tripRows = useTripStore(store => store.data.rows)
  const Z_columnVisibility = useTripStore(store => store.data.columnVisibility)
  const Z_columnDesignations = useTripStore(store => store.data.columnDesignations)
  const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
  const Z_toAddressColumnIndex = useTripStore(store => store.data.goToAddressColumnIndex)
  const Z_tabelMode = useTripStore(store => store.data.tabelMode)
  const Z_errorMessage = useTripStore(store => store.data.errorMessage)

  const ZF_setTripRows = useTripStore(store => store.reducers.setTripRows)
  const ZF_appendRows = useTripStore(store => store.reducers.appendRows)
  const ZF_reverseRows = useTripStore(store => store.reducers.reverseRows)
  const ZF_setErrorMessage = useTripStore(store => store.reducers.setErrorMessage)
  // const ZF_updateBodyCell = useTripStore(store => store.reducers.updateBodyCell)
  const ZF_setTableMode = useTripStore(store => store.reducers.setTableMode)


  // async function solveAddresses(columnIndex: number){
  //   if(columnIndex >= 0)
  //   {
  //     for(let i = 0; i < Z_tripRows.length; i++)
  //     {
  //       const row = Z_tripRows[i];
  //       const addressCell = row.cells[columnIndex]

  //       if(addressCell.geocodedDataAndStatus === null) //if the cell has no geocoded address, find one
  //       {
  //         const geoRes = await geocodeAddress(addressCell.displayData)
  //         ZF_updateBodyCell({...addressCell, geocodedDataAndStatus: geoRes});
  //         return;
  //       }
  //       else if(addressCell.geocodedDataAndStatus && addressCell.geocodedDataAndStatus.status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
  //       {
  //         await setTimeout(() => {
  //           ZF_updateBodyCell({...addressCell, geocodedDataAndStatus: null});
  //         }, 2000)
  //         return;
  //       }
  //     }
  //   }
  // }

  useEffect(() => {
    if(Z_tabelMode === ETableMode.AddressSolveMode)
    {
      if(isAllAddressesInColumnValidAndAccepted(Z_addressColumnIndex))
      {
        ZF_setTableMode(ETableMode.EditMode)
      }
      //solveAddresses(Z_addressColumnIndex) //TODO make solveAddresses event based, only needs to fire on solve modes
    }
    else if(Z_tabelMode === ETableMode.GoToAddressSolveMode)
    {
      if(isAllAddressesInColumnValidAndAccepted(Z_toAddressColumnIndex))
      {
        ZF_setTableMode(ETableMode.EditMode)
      }
      //solveAddresses(Z_toAddressColumnIndex) //TODO make solveAddresses event based, only needs to fire on solve modes
    }

  }, [Z_tripRows])

  function onDragEnd(sequence: number[])
  {
    console.log(sequence)
    const rearrangedRows: any[] = []
    for(let i = 0; i < sequence.length; i++)
    {
      for(let j = 0; j < Z_tripRows.length; j++)
      {
        if(Z_tripRows[j]?.cells[0]?.y === sequence[i])
        {
          rearrangedRows.push(Z_tripRows[j])
        }
      }
    }
    console.log(sequence, rearrangedRows)

    ZF_setTripRows(rearrangedRows)
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
    if(routeRes.status){
      ZF_setErrorMessage("");
    }
    else{
      ZF_setErrorMessage(routeRes.msg)
    }
  }





  function createGridTracks(columnVisibility: boolean[])
  {

    let tracks = "min-content "

    if(Z_tabelMode === ETableMode.AddressSolveMode || Z_tabelMode === ETableMode.GoToAddressSolveMode)
    {
      tracks += "auto min-content"
    }
    else
    {
      columnVisibility.forEach(vis => {
        if(vis)
        {
          tracks += "auto "
        }
      })
    }


    return tracks
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
            {createColumnVisibilityCheckboxes(Z_tripRows[0]!, Z_columnVisibility)}
          </Box>

          <GridContainer onDragEnd={onDragEnd} tracks={createGridTracks(Z_columnVisibility)}>

            {createColumnDesignationSelectors(Z_columnVisibility)}

            {CreateTableHeadingElements(Z_tripRows[0]!, Z_columnVisibility)}

            {Z_tripRows.map((row, idx) => {
              return(
                <GridRow key={Math.random()} draggableId={row.cells[0]!.y}>
                  {
                    createTripTableRow(row, idx, Z_columnDesignations, Z_columnVisibility)
                  }
                </GridRow>
                  
              )})
            }                   
          </GridContainer>

          <Stack sx={{marginTop: "1em"}} spacing={1}>
            <ConfirmAllAddresses/>

            {Z_errorMessage && (
              <Box>
                <Typography variant="body1" sx={{color: "red"}}>{Z_errorMessage}</Typography>
              </Box>
            )}
    

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