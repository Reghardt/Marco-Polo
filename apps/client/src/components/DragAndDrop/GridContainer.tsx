import DragAndDropContext from "./DragAndDropContext";

type TGridContainerProps = {
    rearrangeOnDrop : (sequence: number[]) => void
    children?: React.ReactNode;
  }
  
const GridContainer : React.FC<TGridContainerProps> = ({rearrangeOnDrop, children}) => {


    return(
        <DragAndDropContext.Provider value={{rearrangeOnDrop: rearrangeOnDrop}}>
        <div className='container' onDragEnter={(evt) => evt.preventDefault()} onDragOver={(evt) => evt.preventDefault()}>
            {children}
        </div>
        </DragAndDropContext.Provider>
    )
}

export default GridContainer