import { Button, Paper } from "@mui/material";
import md5 from "md5";
import React, { useEffect, useState } from "react";

interface IKeyValueType{
    key: string;
    value: string; //make string or bool in future?
    type: string;
}

enum EFormState{
    noSubmit = 0,
    fetchSignature = 1,
    postForm = 2
}

const Payment: React.FC = () => {

    const [keyValueTypes, setKeyValueTypes] = useState<IKeyValueType[]>([])
    const [formState, setFormState] = useState<EFormState>(0)

    useEffect(() => {
        if(formState === EFormState.fetchSignature)
        {
            //server step - sets signature, refreshes state
            setTimeout(() => {
                addSignature(keyValueTypes)
                setFormState(EFormState.postForm)
            }, 10)
            
        }
        else if(formState === EFormState.postForm)
        {
            let frm = document.getElementsByName("myForm") as any;
            frm[0].submit() //hack to submit form without type="submit" as signature must be calculated first on server and then be set
            
            console.log(frm[0])
            setFormState(EFormState.noSubmit)
        }
    }, [formState])

    function updateKeyValueByIndex(value: string, idx: number)
    {
        setKeyValueTypes(vals => 
            { 
                let tempVals = JSON.parse(JSON.stringify(vals)) as IKeyValueType[]
                tempVals[idx].value = value
                return tempVals
            })
    }

    function updateKeyValueByKey(value: string, key: string)
    {

        setKeyValueTypes(vals => 
            { 
                let tempVals = JSON.parse(JSON.stringify(vals)) as IKeyValueType[]
                for(let i = 0; i < tempVals.length; i++)
                {
                    if(tempVals[i].key === key)
                    {
                        tempVals[i].value = value
                        return tempVals
                    }
                }
                return vals
            })
    }

    useEffect(() => {
        let tempKeyValues : IKeyValueType[] = []
        tempKeyValues.push({key: "merchant_id", value: "10026979", type: "hidden"})
        tempKeyValues.push({key: "merchant_key", value: "2lhyevuuzdsw7", type: "hidden"})
        tempKeyValues.push({key: "name_first", value: "First Name", type: "text"})
        tempKeyValues.push({key: "name_last", value: "Last Name", type: "text"})
        tempKeyValues.push({key: "m_payment_id", value: "1234", type: "hidden"})
        tempKeyValues.push({key: "amount", value: "10.00", type: "hidden"})
        tempKeyValues.push({key: "item_name", value: "Order#123", type: "hidden"})
        tempKeyValues.push({key: "signature", value: "", type: "hidden"})
        setKeyValueTypes(tempKeyValues)
    }, [])

    function addSignature(keyValueTypeParam: IKeyValueType[])
    {
        const md5Signature = generateSignature(keyValueTypeParam)
        console.log(md5Signature)
        updateKeyValueByKey(md5Signature, "signature")
    }

    function generateSignature(keyValuesParam: IKeyValueType[])
    {
        
        let keyValueString = ""
        for(let i = 0; i < keyValuesParam.length; i++)
        {
            if(keyValuesParam[i].key === "signature")
            {
                continue;
            }

            let tmpStr = keyValuesParam[i].key + "=" + encodeURIComponent(keyValuesParam[i].value.replace(/ /g, '+')) + '&'
            tmpStr = tmpStr.replace(/%2B/g, '+')
            keyValueString += tmpStr
        }

        keyValueString += "passphrase=kgJMyvUJTklFdEadqHgI"
        //keyValueString = keyValueString.replace(/ /g, '+') //TODO check for longer series of spaces
        console.log(keyValueString)
        return md5(keyValueString)
    }

    function createFormElements(keyValuesParam: IKeyValueType[])
    {
        let formBodyElements = []
        for(let i = 0; i< keyValuesParam.length; i++)
        {
            //console.log(i)
            formBodyElements.push(<input onChange={(e) => {updateKeyValueByIndex(e.target.value, i)}} name={keyValuesParam[i].key} value={keyValuesParam[i].value} type={keyValuesParam[i].type}/>)
        }
        return formBodyElements;
    }

    function submitForm()
    {
        
        
        setFormState(EFormState.fetchSignature)
        
    }
    

    return(
        <Paper>
            <h3>Payment</h3>
            {/* action="https://sandbox.payfast.co.za​/eng/process" method="post" */}
            <form name="myForm" action='https://sandbox.payfast.co.za​/eng/process' method="post">
                
                {
                    createFormElements(keyValueTypes).map((elem, idx) => {
                        return <React.Fragment key={idx}>{elem}</React.Fragment>
                    })
                }
            </form>

            <Button onClick={() => submitForm()}>Submit me</Button>

            
        </Paper>
    )
}

export default Payment


const FormSubmission: React.FC = () => {
    return(


        <div>
            <form>
                <input type="input" value={1 + 5}/>
            </form>
        </div>
    )
}

