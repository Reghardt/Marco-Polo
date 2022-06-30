import * as React from 'react';
import axios from 'axios';
import { getServerUrl } from '../services/server.service';

export default function Login()
{
    function login()
    {
     axios.post(getServerUrl() + "/user/register", {
       userName: "User1",
       "age": 20,
       "email": "Some email"
     }).then(res => {
       console.log(res)
     }).catch(err => {
       console.error(err)
     })
    }
    
    return(
        <div>
            <p>Login</p>

            <form>
                <label>
                    Email:
                    <br/>
                    <input type="text" name="name" />
                </label>
                <br/>
                <label>
                    Password:
                    <br/>
                    <input type="text" name="name" />
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )

}