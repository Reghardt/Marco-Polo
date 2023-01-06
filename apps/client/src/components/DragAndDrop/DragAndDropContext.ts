import { createContext } from "react";

interface IDragAndDropContextInterface{
    rearrangeOnDrop : (sequence: number[]) => void
}

const DragAndDropContext = createContext<IDragAndDropContextInterface>({
    rearrangeOnDrop: () => {}
})

export default DragAndDropContext