import { Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateAddress from "./CreateAddress.component";

const CreateAddressAccordion: React.FC = () => {
    return(
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
                <Typography>Add New Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CreateAddress/>
            </AccordionDetails>
        </Accordion>
    )
}

export default CreateAddressAccordion