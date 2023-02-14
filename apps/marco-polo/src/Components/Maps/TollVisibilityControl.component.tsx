import { ETollVisibility } from "./GMap.component"

interface ITollVisibilityControl{
    tollVisibility: ETollVisibility, 
    setTolVisibility: React.Dispatch<React.SetStateAction<ETollVisibility>>
}

const TollVisibilityControl: React.FC<ITollVisibilityControl> = ({tollVisibility, setTolVisibility}) => {
    return(
        <div className={"bg-white p-1 rounded"}>
            <div className={"text-xs"}>Toll Visibility</div>
            <div className={"flex flex-wrap space-x-2 "}>
                <div className={"flex items-center"}>
                    <input name="checkAll" type={"checkbox"} checked={tollVisibility === ETollVisibility.ALL} onChange={(change) => {if(change.target.checked){setTolVisibility(ETollVisibility.ALL)} }}/>
                    <label htmlFor="checkAll" className={"text-sm mt-1"}> All</label>
                </div>

                <div className={"flex items-center"}>
                    <input name="Passthrough" type={"checkbox"} checked={tollVisibility === ETollVisibility.PASSTHROUGH} onChange={(change) => {if(change.target.checked){setTolVisibility(ETollVisibility.PASSTHROUGH)} }} />
                    <label htmlFor="Passthrough" className={"text-sm mt-1"}> Passthrough</label>
                </div>

                <div className={"flex items-center"}>
                    <input name="None" type={"checkbox"} checked={tollVisibility === ETollVisibility.NONE} onChange={(change) => {if(change.target.checked){setTolVisibility(ETollVisibility.NONE)} }}/>
                    <label htmlFor="None" className={"text-sm mt-1"}> None</label>
                </div>
            </div>
        </div>
    )
}

export default TollVisibilityControl