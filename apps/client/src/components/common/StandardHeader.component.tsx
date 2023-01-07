import { Menu, NavigateBefore } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography } from "@mui/material"
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
        <Box sx={{backgroundColor:"#1976d2", paddingTop: '0.6em', paddingBottom: '0.6em'}}>
            <Stack direction={"row"} justifyContent='space-between' sx={{paddingLeft: "0.4em", paddingRight: "1em"}}>
                <Box alignContent={"left"}>
                    <Stack direction={"row"} spacing={1}>
                        {backNavStr.length > 0 && (
                            <Box>
                                <IconButton onClick={() => {navigate(backNavStr, {replace: true})}}>
                                    <NavigateBefore sx={{color: "white"}}/>
                                </IconButton>
                            </Box>
                        )}
                        
                        <Box>
                            <Typography variant="h4" sx={{color: "white"}}>{title}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Stack direction={"row"} justifyContent="flex-end" spacing={1} alignItems="center" sx={{p: 0}}>
                    {tokenCountConfig === 2 && (
                        <Box>
                            {/* <Button sx={{padding: 0, paddingLeft: 0.5, paddingRight: 0.5, borderColor: 'white' }} variant="outlined">
                                <Typography sx={{color: "white"}} variant="h6" >Tokens: {R_tokens}</Typography>
                            </Button> */}
                            Tokens
                        </Box>
                    )}
                    
                    <Box>
                        <IconButton onClick={() => handleDrawerState()}>
                            <Menu sx={{color:"white", padding: 0}} fontSize="medium"/>
                        </IconButton>
                    </Box>
                </Stack>
            </Stack>

            <MenuDrawer drawerState={drawerState} handleDrawerState={handleDrawerState} tokenStoreConfig={tokenStoreConfig} adminPanelConfig={adminPanelConfig}/>
        </Box>
    )
}

export default StandardHeader