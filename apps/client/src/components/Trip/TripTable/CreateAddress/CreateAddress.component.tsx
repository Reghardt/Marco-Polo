import { Accordion, AccordionDetails, AccordionSummary, Button, FormControlLabel, Switch, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GAutoComplete from "../../../Experiments/GAutoComplete.component";
import { useState } from "react";
import { IAddress } from "../../../common/CommonInterfacesAndEnums";

const CreateAddress: React.FC = () => {

    const [newAddress, setNewAddress] = useState<IAddress | null>(null)
    const [newLinkAddress, setNewLinkAddress] = useState<IAddress | null>(null)

    const [isLinkEnabled, setIsLinkEnabled] = useState(false)

    console.log(newAddress)
    console.log(newLinkAddress)

    return(
        <div>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Add New Address</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <div>
                        <div className="text-sm">
                            Address:
                        </div>
                        <div>
                            <GAutoComplete setAddress={setNewAddress} currentAddress=""/>
                        </div>
                    </div>

                    <div>
                        <FormControlLabel control={<Switch value={isLinkEnabled} onChange={(change) => setIsLinkEnabled(change.target.checked)} />} label="Has Link Address" />
                    </div>

                    {isLinkEnabled && (
                        <div>
                            <div className="text-sm">
                                Link Address:
                            </div>
                            <div>
                                <GAutoComplete setAddress={setNewLinkAddress} currentAddress=""/>
                            </div>
                        </div>
                    )}

                    <div className="mt-2">
                        <Button variant="contained">Add</Button>
                    </div>



                    


                    
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default  CreateAddress