import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

export default function CreateAccount()
{
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [verifiedPassword, setVerifiedPassword] = useState("")

    const submitNewUser = (e: React.FormEvent) =>
    {
        e.preventDefault(); // prevents whole page from refreshing
        console.log(userName, email, password, verifiedPassword)
        
        axios.post( "/api/auth/register", {
            userName: userName,
            email: email,
            password: password
          }).then(res => {
            console.log(res)
          }).catch(err => {
            console.error(err)
          })

        setUserName("");
        setEmail("")
        setPassword("")
        setVerifiedPassword("")
    }

    return(
        <div>
            <p>Create User Account</p>
            <div>
                <form onSubmit={(e) => submitNewUser(e)}>
                    <label htmlFor='userName'>Username:</label>
                        <br/>
                        <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    
                    <br/>
                    <label htmlFor='email'>Email:</label>
                        <br/>
                        <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    
                    <br/>
                    <label htmlFor='pass'>Password:</label>
                        <br/>
                        <input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    
                    <br/>
                    <label htmlFor='verpass'>Verify Password:</label>
                        <br/>
                        <input id="verpass" type="password" value={verifiedPassword} onChange={(e) => setVerifiedPassword(e.target.value)} />
                    
                    <br/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}