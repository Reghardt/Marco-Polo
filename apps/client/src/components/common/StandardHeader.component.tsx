import { Menu, NavigateBefore } from "@mui/icons-material"
import { IconButton,  Typography } from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import MenuDrawer from "../Menu/MenuDrawer.component";

interface StandardHeaderProps{
    title: string;
    backNavStr?: string;
    tokenCountConfig?: EStandardHeaderConfig;
    tokenStoreConfig?: EStandardHeaderConfig;
    adminPanelConfig?: EStandardHeaderConfig
}

export enum EStandardHeaderConfig{
    Hidden,
    Disabled,
    Visible
    
}

const StandardHeader: React.FC<StandardHeaderProps> = (
        {
            title, 
            backNavStr = "", 
            tokenCountConfig = EStandardHeaderConfig.Visible,
            tokenStoreConfig = EStandardHeaderConfig.Visible,
            adminPanelConfig = EStandardHeaderConfig.Visible,
        }) => {

    if(tokenStoreConfig && adminPanelConfig)
    {
        //remove, here to ignore unused error
    }

    const navigate = useNavigate();

    const [drawerState, setDrawerState] = useState(false)

    function handleDrawerState()
    {
      setDrawerState(!drawerState)
    }

    return(
        <div>
            <div className={"flex justify-between m-1"}>
                
                <div style={{display: "flex", alignItems: "center"}}>
                    
                    {backNavStr.length > 0 && (
                        <div>
                            <IconButton size="small" onClick={() => {navigate(backNavStr, {replace: true})}}>
                                <NavigateBefore fontSize="small" sx={{color: "#1976d2", paddingBottom: "2px"}}/>
                            </IconButton>
                        </div>
                    )}

                    <div style={{marginLeft: "5px"}}>
                        <Typography variant="body1" sx={{color: "#1976d2", fontWeight: "bold"}}>{title}</Typography>
                    </div>
                </div>
                
                <div style={{display: "flex", alignItems: "center",  gap: "5px"}}>
                    {tokenCountConfig === 2 && (
                        <div>
                            {/* <Button sx={{padding: 0, paddingLeft: 0.5, paddingRight: 0.5, borderColor: 'white' }} variant="outlined">
                                <Typography sx={{color: "white"}} variant="h6" >Tokens: {R_tokens}</Typography>
                            </Button> */}
                            
                            <Typography variant="body1" sx={{color: "#1976d2"}}>Tokens</Typography>
                        </div>
                    )}
                    
                    <div>
                        <IconButton size="small" onClick={() => handleDrawerState()}>
                            <Menu sx={{color:"#1976d2", padding: 0}} fontSize="medium"/>
                        </IconButton>
                    </div>
                </div>
            </div>

            <MenuDrawer drawerState={drawerState} handleDrawerState={handleDrawerState} tokenStoreConfig={tokenStoreConfig} adminPanelConfig={adminPanelConfig}/>
        </div>
    )
}

export default StandardHeader