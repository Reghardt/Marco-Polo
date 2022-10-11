import * as React from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import {RSBearerToken, RSWorkspaceID} from "../../state/globalstate"
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { msLogin } from './Login.service';
import { useMsal } from '@azure/msal-react';


export default function Login()
{
  const [bearer, setBearer] = useRecoilState(RSBearerToken)
  const [R_workspaceId, R_setWorkspaceId] = useRecoilState(RSWorkspaceID)
  const [loginError, setLoginError] = useState<string>(null)
  
  const { instance, accounts } = useMsal();
  let navigate = useNavigate();


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  async function loginUser(e: React.FormEvent)
  {
      e.preventDefault(); // prevents whole page from refreshing
      console.log(email, password, )
      
      let loginRes = await axios.post("/api/auth/login", {
          email: email,
          password: password
      })

      const authToken = loginRes.headers.authorization
      console.log(authToken)
      console.log(loginRes.data)
      console.log(loginRes.data.lastUsedWorkspaceId)



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
        console.log(loginRes.data)
        const loginResData = loginRes.data
        if(loginResData.status >= 400 && loginResData.status < 500)
        {
          setLoginError(loginResData.status + " " + loginResData.message)
        }
      }
  }

  function handleMsLogin()
  {
    msLogin(instance)
    .then(res => {console.log(res)})
    .catch(err => {console.log(err)})
  }

  return(
          
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Stack>
              <Box>
                <Typography variant="h3" gutterBottom sx={{textAlign:'center', color:'#3f51b5'}}>Marco Polo</Typography>
              </Box>
              <Box>
                <Paper sx={{width: '100%', padding: '1em'}} variant="elevation" elevation={5}>
                  <div style={{width:"100%", textAlign:'center'}}>
                    <Typography variant="h4" gutterBottom sx={{textAlign:'center'}}>Login</Typography>
                      <Box component={"form"} onSubmit={(e) => loginUser(e)} sx={{ m: 1, width: '100%'}}>
                          
                          <TextField id="email" label="Email" variant="standard"  value={email} onChange={(e) => setEmail(e.target.value)} sx={{width:'90%', marginBottom:'1em'}}/>
                          
                          <TextField type="password" id="pass" label="Password" variant="standard"  value={password} onChange={(e) => setPassword(e.target.value)} sx={{width:'90%', marginBottom:'1em'}}/>
                          <div style={{color: 'red', paddingBottom: '1em'}}>
                            {loginError}
                          </div>
                          
                          <div>
                            <Button variant="contained" type="submit" sx={{width:'90%', borderRadius: 8}}>Sign In</Button>
                          </div>
                          
                      </Box>
                    {/* <Button variant="contained" onClick={() => navigate("/register", {replace: true})}>Create New User Account</Button> */}
                    <div style={{textAlign:'center'}}>
                      <NavLink to={'/register'}>Create User Account</NavLink>
                    </div>
                    <div>
                      <Button onClick={() => handleMsLogin()}>Microsoft Sign In</Button>
                    </div>
                    
                  </div>
                  <NavLink to={'/exp'}>Experiment</NavLink>
                  
                  
                </Paper>
              </Box>
              <Box sx={{marginTop: "1em"}}>
                <Typography variant="body1" gutterBottom sx={{textAlign:'center', color:'#3f51b5'}}>Experimental - Beta 0.9.4</Typography>
              </Box>
            </Stack>
            
                        
          </div>


  )

}




