import { Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchAndAddAddress from "./SearchAndAddAddress.component";


const SearchAndAddAddressAccordion: React.FC = () => {
    return(
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
                <Typography>Search Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <SearchAndAddAddress/>
            </AccordionDetails>
        </Accordion>
    )
}

export default SearchAndAddAddressAccordion