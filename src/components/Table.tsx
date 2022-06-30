import * as React from 'react';
import { SelectionData } from '../classes/selectionData.class';

type Props = {
    data?: SelectionData,
    children?: React.ReactNode
}

export default function Table({data}: Props)
{
    if(data)
    {
        let rows = data.rows
        console.log(rows)


        return(
            <div>

            </div>
        )
    }
    else
    {
        return <div></div>
    }

    
}