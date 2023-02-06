import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

import { useMsal } from '@azure/msal-react';
import MSLogo from './MSLogo.component';
import { useDoesWorkspaceExistMutation, useloginMsMutation } from '../../trpc-hooks/trpcHooks';
import { useAuthStore } from '../../Zustand/authStore';
import { msLogin } from '../../Services/Account.service';

export default function Login()
{ 
  const [loginError, setLoginError] = useState<string>("")
  
  const { instance, /* accounts */} = useMsal();
  const navigate = useNavigate();

  const ZF_setToken = useAuthStore(store => store.actions.setToken)

  const [email, setEmail ] = useState("")
  const [password, setPassword ] = useState("")



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

  //sx={{ color:'#1976d2'}}

  return(
     
    <div className={"flex items-center justify-center"} style={{height: "100vh"}}>
      <div className={"w-72 bg-slate-100 mt-4"}>

            <div className={"bg-[#1976d2] w-full h-1"}></div>
            <div className={"p-4 space-y-4"}>
              <div className={"flex justify-center text-2xl mb-4 text-[#1976d2] font-bold"}>
                <div>Marco Polo</div>
              </div>

              <div>
                <TextField size='small' id="email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{width:'100%', backgroundColor: "white"}}/>
              </div>  
              <div>
                <TextField size='small' type="password" id="pass" label="Password" variant="outlined"  value={password} onChange={(e) => setPassword(e.target.value)} sx={{width:'100%', backgroundColor: "white"}}/>
              </div>  

              {loginError && (
                <div>
                  {loginError}
              </div>
              )}
              
              <div> 
                <Button variant="contained" type="submit" sx={{width:'100%', borderRadius: 0, textTransform: "none"}}>Continue</Button>
              </div>

              <div className='flex justify-center text-sm'>
                <div>Don't have an account? <NavLink className={" text-[#1976d2]"} to={'/register'}>Sign Up</NavLink></div>
              </div>

              <div className='flex flex-col items-center text-sm' style={{marginBottom: "-24px", marginTop: "20px"}}>
                <div className='w-full h-2' ><hr/></div>
                
                <div style={{transform: "translate(0, -20px)"}}><div className={" bg-slate-200 rounded-full p-1 text-xs"}>OR</div> </div>
              </div>

              <div className={"flex justify-center mb-4"}>
                <button onClick={() => loginMS()}><MSLogo/></button>
              </div>

              <div className={"flex justify-center text-sm"}>
                <div>Version - 0.20.6</div>
              </div>
            </div>

      </div>            
    </div>


  )

}




