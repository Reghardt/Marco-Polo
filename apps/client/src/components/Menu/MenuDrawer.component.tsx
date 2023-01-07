import { MeetingRoom, Settings, Store, SupervisorAccount, Work } from "@mui/icons-material"
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom";
import { EStandardHeaderConfig } from "../common/StandardHeader.component";

interface IMenuDrawerProps{
    drawerState: boolean;
    handleDrawerState: () => void;
    tokenStoreConfig: EStandardHeaderConfig;
    adminPanelConfig: EStandardHeaderConfig;
}

const MenuDrawer: React.FC<IMenuDrawerProps> = ({drawerState, handleDrawerState, tokenStoreConfig=EStandardHeaderConfig.Visible, adminPanelConfig=EStandardHeaderConfig.Visible}) => {

    const navigate = useNavigate();

    return(
        <Drawer anchor="right" open={drawerState} onClose={ () => handleDrawerState()}>
            <Box sx={{width: '20em'}}>
                <Typography variant="h5" sx={{paddingLeft: "0.6em", paddingTop: "0.4em"}}>Menu</Typography>
            </Box>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {console.log("pressed")}}>
                    <ListItemIcon>
                        <Work sx={{color:"#1976d2"}}/>
                    </ListItemIcon>
                    <ListItemText primary={"My Workspaces"}/>
                    </ListItemButton>
                </ListItem>

                {/* START: tokenStoreConfig */}
                {tokenStoreConfig === 1 && (
                    <Tooltip title={"Not currently in a workspace"} PopperProps={{modifiers: [{ name: "offset", options: {offset: [0, -20]}}]}} enterNextDelay={400} enterDelay={400}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {console.log("pressed")}} disabled>
                            <ListItemIcon>
                                <Store sx={{color:"#1976d2"}}/>
                            </ListItemIcon>
                            <ListItemText primary={"Token Store"}/>
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                )}

                {tokenStoreConfig === 2 && (
                    
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => {console.log("pressed")}}>
                        <ListItemIcon>
                            <Store sx={{color:"#1976d2"}}/>
                        </ListItemIcon>
                        <ListItemText primary={"Token Store"}/>
                        </ListItemButton>
                    </ListItem>
                
                    
                )}
                {/* END: tokenStoreConfig */}


                {/* START: tokenStoreConfig */}
                {adminPanelConfig === 1 && (
                    <Tooltip title={"Not currently in a workspace"} PopperProps={{modifiers: [{ name: "offset", options: {offset: [0, -20]}}]}} enterNextDelay={400} enterDelay={400}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {console.log("pressed")}} disabled>
                            <ListItemIcon>
                                <SupervisorAccount sx={{color:"#1976d2"}}/>
                            </ListItemIcon>
                            <ListItemText primary={"Admin Panel"}/>
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                )}

                {adminPanelConfig === 2 && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => {navigate("/admin", {replace: true})}}>
                        <ListItemIcon>
                            <SupervisorAccount sx={{color:"#1976d2"}}/>
                        </ListItemIcon>
                        <ListItemText primary={"Admin Panel"}/>
                        </ListItemButton>
                    </ListItem>
                )}

                {/* END: tokenStoreConfig */}

                <ListItem disablePadding>
                    <ListItemButton onClick={() => {console.log("pressed")}}>
                    <ListItemIcon>
                        <Settings sx={{color:"#1976d2"}}/>
                    </ListItemIcon>
                    <ListItemText primary={"Settings"}/>
                    </ListItemButton>
                </ListItem>


                <ListItem disablePadding>
                    <ListItemButton onClick={() => {console.log("pressed")}}>
                    <ListItemIcon>
                        <MeetingRoom sx={{color:"#1976d2"}}/>
                    </ListItemIcon>
                    <ListItemText primary={"Log out"}/>
                    </ListItemButton>
                </ListItem>
            </List>
      </Drawer>
    )
}

export default MenuDrawer