import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetWorkspacesQuery } from '../../../trpc-hooks/trpcHooks';

import StandardHeader, { EStandardHeaderConfig } from '../../common/StandardHeader.component';
import TabPanel, { a11yProps } from '../../Tabs/TabPanel.component';
import { CreateWorkspace } from './CreateWorkspace.component';
import { WorkSpaceCard } from './WorkspaceCard.component';





export default function WorkSpaces()
{
    const workspaces = useGetWorkspacesQuery()
    const [tabValue, setTabValue] = useState(0)

    return(
        <div>
            <StandardHeader 
                title='Workspaces' 
                tokenCountConfig={EStandardHeaderConfig.Hidden} 
                tokenStoreConfig={EStandardHeaderConfig.Disabled}
                adminPanelConfig={EStandardHeaderConfig.Disabled}
            />
            
            <Tabs value={tabValue} onChange={(_e, v) => {setTabValue(v)}} aria-label="workspace tabs">
                <Tab label={"My Workspaces"} {...a11yProps(0)}/>
                <Tab label={"Create Workspace"} {...a11yProps(1)}/>
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Box sx={{p: "0.5em"}}>
                    {workspaces.data && workspaces.data.length > 0 && (
                        <Box>
                            {workspaces.data.map((elem, idx) => {
                                return <WorkSpaceCard _id={elem._id.toString()} workspaceName={elem.workspaceName} descriptionPurpose={elem.descriptionPurpose} tokens={elem.tokens}  key={idx}/>
                            })}
                        </Box>
                    )}
                    {workspaces.isFetched === true && workspaces.data && workspaces.data.length === 0 &&(
                        <Box>
                            <Typography variant="body1">You currently don't belong to a workspace, click on "Create Workspace" to create one or ask an admin to invite you to an existing workspace.</Typography>
                        </Box>
                    )}
                </Box>
                
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <CreateWorkspace setTabValue={setTabValue}/>
            </TabPanel>

        </div>
    )
    
}

