import * as React from 'react';
import axios from 'axios';
import { getServerUrl } from '../../services/server.service';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import {RBearerToken} from "../../state/globalstate"
import { Button, TextField } from '@mui/material';


export default function Login()
{
  const [bearer, setBearer] = useRecoilState(RBearerToken)
  const [loginError, setLoginError] = useState("")
  let navigate = useNavigate();


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  async function loginUser(e: React.FormEvent)
  {
      e.preventDefault(); // prevents whole page from refreshing
      console.log(email, password, )
      
      let loginRes = await axios.post(getServerUrl() + "/auth/login", {
          email: email,
          password: password
      })

      const authToken = loginRes.headers.authorization
      console.log(authToken)

      if(authToken)
      {
        setEmail("")
        setPassword("")

        
        setBearer(authToken)
        navigate("/workspaces", {replace: true})
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

  return(
    <React.Fragment>
          <h1>User Account Login</h1>
          <div>
              <form onSubmit={(e) => loginUser(e)}>

                  <TextField id="email" label="Email" variant="outlined"  value={email} onChange={(e) => setEmail(e.target.value)} />
                  <br/>
                  <br/>
                  <TextField type="password" id="pass" label="Password" variant="outlined"  value={password} onChange={(e) => setPassword(e.target.value)} />
                  <br/>
                  {loginError}
                  <br/>
                  <Button variant="contained" type="submit">Submit</Button>
              </form>
              <Button variant="contained" onClick={() => navigate("/register", {replace: true})}>Create New User Account</Button>
          </div>
          {bearer}
    </React.Fragment>
  )

}




