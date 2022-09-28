import { IRow } from "../../services/worksheet/row.interface";

//Uses the job body and waypoint order to place the addresses in the fastest order
export function createInSequenceJobBody(jobBody: Readonly<IRow[]>, waypointOrder: number[]): IRow[]
    {
        console.log(jobBody)
        //TODO rework to use leftmost top cell as ankor and use length and width to assign coordinates
        let inSequenceBody: IRow[] = []
        for(let i = 0; i< waypointOrder.length; i++)
        {
            const seqRow = jobBody[waypointOrder[i]];
            inSequenceBody.push(seqRow)
        }

        return inSequenceBody
    }