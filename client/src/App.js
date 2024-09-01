import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import Login from './Components/Login';
import Dashboard from "./Components/Dashboard";
import React, {useState, useEffect } from "react";
import Header from './Components/Header';

const code = new URLSearchParams(window.location.search).get("code")

function App() {
    
    return (
        <>
        <Header />
        {code ? <Dashboard code={code} /> : <Login />}
        </>
    );
  
}

export default App;
