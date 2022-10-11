import { Button } from "@mui/material"
import axios from "axios";
import React from "react"

const FormExp : React.FC = () =>{

    function submitForm()
    {
        const params = new URLSearchParams();
        // let bodyFormData = new FormData();
        params.append('fname', 'Reghardt')

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
          }

        axios.post('/api/experiment/submit', params,{
            headers: headers,
            
        }).then(res => {console.log(res)})
        .catch(err => {console.log(err)})
    }

    return(<div>
        <form name="myForm" action={'/api/experiment/submit'} method="post">
            <label htmlFor="fname">First name:</label> 
            <input type="text" id="fname" name="fname"></input><br/>
            <input type="submit"></input>
        </form>
        <br/>
        <br/>
        <br/>
        <Button onClick={() => {submitForm()}}>Submit</Button>
    </div>)
}

export default FormExp