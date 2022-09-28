import * as React from 'react';

import { Box, Button, Divider, Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { IRow } from '../../../services/worksheet/row.interface';
import BodyEntry from './BodyEntry.component';

import HeadingEntry from './HeadingEntry.component';
import { useRecoilValue } from 'recoil';
import { RSAddresColumIndex, RSColumnVisibility, RSJobHeadings } from '../../../state/globalstate';
import { createEntryTypeElementsFromRow, preSyncRowDataForWriteBack, writeBackToSpreadsheet } from './SequenceTable.service';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Dropper from '../../experiments/DragNDrop/Dropper.component';
import Dragger from '../../experiments/DragNDrop/Dragger.component';
import HelpTooltip from '../../common/HelpTooltip.component';
import { removeRowParentChildRelations } from '../../Trip/Trip.service';

interface ISequenceTableProps{
  inSequenceJobBody: IRow[];
  waypointOrder: number[];
}

enum EAddressType{
  Original,
  Google
}


//TODO why is waypoint order included when the rows are already in sequence?
const SequenceTable: React.FC<ISequenceTableProps> = ({inSequenceJobBody, waypointOrder}) => {

  const [addressType, setAddressType] = useState<EAddressType>(EAddressType.Original)

  const R_columnVisibility = useRecoilValue(RSColumnVisibility)

  const R_jobHeadings = useRecoilValue(RSJobHeadings)

  const R_addressColumnIndex = useRecoilValue(RSAddresColumIndex)

  const [localSequence, setLocalSequence] = useState<IRow[]>([])
  console.log(localSequence)

  useEffect(() => {
    setLocalSequence(inSequenceJobBody)
  }, [inSequenceJobBody])

  

  function createTableHeadings(headings: IRow, columnVisibility: boolean[]): JSX.Element
  {
  
    if(headings.cells.length)
    {
      let nrOfVisibleColumns = 0;
      for(let i = 0; i < columnVisibility.length; i++)
      {
          if(columnVisibility[i])
          {
              nrOfVisibleColumns++
          }
      }

      const elementSize = 11 / nrOfVisibleColumns;
      let head = <React.Fragment>
        <Grid container>
          <Grid item xs={1}>
            <HeadingEntry content={("").toString()}/>
          </Grid>
          {headings.cells.map((cell, index) => {
            if(columnVisibility[index] === true)
            {
              return <Grid item xs={elementSize}>
                <HeadingEntry content={cell.data}/>
              </Grid>
              
            }
            else
            {
              return <></>
            }
            
          })}
        </Grid>
      <Divider sx={{ borderBottomWidth: 1.8 }}/>
      </React.Fragment>
      
      
      return head
    }
    else
    {
      return <></>
    }
  }


  function reorder(list: IRow[], startIndex: number, endIndex: number )
  {

    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }


  function onDragEnd(result: DropResult)
  {
      if(!result.destination)
      {
          return;
      }

      const newItems = reorder(localSequence, result.source.index, result.destination.index)
      //console.log("new items", newItems)
      setLocalSequence(newItems)
    }

  if(localSequence.length > 0 && waypointOrder.length > 0)// Temporary check, the check should rather be in the parent component
  {
    return (
      <React.Fragment>

        <Stack spacing={1}>
            <Box>
                <Stack direction={"row"} spacing={1} alignItems="center">
                    <Box>
                        <ToggleButtonGroup
                            sx={{maxHeight:"100%", height: "100%"}}
                            size="small"
                            color="primary"
                            value={addressType}
                            exclusive
                            onChange={(_e, v) => {setAddressType(v)}}
                            aria-label="Address Type"
                            >
                                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EAddressType.Original}>Original Addresses</ToggleButton>
                                <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EAddressType.Google}>Google Maps Addresses</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Box>
                        <HelpTooltip title="Swap between the given addresses and the corresponding addresses found on google maps. The address type selected will be written back to the spreadsheet as shown in the table below."/>
                    </Box>

                </Stack>
            </Box>
            <Box>
                <Button variant="outlined">Reverse Order</Button>
            </Box>
        </Stack>
        {createTableHeadings(R_jobHeadings, R_columnVisibility)}

        
        <DragDropContext onDragEnd={onDragEnd}>
          <Dropper droppableId="droppable">
            {localSequence.map((row, idx) => {

              return (
                <Dragger key={row.cells[0].y} draggableId={row.cells[0].y.toString()} index={idx}>
                  
                  {createEntryTypeElementsFromRow(row, idx, R_columnVisibility)}
                </Dragger>)
            })}
          </Dropper>
          
        </DragDropContext>

        <div style={{marginTop: "1em"}}>
                        <Button onClick={() => {writeBackToSpreadsheet(localSequence, R_addressColumnIndex)}}>Write back</Button>
                        <Button>Reset Spreadsheet</Button>
                    </div>
          
      </React.Fragment>
    );
  }
  else{
    return(<React.Fragment></React.Fragment>)
  }
}

export default SequenceTable;
