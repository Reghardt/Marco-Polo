import * as React from 'react';
import { IRawRouteTableData } from '../interfaces/RawRouteDataTable.interface';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { IRow } from '../../../services/worksheet/row.interface';
import BodyEntry from './BodyEntry.component';
import { IHeading } from '../interfaces/Heading.interface';
import HeadingEntry from './HeadingEntry.component';
import { useRecoilValue } from 'recoil';
import { RSJobHeadings } from '../../../state/globalstate';

interface IResultTableProps{
  inSequenceJobBody: IRow[];
  waypointOrder: number[];
}



const ResultTable: React.FC<IResultTableProps> = ({inSequenceJobBody, waypointOrder}) => {

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

  function createTableBody(tableData_rows: IRow[]) : JSX.Element[][]
  {
    if(tableData_rows.length > 0 && waypointOrder.length > 0)
    {
      const elementSize = 11 / tableData_rows[0].cells.length;
      const cellTable: JSX.Element[][] = [];
      for(let i = 0; i < waypointOrder.length; i++)
      {
        const accessElementIndex = waypointOrder[i]
        if(cellTable[i] === undefined)
        {
          cellTable[i] = []
        }

        cellTable[i].push(<Grid item xs={1}>
          <BodyEntry content={(i+1).toString()}/>
        </Grid>)
        
        const row = tableData_rows[accessElementIndex]
        for(let j = 0; j < row.cells.length; j++)
        {
          
          cellTable[i].push(<Grid item xs={elementSize}>
            <BodyEntry content={row.cells[j].data}/>
          </Grid>)
        }
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

export default ResultTable;
