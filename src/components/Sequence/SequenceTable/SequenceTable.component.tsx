import * as React from 'react';

import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { IRow } from '../../../services/worksheet/row.interface';
import BodyEntry from './BodyEntry.component';

import HeadingEntry from './HeadingEntry.component';
import { useRecoilValue } from 'recoil';
import { RSJobHeadings } from '../../../state/globalstate';
import { createEntryTypeElementsFromRow } from './SequenceTable.service';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Dropper from '../../experiments/DragNDrop/Dropper.component';
import Dragger from '../../experiments/DragNDrop/Dragger.component';

interface ISequenceTableProps{
  inSequenceJobBody: IRow[];
  waypointOrder: number[];
}


//TODO why is waypoint order included when the rows are already in sequence?
const SequenceTable: React.FC<ISequenceTableProps> = ({inSequenceJobBody, waypointOrder}) => {

  const R_jobHeadings = useRecoilValue(RSJobHeadings)

  const [localSequence, setLocalSequence] = useState<IRow[]>([])
  console.log(localSequence)

  useEffect(() => {
    setLocalSequence(inSequenceJobBody)
  }, [inSequenceJobBody])

  function createTableHeadings(headings: IRow): JSX.Element[][]
  {
    

    if(headings.cells.length)
    {
      const elementSize = 11 / headings.cells.length;
      const heaingElements: JSX.Element[][] = [];

      if(heaingElements[0] === undefined)
        {
          heaingElements[0] = []
        }

      heaingElements[0].push(<Grid item xs={1}>
        <HeadingEntry content={("").toString()}/>
      </Grid>)
      for(let i = 0; i < headings.cells.length; i++)
      {
        heaingElements[0].push(<Grid item xs={elementSize}>
          <HeadingEntry content={headings.cells[i].data}/>
        </Grid>)

      }
      return heaingElements
    }
    else
    {
      return []
    }
  }

  function createTableBody(rows: IRow[]) : JSX.Element[][]
  {
    if(rows.length > 0 && waypointOrder.length > 0 && rows.length === waypointOrder.length)
    {
      const cellTable: JSX.Element[][] = [];
      for(let i = 0; i < waypointOrder.length; i++)
      {
        cellTable.push(...createEntryTypeElementsFromRow(rows[i], (i + 1).toString(), false))
      }
      return cellTable
    }
    else{
      return [];
    }
  }

  function reorder(list: IRow[], startIndex: number, endIndex: number )
  {
    // for(let i = 0; i < list.length; i++)
    // {
    //   if(list[i].cells[0].y === startIndex)
    //   {
    //     startIndex = i;
    //     break;
    //   }
    // }

    // for(let i = 0; i < list.length; i++)
    // {
    //   if(list[i].cells[0].y === endIndex)
    //   {
    //     endIndex = i;
    //     break;
    //   }
    // }

    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    console.log("start", startIndex)
    console.log("end", endIndex)
    console.log(result)
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
          {createTableHeadings(R_jobHeadings).map((elem, idx) => {
  
          return [
            <Grid container spacing={0.3}>
              <React.Fragment key={idx}>{elem}</React.Fragment>
            </Grid>,
            <Divider sx={{ borderBottomWidth: 1.8 }}/>]
          })}

          
          <DragDropContext onDragEnd={onDragEnd}>
            <Dropper droppableId="droppable">
              {localSequence.map((elem, idx) => {
                console.log("elem has", elem)

                return <Dragger key={elem.cells[0].y} draggableId={elem.cells[0].y.toString()} index={idx}>
                  {elem.cells[0].data}
                </Dragger>
                 
                
              })}
            </Dropper>
            
          </DragDropContext>
          
      </React.Fragment>
    );
  }
  else{
    return(<React.Fragment></React.Fragment>)
  }
}

export default SequenceTable;
