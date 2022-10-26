import * as React from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import {RSBearerToken, RSWorkspaceID} from "../../state/globalstate"
import { Box, Button, Chip, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { msLogin } from './Login.service';
import { useMsal } from '@azure/msal-react';
import MSLogo from './MSLogo.component';

export default function Login()
{
  const [R_bearer, R_setBearer] = useRecoilState(RSBearerToken)
  const [R_workspaceId, R_setWorkspaceId] = useRecoilState(RSWorkspaceID)
  const [loginError, setLoginError] = useState<string>(null)
  
  const { instance, accounts } = useMsal();
  let navigate = useNavigate();


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function loginCM()
  {
      //e.preventDefault(); // prevents whole page from refreshing
      console.log(email, password)
      
      axios.post("/api/auth/loginCM", { //login custom
          email: email,
          password: password
      })
      .then(res => {
        console.log("Res",res)
        R_setBearer(res.headers.authorization)
        R_setWorkspaceId(res.data.lastUsedWorkspaceId)
        navigate("/postLoginConfig", {replace: true})
      })
      .catch(err => {
        console.log("Err", err)
      })
  }

  async function loginMS()
  {
    msLogin(instance)
    .then(async (msIdToken) => {

      axios.post("/api/auth/loginMS",
      {
        msIdToken: msIdToken
      })
      .then(res => {
        R_setBearer(res.headers.authorization)
        R_setWorkspaceId(res.data.lastUsedWorkspaceId)
        navigate("/postLoginConfig", {replace: true})
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => {console.log(err)})
  }

  return(
          
    <Grid container spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sx={{maxWidth: "80%"}}>
        <Paper sx={{width: '25em', padding: '1em'}} variant="elevation" elevation={5}>
          <Stack spacing={1}>
            <Box justifyContent={"center"} display="flex">
              <Typography variant="h3" gutterBottom sx={{ color:'#1976d2'}}>Marco Polo</Typography>
            </Box>
            
            <Box justifyContent={"center"} display="flex">
              <TextField id="email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{width:'100%'}}/>
            </Box>  
            <Box justifyContent={"center"} display="flex">
              <TextField type="password" id="pass" label="Password" variant="outlined"  value={password} onChange={(e) => setPassword(e.target.value)} sx={{width:'100%'}}/>
            </Box>  

            {loginError && (
              <Box sx={{color: "red"}}>
                {loginError}
            </Box>
            )}
            
            <Box> 
              <Button variant="contained" type="submit" sx={{width:'100%', borderRadius: 0}} onClick={() => loginCM()}>Sign In</Button>
            </Box>

            <Box justifyContent={"center"} display="flex">
              <NavLink to={'/register'}>Create User Account</NavLink>
            </Box>

            <Box>
              <Divider sx={{marginTop: "1em", marginBottom: "1em"}}>OR</Divider>
            </Box>

            <Box justifyContent={"center"} display="flex">
              <Button onClick={() => loginMS()} sx={{padding: 0, margin: 0}}><MSLogo/></Button>
            </Box>

            <Box sx={{marginTop: "1em"}}>
              <Typography variant="body1" gutterBottom sx={{textAlign:'center'}} color='primary'>Experimental - Beta 0.12.0</Typography>
            </Box>
          </Stack>

          {/* <NavLink to={'/exp'}>Experiment</NavLink> */}
          
        </Paper>
      </Grid>            
    </Grid>


  )

}




