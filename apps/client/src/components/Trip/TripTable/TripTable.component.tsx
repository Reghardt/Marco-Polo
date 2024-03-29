import { Button } from "@mui/material"
import React from "react"
import { ETableMode, useTripStore } from "../../../Zustand/tripStore"
import { createColumnDesignationSelectors, createColumnVisibilityCheckboxes, CreateTableHeadingElements, createTripTableRow, doRowsConform, solveAddresses, writeBackToSpreadsheet } from "../../../Services/Trip.service"
import { loadSelection } from "../Worksheet/worksheet.service"
import { Driver } from "./Driver/Driver.component"
import GridContainer from "../../DragAndDrop/GridContainer"
import GridRow from "../../DragAndDrop/GridRow"
import ConfirmAllAddresses from "./ConfirmAllAddresses/ConfirmAllAddresses"
import { createTripDirections } from "../../../Services/GMap.service"
import CreateAddress from "./CreateAddress/CreateAddress.component"


const TripTable: React.FC = () => {

  const Z_tripRows = useTripStore(store => store.data.rows)
  const Z_columnVisibility = useTripStore(store => store.data.columnVisibility)
  const Z_columnDesignations = useTripStore(store => store.data.columnDesignations)
  const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
  const Z_linkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)
  const Z_tabelMode = useTripStore(store => store.data.tabelMode)
  const Z_errorMessage = useTripStore(store => store.data.errorMessage)

  const ZF_setTripRows = useTripStore(store => store.actions.setTripRows)
  const ZF_appendRows = useTripStore(store => store.actions.appendRows)
  const ZF_reverseRows = useTripStore(store => store.actions.reverseRows)


  function retrieveUserSelectionFromSpreadsheetAndSet()
  {
    const ZF_setRowsAsNewTrip = useTripStore.getState().actions.setRowsAsNewTrip
    const ZF_clearAndSetTripDirections = useTripStore.getState().actions.clearAndSetTripDirections

    loadSelection().then((selection) => {
      console.log(selection)
      if(selection.length > 0)
      {
        const conformRes = doRowsConform(selection)
        console.log(conformRes)
        if(conformRes.status === false)
        {
          ZF_setRowsAsNewTrip([])
          return;
        }
        ZF_setRowsAsNewTrip(selection)
        ZF_clearAndSetTripDirections(null)
      } 
    })
  }

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
        //solve address column then solve link address column
        solveAddresses(Z_addressColumnIndex)
        solveAddresses(Z_linkAddressColumnIndex)
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

  // if(Z_tripRows.length > 0)
  // {
    return(
      <div className="flex flex-col space-y-4 ">
        <div className={"mb-2"}>
          <Button variant="contained"  onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Use Current Selection</Button>
        </div>

        {Z_tripRows.length > 0 && (
          <div>
            <div>
              <div>Show/Hide Columns:</div>
              {createColumnVisibilityCheckboxes(Z_tripRows[0]!, Z_columnVisibility)}
            </div>

            <div className="space-y-2 ">

              <GridContainer onDragEnd={onDragEnd} tracks={createGridTracks(Z_columnVisibility)}>
                {CreateTableHeadingElements(Z_tripRows[0]!, Z_columnVisibility)}
                {createColumnDesignationSelectors(Z_columnVisibility)}

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
              <ConfirmAllAddresses/>
              {Z_errorMessage && (
                <div>
                  <div style={{color: "red"}}>{Z_errorMessage}</div>
                </div>
              )}

            </div>
          </div>
        )}

        {Z_tripRows.length === 0 && (
          <div className={"flex flex-col bg-slate-200 h-40 items-center justify-center p-4 text-center "}>
            <div>No trip sheet selected.</div>
            <div>Box select rows in Excel to import then click "Use Current Selection" to begin.</div>
            <div>Or</div>
            <div>Add a new address below</div>
          </div>
        )}

        <CreateAddress/>

        {Z_tripRows.length > 0 && (
          <div>
            <div className={"flex flex-wrap gap-2"}>
              <div>
                  <Button  variant="text" onClick={() => {appendRows()}}>Add Selection</Button>
              </div>

              <div>
                  <Button variant="text" onClick={() => {handleReverseOrder()}}>Reverse Order</Button>
              </div>

              <div>
                  <Button variant='text' onClick={() => {handleWriteBackToSpreadsheet()}}>Write back</Button>
              </div>

              <div>
                <Driver/>
              </div>
            </div>
          </div>
        )}

        <div className={"w-full"}>
          <Button className={"w-full"} disabled={Z_tripRows.length === 0}  variant="contained" onClick={() => createTripDirections(true, false)}>Find Route</Button>
        </div>
 


      </div>
    )
  }
  // else
  // {
  //     return(
  //       <div className={"flex flex-col bg-slate-200 h-40 items-center justify-center p-4 text-center "}>

  //           <div>No trip sheet selected.</div>
  //           <div>Box select rows in Excel to import then click "Use Current Selection" to begin</div>

  //           <CreateAddress/>
  //       </div>
  //     )
  // }
// }

export default TripTable