import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getServerUrl } from '../../services/server.service';
import { RSBearerToken } from '../../state/globalstate';
import WorkSpaceCard from './WorkspaceCard.component';

export default function WorkSpaces()
{
    const R_bearer = useRecoilValue(RSBearerToken)
    
    const [workspaces, setWorkspaces] = useState([])
    let navigate = useNavigate();



    
    const getWorkspaces = () =>{
        console.log("bearer test fired")
        console.log(R_bearer)
        return axios.post(getServerUrl() + "/workspace/list",
        {},
        {
            headers: {authorization: R_bearer}
        }).then((res) => {
            
            console.log("response received", res)
            return res.data;
        }).catch((err) => {
            console.error(err.response)
            return err;
        })
    }

    useEffect(() => {
        console.log("fetch data")
        getWorkspaces()
        .then((res: any[]) => {
            console.log(res)
            setWorkspaces(res)
        })
    }, [])

    return(
        <div>
            <div>
                <h1>Workspaces</h1>
                <Button onClick={() => navigate("/createWorkspace", {replace: true})}>Create New Workspace</Button>
                {/* <button onClick={() => bearerTest()}>Press me</button>
                {bearer} */}
                
                <div>
                    {workspaces.map((elem, idx) => {
                        return <WorkSpaceCard name={elem.workspaceName} id={elem._id} key={idx}/>

                    })}
                </div>
            </div> 
        </div>
    )
    
}

