import React, { useRef, useState } from "react"
import TripTableLegends from "./TripTableLegends.component"
import { useTripStore } from "../../zustand/tripStore"
import { loadSelection } from "../../services/Excel.service"

import { calcRoute, createColumnDecorators, createColumnVisibilityOptions, CreateTableHeadingElements, createTripTableRow, doRowsConform, generateGridTemplateColumns, geocodeAddress, writeBackToSpreadsheet } from "../../services/Trip.service"
import StandardButton from "../../ui/StandardButton"
import { IRow } from "../../common/interfaces"
import GridContainer from "../DragAndDrop/GridContainer"


const TripTable: React.FC = () => {

  const rowRefs = useRef(new Array<HTMLDivElement | null>())
  const [dragStartElemId, setDragStartElemId] = useState("")

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
            console.log(geoRes)
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
      }
    }

    // useEffect(() => {
      
    //   solveAddresses()
      
      
    // }, [Z_tripRows])

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

    function reorder(list: IRow[], startIndex: number, endIndex: number )
    {
      console.log(startIndex, endIndex)
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }

    function handleOnDrop(endIndex: number)
    {
      const reorderedRows = reorder(Z_tripRows, parseInt(dragStartElemId) , endIndex)  
      ZF_setTripRows(reorderedRows)
      //make endIndex startIndex
      setDragStartElemId(endIndex.toString())
    }

    function rearrangeOnDrop(sequence: number[])
    {
      //console.log(sequence)
      const rearrangedRows: any[] = []
      for(let i = 0; i < sequence.length; i++)
      {
        for(let j = 0; j < Z_tripRows.length; j++)
        {
          if(Z_tripRows[j].cells[0].y === sequence[i])
          {
            rearrangedRows.push(Z_tripRows[j])
          }
        }
      }
      //console.log(sequence, rearrangedRows)
  
      ZF_setTripRows(rearrangedRows)
    }

    

    if(Z_tripRows.length > 0)
    {
      return(
        <div>

            <div>
              <TripTableLegends/>
            </div>

            <div>
              <div>Show/Hide Columns:</div>
              {createColumnVisibilityOptions(Z_tripRows[0], Z_columnVisibility)}
            </div>


            <GridContainer rearrangeOnDrop={rearrangeOnDrop}>

              
              
              {createColumnDecorators(Z_columnVisibility)}

              {/* Why does this work? */}
              {CreateTableHeadingElements(Z_tripRows[0], Z_columnVisibility)}

              {Z_tripRows.map((row, idx) => {
                return createTripTableRow(row, idx, Z_columnDesignations, Z_columnVisibility)
              })}   
            </GridContainer>


            <div>
              <div className="flex flex-row flex-wrap">
                <div >
                    <StandardButton onClick={() => {appendRows()}}>Add Selection</StandardButton>
                </div>
                <div>
                    <StandardButton onClick={() => {handleReverseOrder()}}>Reverse Order</StandardButton>
                </div>
                <div>
                    <StandardButton onClick={() => {handleWriteBackToSpreadsheet()}}>Write back</StandardButton>
                </div>
              </div>

              <div>
                  <StandardButton onClick={() => handleCalcFastestRoute()} >Find Route</StandardButton>
              </div>
              <div>
                  <div>{Z_errorMessage}</div>
              </div>
            </div>
        </div>
      )
    }
    else
    {
        return(
          <div>
              <div>No data selected. <br/>Select the desired addresses and their corresponding data in Excel then press &quotUse Current Selection&quot to begin</div>
          </div>
        )
    }
}

export default TripTable