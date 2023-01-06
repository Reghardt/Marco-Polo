import { Redirect, Route } from 'wouter'
import './App.css'
import Login from './pages/Login.page'
import Trip from './pages/Trip.page'
import Workspaces from './pages/Workspaces.page'

export enum ERoutes{
  Login = "/login",
  Workspaces = "/workspaces",
  Trip = "/trip"
}

function App() {
  return (
    <>
      <Route path='/index.html'><Redirect to={ERoutes.Login}></Redirect></Route>
      <Route path='/'><Redirect to={ERoutes.Login}></Redirect></Route>

      <Route path={ERoutes.Login}><Login/></Route>
      <Route path={ERoutes.Workspaces}><Workspaces/></Route>
      <Route path={ERoutes.Trip}><Trip/></Route>
        
        

    </>
  )
}

export default App
