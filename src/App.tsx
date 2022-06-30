
import React from 'react';
import { Link } from 'react-router-dom';


import './App.css';


import Login from './components/Login.component';




function App() {
  return (
    <div>
      <Link to="/login">Expenses</Link>
    </div>
  );
}

export default App;
