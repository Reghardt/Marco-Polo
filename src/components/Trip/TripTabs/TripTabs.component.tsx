import { Box, Button, Checkbox, FormControlLabel, Grid, Stack, Tab, Tabs, Typography } from "@mui/material"
import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { EColumnDesignations } from "../../../services/ColumnDesignation.service";
import { IRow } from "../../../services/worksheet/row.interface";
import { RSColumnVisibility, RSTripRows, RSJobFirstRowIsHeading, RSJobHeadings, RSTripTabValue } from "../../../state/globalstate";

import RouteSequence from "../../Sequence/RouteSequence.component";
import RouteEditor from "../TripEditor/TripEditor";
import TripStatistics from "../TripStatistics/TripStatistics.component";

import { TabPanel, tabProps } from "./TripTabs.service";

interface ITripTabs{
    retrieveUserSelectionFromSpreadsheetAndSet: () => void;
    handleColumnDesignation: (colIdx: number, colValue: EColumnDesignations) => void;
    calcRoute: () => void;
    putFirstRowAsHeading: (isHeading: boolean) => void;
}

const TripTabs: React.FC<ITripTabs> = ({retrieveUserSelectionFromSpreadsheetAndSet, handleColumnDesignation, calcRoute, putFirstRowAsHeading}) => {

    console.log("Trip tabs refresh")

    const [R_tripTabValue, R_setTripTabValue] = useRecoilState(RSTripTabValue);

    const [R_jobBody, R_setJobBody] = useRecoilState(RSTripRows)

    const R_jobHeadings = useRecoilValue(RSJobHeadings)

    const [R_columnVisibility, R_setColumnVisibility] = useRecoilState(RSColumnVisibility)

    const R_jobFirstRowIsHeading = useRecoilValue(RSJobFirstRowIsHeading)

    function createColumnVisibilityOptions(columnNames: IRow, columnVisibility: boolean[])
    {
      let visibilityElements = 
        <Grid container sx={{paddingBottom: "1em", paddingTop: "0.3em"}}>
          {columnNames.cells.map((elem, idx) => {
            return  <Grid item xs="auto" sx={{margin: 0, padding: 0}}>
                      <FormControlLabel  control={<Checkbox sx={{paddingTop: 0, paddingBottom: 0}} checked={columnVisibility[idx]} 
                        onChange={(_e) => {R_setColumnVisibility((visibility) => {
                          let newVisibility = [...visibility]
                          newVisibility[idx] = _e.target.checked
                          return newVisibility
                        })}}/>} label={elem.data} />
                    </Grid>
          })}
        </Grid>

      return visibilityElements
    }
    
    return(
        <Box>
            {/* TODO Add route statistics tab */}
            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Trip Solver</Typography>
            <Tabs value={R_tripTabValue} onChange={(_e, v) => (R_setTripTabValue(v))}>
            <Tab label="Edit" {...tabProps(0)}/>
            <Tab label="Sequence/Writeback" {...tabProps(1)}/>
            <Tab label="Trip Statistics" {...tabProps(2)}/>
            </Tabs>

            <Box sx={{paddingTop: "0.3em"}}>

            <TabPanel value={R_tripTabValue} index={0}>
                <Button variant="outlined" sx={{marginBottom: "1em"}} onClick={() => retrieveUserSelectionFromSpreadsheetAndSet()}>Import Selection</Button>

                {R_jobBody.length > 0 && (
                    <div>
                        <Stack spacing={0} sx={{marginBottom:"1em"}}>
                            <Box>
                            <FormControlLabel control={<Checkbox checked={R_jobFirstRowIsHeading} onChange={(e) => {putFirstRowAsHeading(e.target.checked)}}/>} label="Use first row as heading" />
                            </Box>
                        </Stack>
                        
                        <Typography variant="body2">Show/Hide Columns:</Typography>
                        {createColumnVisibilityOptions(R_jobHeadings, R_columnVisibility)}
                        
                    </div>
                )}

                <RouteEditor handleColumnDesignation={handleColumnDesignation} calcRoute={calcRoute}/>

            </TabPanel>

            <TabPanel value={R_tripTabValue} index={1}>
            {R_jobBody.length > 0 && (
                    <div>
                        <Typography variant="body2">Show/Hide Columns:</Typography>
                        {createColumnVisibilityOptions(R_jobHeadings, R_columnVisibility)}
                    </div>
                )}

                <RouteSequence/>

            </TabPanel>

            <TabPanel value={R_tripTabValue} index={2}>
                <TripStatistics/>
            </TabPanel>
            </Box>
            
        </Box>
    )
}

export default TripTabs