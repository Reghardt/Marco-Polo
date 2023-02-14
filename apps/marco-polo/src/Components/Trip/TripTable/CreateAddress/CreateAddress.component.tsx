import { Accordion, AccordionDetails, AccordionSummary, Button, FormControlLabel, Switch, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GAutoComplete from "../../../Experiments/GAutoComplete.component";
import { useState } from "react";
import { IAddress } from "../../../common/CommonInterfacesAndEnums";
import { addCustomRow } from "../../../../Services/Trip.service";

const CreateAddress: React.FC = () => {

    const [newAddress, setNewAddress] = useState<IAddress | null>(null)
    const [newLinkAddress, setNewLinkAddress] = useState<IAddress | null>(null)

    const [isLinkEnabled, setIsLinkEnabled] = useState(false)

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
                            <GAutoComplete setAddress={setNewAddress} currentAddress={newAddress?.formatted_address ? newAddress.formatted_address : ""}/>
                        </div>
                    </div>

                    <div>
                        <FormControlLabel control={<Switch value={isLinkEnabled} onChange={(change) => {
                            if(change.target.checked === false)
                            {
                                setNewLinkAddress(null)
                            }
                            setIsLinkEnabled(change.target.checked)
                            }} />} label="Has Link Address" />
                    </div>

                    {isLinkEnabled && (
                        <div>
                            <div className="text-sm">
                                Link Address:
                            </div>
                            <div>
                                <GAutoComplete setAddress={setNewLinkAddress} currentAddress={newLinkAddress?.formatted_address ? newLinkAddress.formatted_address : ""}/>
                            </div>
                        </div>
                    )}

                    <div className="mt-2">
                        <Button variant="contained" onClick={() => {
                                if(newAddress)
                                {
                                    console.log(newAddress, newLinkAddress)
                                    addCustomRow(newAddress, newLinkAddress)
                                    setNewAddress(null)
                                    setNewLinkAddress(null)
                                }
                                else
                                {
                                    
                                }
                                
                            }}
                        >Add</Button>
                    </div>



                    


                    
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default  CreateAddress