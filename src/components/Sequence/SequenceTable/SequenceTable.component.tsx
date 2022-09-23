import * as React from 'react';

import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { IRow } from '../../../services/worksheet/row.interface';
import BodyEntry from './BodyEntry.component';

import HeadingEntry from './HeadingEntry.component';
import { useRecoilValue } from 'recoil';
import { RSJobHeadings } from '../../../state/globalstate';
import { createEntryTypeElementsFromRow } from './SequenceTable.service';

interface ISequenceTableProps{
  inSequenceJobBody: IRow[];
  waypointOrder: number[];
}



const SequenceTable: React.FC<ISequenceTableProps> = ({inSequenceJobBody, waypointOrder}) => {

  const R_jobHeadings = useRecoilValue(RSJobHeadings)

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

  if(inSequenceJobBody.length > 0 && waypointOrder.length > 0)// Temporary check, the check should rather be in the parent component
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
          
          {createTableBody(inSequenceJobBody).map((elem, idx) => {
  
            return [
            <Grid container spacing={0.3}>
              <React.Fragment key={idx}>
                {elem}
                </React.Fragment>
              </Grid>, 
              <Divider />]
          })}
      </React.Fragment>
    );
  }
  else{
    return(<React.Fragment></React.Fragment>)
  }
}

export default SequenceTable;
