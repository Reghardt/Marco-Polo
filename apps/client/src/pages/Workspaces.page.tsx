import { useLocation } from "wouter"
import { ERoutes } from "../App"

const Workspaces: React.FC = () => {

    const [, setLocation] = useLocation()
    
    return(
        <>
            <div>Workspaces Screen 5</div>
            <div>Test</div>
            <button onClick={() => setLocation(ERoutes.Login)}>To Login</button>
        </>
    )
}

export default Workspaces