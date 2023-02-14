import { Button, Dialog } from "@mui/material"
import React, { useState } from "react"
import VehicleListDialog from "./VehicleListDialog.component"

const VehicleList: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    
    
    return(
        <div>
            <Button variant="outlined" onClick={() => {setIsModalOpen(!isModalOpen)}}>Vehicle List</Button>

            <Dialog
               PaperProps={{sx: {width: "80%", minHeight: "90%"}}}
                open={isModalOpen}
                scroll={"body"}
                //onClose={}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <VehicleListDialog setIsModalOpen={setIsModalOpen}/>
            </Dialog>

        </div>
    )
}

export default VehicleList