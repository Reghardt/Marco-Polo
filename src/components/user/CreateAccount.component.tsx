import { Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function CreateAccount()
{
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [verifiedPassword, setVerifiedPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    let navigate = useNavigate();

    const checkAndCreateUser = () =>
    {
        console.log(userName, email, password, verifiedPassword)

        if(userName.length > 0)
        {
            if(email.length > 0)
            {
                if(password.length > 0)
                {
                    if(verifiedPassword.length > 0 && checkIfPasswordsMatch())
                    {
                        console.log("all good")
                        createUser()
                        setErrorMessage("")
                    }
                    else
                    {
                        setErrorMessage("Verify password does not match")
                        return;
                    }
                }
                else
                {
                    setErrorMessage("Please provide a password")
                    return;
                }
            }
            else
            {
                setErrorMessage("Please provide a email")
                return;
            }
        }
        else
        {
            setErrorMessage("Please provide a username")
            return;
        }  
    }

    function createUser()
    {
        axios.post( "/api/auth/registerCM", {
            userName: userName,
            email: email,
            password: password
          }).then(res => {
            console.log(res)
            navigate("/login", {replace: true})
          }).catch(err => {
            console.error(err)
            setErrorMessage("Account could not be created")
          }
        )

        setUserName("");
        setEmail("")
        setPassword("")
        setVerifiedPassword("")
    }

    function checkIfPasswordsMatch()
    {
        if(password.length > 0 || verifiedPassword.length > 0)
        {
            if(password !== verifiedPassword)
            {
                return false
            }
            else
            {
                return true
            }
        }
        return true
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
                            <Typography variant="h5" gutterBottom sx={{ color:'#1976d2'}}>Create User Account</Typography>
                        </Box>
                        
                        <Box justifyContent={"center"} display="flex">
                            <TextField id="Username" label="Username" variant="outlined" value={userName} onChange={(e) => setUserName(e.target.value)} sx={{width:'100%'}}/>
                        </Box>

                        <Box justifyContent={"center"} display="flex">
                            <TextField id="email" label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} sx={{width:'100%'}}/>
                        </Box>
                            
                        <Box>
                            <TextField id="pass" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{width:'100%'}}/>
                        </Box>

                        <Box>
                            <TextField error={!checkIfPasswordsMatch()} id="verpass" label="Verify Password" type="password" value={verifiedPassword} onChange={(e) => setVerifiedPassword(e.target.value)} sx={{width:'100%'}}/>
                        </Box>

                        {errorMessage && (
                            <Box sx={{color: "red"}}>
                                {errorMessage}
                            </Box>
                        )}

                        <Box>
                            <Button variant="contained" type="submit" sx={{width:'100%', borderRadius: 0}} onClick={() => {checkAndCreateUser()}}>Create</Button>
                        </Box>

                        <Box justifyContent={"center"} display="flex">
                            <NavLink to={'/login'}>Back To Login</NavLink>
                        </Box>
                
                    </Stack>
                </Paper>
            
            </Grid>
        </Grid>

    )
}