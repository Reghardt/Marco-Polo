

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import RouteMenu from './components/workspaces/RouteMenu.component';
import RouteFinder from './components/routes/RouteFinder.component';
import CreateAccount from './components/user/CreateAccount.component';
import Login from './components/user/Login.component';
import CreateWorkspace from './components/workspaces/CreateWorkspace.component';
import WorkSpaces from './components/workspaces/Workspaces.component';
import Success from './components/payment/Success';
import PopperExperiment from './components/experiments/PopperExperiment.component';



function App() {

  return (
    <div style={{height: '100%'}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='index.html' element={<Navigate to="/"/>}/> {/* Navigate is the new redirect. This is to handle office that searches for index.html */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<CreateAccount/>}/>
          <Route path="/workspaces" element={<WorkSpaces/>}/>
          <Route path="/createWorkspace" element={<CreateWorkspace/>}/>
          <Route path="/routeMenu" element={<RouteMenu/>}/>
          <Route path="/jobEditor" element={<RouteFinder/>}/>
          <Route path="/success" element={<Success/>}/>
          <Route path="/exp" element={<PopperExperiment/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
