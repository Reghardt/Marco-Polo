import * as React from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import {RSBearerToken, RSWorkspaceID} from "../../state/globalstate"
import { Box, Button, Chip, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { msLogin, ssoLogin } from './Login.service';
import { useMsal } from '@azure/msal-react';
import MSLogo from './MSLogo.component';

export default function Login()
{
  const [bearer, setBearer] = useRecoilState(RSBearerToken)
  const [R_workspaceId, R_setWorkspaceId] = useRecoilState(RSWorkspaceID)
  const [loginError, setLoginError] = useState<string>(null)
  
  const { instance, accounts } = useMsal();
  let navigate = useNavigate();


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  async function loginUser()
  {
      //e.preventDefault(); // prevents whole page from refreshing
      console.log(email, password, )
      
      let loginRes = await axios.post("/api/auth/loginCM", { //login custom
          email: email,
          password: password
      })

      const authToken = loginRes.headers.authorization
      console.log(authToken)

      console.log(loginRes.data.lastUsedWorkspaceId) //ID token may be used here

      if(authToken)
      {
        setEmail("")
        setPassword("")

        
        setBearer(authToken)
        if(loginRes.data.lastUsedWorkspaceId)
        {
          R_setWorkspaceId(loginRes.data.lastUsedWorkspaceId)
          navigate("/routeMenu", {replace: true})
        }
        else
        {
          navigate("/workspaces", {replace: true})
        }
      }
      else
      {
        const loginResData = loginRes.data
        if(loginResData.status >= 400 && loginResData.status < 500)
        {
          setLoginError(loginResData.status + " " + loginResData.message)
        }
      }
  }



  async function handleMsLogin()
  {
    msLogin(instance)
    .then(async (msalToken) => {
      console.log(msalToken)

      let loginRes = await axios.post("/api/auth/loginMS",
      {
        userToken: msalToken
      })
      const authToken = loginRes.headers.authorization
      setBearer(authToken)
      if(loginRes.data.lastUsedWorkspaceId)
      {
        R_setWorkspaceId(loginRes.data.lastUsedWorkspaceId)
        navigate("/routeMenu", {replace: true})
      }
      else
      {
        navigate("/workspaces", {replace: true})
      }


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
              <Button variant="contained" type="submit" sx={{width:'100%', borderRadius: 0}} onClick={() => loginUser()}>Sign In</Button>
            </Box>

            <Box justifyContent={"center"} display="flex">
              <NavLink to={'/register'}>Create User Account</NavLink>
            </Box>

            <Box>
              <Divider sx={{marginTop: "1em", marginBottom: "1em"}}>OR</Divider>
            </Box>

            <Box justifyContent={"center"} display="flex">
              <Button onClick={() => handleMsLogin()} sx={{padding: 0, margin: 0}}><MSLogo/></Button>
            </Box>

            <Box sx={{marginTop: "1em"}}>
              <Typography variant="body1" gutterBottom sx={{textAlign:'center', color:'#3f51b5'}}>Experimental - Beta 0.9.7</Typography>
            </Box>
          </Stack>

          {/* <NavLink to={'/exp'}>Experiment</NavLink> */}
          
        </Paper>
      </Grid>            
    </Grid>


  )

}




