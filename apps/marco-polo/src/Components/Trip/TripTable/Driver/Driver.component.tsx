import { Button, Dialog } from "@mui/material"
import { useState } from "react"
import { DriverDialog } from "./DriverDialog.component"

export const Driver: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    return(
        <>
            <Button sx={{ width: "100%"}} variant="text" onClick={() => setIsModalOpen(!isModalOpen)}>Send To Driver</Button>

            <Dialog
                PaperProps={{sx: {width: "80%", minHeight: "90%"}}}
                open={isModalOpen}
                scroll={"body"}
                //onClose={}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <DriverDialog setIsModalOpen={setIsModalOpen}/>
            </Dialog>

        </>

    )
}