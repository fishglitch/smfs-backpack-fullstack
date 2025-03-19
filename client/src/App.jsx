// parent component here
// 
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Change Router to BrowserRouter
import backpack from "./assets/asset-nomatic-backpack.png"

import './App.css'

function App() {


  return (
    <>
    <h1>What's in SMF's backpack?</h1>
    <div>
        <img id="logo-image" src={backpack} alt="Black Backpack" />
    </div>
    


    </>
  )
}

export default App;
