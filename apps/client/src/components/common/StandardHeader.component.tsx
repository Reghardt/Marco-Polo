import { Menu, NavigateBefore } from "@mui/icons-material"
import { Box, IconButton,  Typography } from "@mui/material"
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
        <Box>
            <div style={{display: "flex", justifyContent: "space-between", margin: "3px"}}>
                
                <div style={{display: "flex", alignItems: "center"}}>
                    
                    {backNavStr.length > 0 && (
                        <Box>
                            <IconButton size="small" onClick={() => {navigate(backNavStr, {replace: true})}}>
                                <NavigateBefore fontSize="small" sx={{color: "#1976d2", paddingBottom: "2px"}}/>
                            </IconButton>
                        </Box>
                    )}

                    <div style={{marginLeft: "5px"}}>
                        <Typography variant="body1" sx={{color: "#1976d2", fontWeight: "bold"}}>{title}</Typography>
                    </div>
                </div>
                
                <div style={{display: "flex", alignItems: "center",  gap: "5px"}}>
                    {tokenCountConfig === 2 && (
                        <Box>
                            {/* <Button sx={{padding: 0, paddingLeft: 0.5, paddingRight: 0.5, borderColor: 'white' }} variant="outlined">
                                <Typography sx={{color: "white"}} variant="h6" >Tokens: {R_tokens}</Typography>
                            </Button> */}
                            
                            <Typography variant="body1" sx={{color: "#1976d2"}}>Tokens</Typography>
                        </Box>
                    )}
                    
                    <Box>
                        <IconButton size="small" onClick={() => handleDrawerState()}>
                            <Menu sx={{color:"#1976d2", padding: 0}} fontSize="medium"/>
                        </IconButton>
                    </Box>
                </div>
            </div>

            <MenuDrawer drawerState={drawerState} handleDrawerState={handleDrawerState} tokenStoreConfig={tokenStoreConfig} adminPanelConfig={adminPanelConfig}/>
        </Box>
    )
}

export default StandardHeader