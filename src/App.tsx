

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CreateAccount from './components/user/CreateAccount.component';
import Login from './components/user/Login.component';
import CreateWorkspace from './components/workspaces/CreateWorkspace.component';
import WorkSpaces from './components/workspaces/Workspaces.component';

import AdminPanel from './components/admin/AdminPanel.component';

import RouteBuilder from './components/Trip/Trip.component';


import PostLoginConfig from './components/PostLoginConfig/PostLoginConfig.component';
import ForwardRefParent from './components/experiments/ForwardRef/ForwardRefParent.component';



function App() {

  console.log(process.env)
  

  return (
    <div style={{height: '100%', textTransform: "none"}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='index.html' element={<Navigate to="/"/>}/> {/* Navigate is the new redirect. This is to handle office that searches for index.html */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<CreateAccount/>}/>
          <Route path="/workspaces" element={<WorkSpaces/>}/>
          <Route path="/createWorkspace" element={<CreateWorkspace/>}/>
          <Route path="/postLoginConfig" element={<PostLoginConfig/>}/>
          <Route path="/jobEditor" element={<RouteBuilder/>}/>
          <Route path="/admin" element={<AdminPanel/>}/>
          <Route path="/exp" element={<ForwardRefParent/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
