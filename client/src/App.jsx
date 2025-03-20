// parent component here
// 
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Change Router to BrowserRouter
import backpack from "./assets/asset-nomatic-backpack.png"

import './App.css'

/** API Link */
export const API_URL = `http://localhost:3000/api`;

function App() {
  /*
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [token, setToken] = useState(null);
  */


  return (
    <>
    <h1>What's in SMF's backpack?</h1>
    <div>
       <img id="logo-image" src={backpack} alt="Black Backpack" />
    </div>
    


    </>

    /* these will go inside the <></>
          <Navigations
        token={token}
        setToken={setToken}
        setFilteredBooks={setFilteredBooks}
      />
      <Routes>
        <Route path="/" element={<Books filteredBooks={filteredBooks} />} />
        <Route
          path="/login"
          element={<Login token={token} setToken={setToken} />}
        />
        <Route
          path="/register"
          element={<Register token={token} setToken={setToken} />}
        />
        <Route path="/books/:id" element={<SingleBook />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    */
  )
}

export default App;
