import * as React from 'react';
import { SelectedCells } from '../services/worksheet/selectedCells.class';

type Props = {
    data?: SelectedCells,
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