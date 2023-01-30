import { PanToolOutlined } from "@mui/icons-material"
import { Box, Button, Stack, Typography } from "@mui/material"
import React, { useEffect } from "react"
import { ETableMode, useTripStore } from "../../../Zustand/tripStore"
import { createColumnDesignationSelectors, createColumnVisibilityCheckboxes, CreateTableHeadingElements, createTripTableRow, doRowsConform, isAllAddressesInColumnValidAndAccepted, writeBackToSpreadsheet } from "../../../Services/Trip.service"
import { loadSelection } from "../Worksheet/worksheet.service"
import { Driver } from "./Driver/Driver.component"
import TripTableLegends from "./Legends/TripTableLegends.component"
import GridContainer from "../../DragAndDrop/GridContainer"
import GridRow from "../../DragAndDrop/GridRow"
import ConfirmAllAddresses from "./ConfirmAllAddresses/ConfirmAllAddresses"
import { createTripDirections } from "../../../Services/GMap.service"


const TripTable: React.FC = () => {

  const Z_tripRows = useTripStore(store => store.data.rows)
  const Z_columnVisibility = useTripStore(store => store.data.columnVisibility)
  const Z_columnDesignations = useTripStore(store => store.data.columnDesignations)
  const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
  const Z_LinkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)
  const Z_tabelMode = useTripStore(store => store.data.tabelMode)
  const Z_errorMessage = useTripStore(store => store.data.errorMessage)

  const ZF_setTripRows = useTripStore(store => store.actions.setTripRows)
  const ZF_appendRows = useTripStore(store => store.actions.appendRows)
  const ZF_reverseRows = useTripStore(store => store.actions.reverseRows)
  const ZF_setTableMode = useTripStore(store => store.actions.setTableMode)


  //TODO make solveAddresses event based, only needs to fire on solve modes
  useEffect(() => {
    if(Z_tabelMode === ETableMode.AddressSolveMode)
    {
      if(isAllAddressesInColumnValidAndAccepted(Z_addressColumnIndex, Z_tabelMode))
      {
        ZF_setTableMode(ETableMode.EditMode)
      }
    }
    else if(Z_tabelMode === ETableMode.LinkAddressSolveMode)
    {
      if(isAllAddressesInColumnValidAndAccepted(Z_LinkAddressColumnIndex, Z_tabelMode))
      {
        ZF_setTableMode(ETableMode.EditMode)
      }
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
    createTripDirections(false, true)
  }

  function handleReverseOrder()
  {
    ZF_reverseRows()
    createTripDirections(false, true)
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

  function createGridTracks(columnVisibility: boolean[])
  {

    let tracks = "min-content "

    if(Z_tabelMode === ETableMode.AddressSolveMode || Z_tabelMode === ETableMode.LinkAddressSolveMode)
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
    


            <div className={"flex space-x-2"}>
              <div>
                <div className={"text-sm"}>Note: drag and drop rows to change the route sequence </div>
              </div>
              <div>
                <PanToolOutlined fontSize="small"/>
              </div>
            </div>
              
            <Box>
                <Stack direction={"row"} spacing={1} >
                  <Box >
                      <Button  variant="text" onClick={() => {appendRows()}}>Add Selection</Button>
                  </Box>
                  <Box>
                      <Button variant="text" onClick={() => {handleReverseOrder()}}>Reverse Order</Button>
                  </Box>
                  <Box>
                      <Button variant='text' onClick={() => {handleWriteBackToSpreadsheet()}}>Write back</Button>
                  </Box>
                  <Box>
                    <Driver/>
                  </Box>
                </Stack>
            </Box>
            <Box sx={{width: "100%"}}>
                <Button sx={{ width: "100%"}} onClick={() => createTripDirections(true, false)} variant="contained">Find Route</Button>
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