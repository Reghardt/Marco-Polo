import { Button, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useGetUsernameAndTag, useGetWorkspacesQuery } from '../../../trpc-hooks/trpcHooks';

import StandardHeader, { EStandardHeaderConfig } from '../../common/StandardHeader.component';
import TabPanel, { a11yProps } from '../../Tabs/TabPanel.component';
import { CreateWorkspace } from './CreateWorkspace.component';
import { WorkSpaceCard } from './WorkspaceCard.component';





export default function WorkSpaces()
{
    const workspaces = useGetWorkspacesQuery()
    const [tabValue, setTabValue] = useState(0)

    const getUsernameAndTag = useGetUsernameAndTag()

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
                <div className='p-3 space-y-4'>

                    {getUsernameAndTag.data && (
                        <div className='flex items-baseline space-x-1'>
                            <div className='text-sm '>
                                My Username:
                            </div>
                            <div>
                                {getUsernameAndTag.data}
                            </div>
                        </div>
                    )}


                    <div>
                        <div className='text-lg '>Select a workspace:</div>
                    </div>
                    {workspaces.data && workspaces.data.length > 0 && (
                        <div className='space-y-2 '>
                            {workspaces.data.map((elem, idx) => {
                                return <WorkSpaceCard _id={elem._id.toString()} workspaceName={elem.workspaceName} descriptionPurpose={elem.descriptionPurpose} tokens={elem.tokens}  key={idx}/>
                            })}
                        </div>
                    )}
                    {workspaces.isFetched === true && workspaces.data && workspaces.data.length === 0 &&(
                        <div>
                            <div>You currently don't belong to a workspace, click on "Create Workspace" to create one or ask an admin to invite you to an existing workspace.</div>
                        </div>
                    )}

                    <div>
                        <Button variant='contained' onClick={() => workspaces.refetch()}>Refresh</Button>
                    </div>
                </div>
                
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <CreateWorkspace setTabValue={setTabValue}/>
            </TabPanel>

        </div>
    )
    
}

