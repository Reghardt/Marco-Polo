
    export function isFloat(val: string)
    {
        if(val === "")
        {
            return true
        }
        else
        {
            const regex = /^\d+\.?(\d+)?$/
            return regex.test(val)
        }  
    }