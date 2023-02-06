import { DeleteOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetLastUsedWorkspace } from "../../../trpc-hooks/trpcHooks";
import { useAuthStore } from "../../../Zustand/authStore";
import { IWorkspace } from "../../common/CommonInterfacesAndEnums";




export const WorkSpaceCard: React.FC<IWorkspace> = ({_id, workspaceName, descriptionPurpose, tokens}) =>
{
    const navigate = useNavigate();
    const ZF_setToken = useAuthStore(store => store.actions.setToken)

    const setLastUsedWorkspace = useSetLastUsedWorkspace({
        doOnSuccess: (res) => {
            ZF_setToken(res)
            navigate("/trip", {replace: true})
        }
    })

    async function setSelectionAndNavigate()
    {
        setLastUsedWorkspace.mutate({workspaceId: _id})
        
    }
    
    return(
        <>
            <div style={{width: "300px", boxShadow: "",}}> 
                <div className="grid items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100" style={{gridTemplateColumns: "1fr min-content"}}>
                    <div>
                        <button onClick={() => {setSelectionAndNavigate()}} className="text-left " style={{textTransform: "none"}}>
                            <div>
                                <div className=" text-[#1976d2]" >{workspaceName}</div>
                                <div>{descriptionPurpose}</div>
                                <div>{tokens}</div>
                            </div>
                        </button>
                    </div>
                    <div>
                        <Tooltip title={"Delete Workspace"}>
                            <IconButton>
                                <DeleteOutline color="error"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    )
}

