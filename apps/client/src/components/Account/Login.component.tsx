import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { msLogin } from '../../Services/Account.service';
import { useMsal } from '@azure/msal-react';
import MSLogo from './MSLogo.component';
import { useDoesWorkspaceExistMutation, useloginMsMutation } from '../../trpc-hooks/trpcHooks';
import { useAuthStore } from '../../Zustand/authStore';

export default function Login()
{ 
  const [loginError, setLoginError] = useState<string>("")
  
  const { instance, /* accounts */} = useMsal();
  const navigate = useNavigate();

  const ZF_setToken = useAuthStore(store => store.actions.setToken)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const doesWorkspaceExist = useDoesWorkspaceExistMutation((res) => {
    if(res.doesExist)
    {
      navigate("/trip", {replace: true})
    }
    else
    {
      navigate("/workspaces", {replace: true})
    }
  })

  const loginMsMutation = useloginMsMutation({
    doOnSuccess: (res) => {
      ZF_setToken(res.accessToken)
      doesWorkspaceExist.mutate()
    },
    doOnError: (err) => {
      console.error(err)
      setLoginError("Microsoft Login Failed")
    },
  })

  // async function loginCM()
  // {
  //     //TODO make server throw unauthorized 
  //     console.log(email, password)
      
  //     axios.post<{userName: string, lastUsedWorkspaceId: string}>("/api/auth/loginCM", { //login custom
  //         email: email,
  //         password: password
  //     })
  //     .then(res => {
  //       ZF_setBearer(res.headers.authorization!)
  //       ZF_setWorkspaceId(res.data.lastUsedWorkspaceId)
  //       navigate("/postLoginConfig", {replace: true})
  //     })
  //     .catch(err => {
  //       console.log("Err", err)
  //       setLoginError("Email or Password Incorrect")
  //     })
  // }

  async function loginMS()
  {
    msLogin(instance)
    .then(async (msIdToken) => {
      loginMsMutation.mutate({microsoftIdToken: msIdToken})
    })
    .catch(err => {
      console.log(err)
      setLoginError("Microsoft Login Failed")
    })
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
              <Button variant="contained" type="submit" sx={{width:'100%', borderRadius: 0}}>Sign In</Button>
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
              <Typography variant="body1" gutterBottom sx={{textAlign:'center'}} color='primary'>Experimental - Beta 0.20.0</Typography>
            </Box>
          </Stack>

          {/* <NavLink to={'/exp'}>Experiment</NavLink> */}
          
        </Paper>
      </Grid>            
    </Grid>


  )

}




