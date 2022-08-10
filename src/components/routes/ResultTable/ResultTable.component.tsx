import * as React from 'react';
import { IRawRouteTableData } from '../interfaces/RawRouteDataTable.interface';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { IRow } from '../../../services/worksheet/row.interface';
import BodyEntry from './BodyEntry.component';
import { IHeading } from '../interfaces/Heading.interface';
import HeadingEntry from './HeadingEntry.component';

interface ResultTableProps{
  rawRouteTableData: IRawRouteTableData;
  waypointOrder: number[];
}



const ResultTable: React.FC<ResultTableProps> = ({rawRouteTableData, waypointOrder}) => {

  function createTableHeadings(tableData_headings: IHeading[]): JSX.Element[][]
  {
    

    if(tableData_headings.length)
    {
      const elementSize = 11 / tableData_headings.length;
      const headings: JSX.Element[][] = [];

      if(headings[0] === undefined)
        {
          headings[0] = []
        }

      headings[0].push(<Grid item xs={1}>
        <HeadingEntry content={("").toString()}/>
      </Grid>)
      for(let i = 0; i < tableData_headings.length; i++)
      {
        headings[0].push(<Grid item xs={elementSize}>
          <HeadingEntry content={tableData_headings[i].headingName}/>
        </Grid>)

      }
      return headings
    }
    else
    {
      return []
    }
  }

  function createTableBody(tableData_rows: IRow[]) : JSX.Element[][]
  {
    if(tableData_rows.length && waypointOrder.length)
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

  if(rawRouteTableData.rows.length && waypointOrder.length)// Temporary check, the check should rather be in the parent component
  {
    return (
      <React.Fragment>

  
          {createTableHeadings(rawRouteTableData.headings).map((elem, idx) => {
  
          return [
            <Grid container spacing={0.3}>
              <React.Fragment key={idx}>{elem}</React.Fragment>
            </Grid>,
            <Divider sx={{ borderBottomWidth: 1.8 }}/>]
          })}
          
          {createTableBody(rawRouteTableData.rows).map((elem, idx) => {
  
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
