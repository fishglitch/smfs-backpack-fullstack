import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Account from "./components/Account";
import Login from "./components/Login";
import Memories from "./components/Memories"; // Import the Memories component
import Memory from "./components/Memory";
import Navigation from "./components/Navigation";
import Register from "./components/Register";
import "./App.css";

/** API Link */
export const API_URL = `http://localhost:3000/api`;

// Default image URL that will be displayed if no image is provided
export const defaultImage =
  "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/83514450-1942-4e9a-ba36-67754e5c3418/asset-rick-morty-portal-v1.png?content-type=image%2Fpng"; // Change this to your actual default image URL

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <Navigation token={token} setToken={setToken} />
      <div className="logo-container"> {/* Center content in this container */}
      <div className="backpack-prompt">
        <h1>What's in SMF's backpack?</h1>
        <img
          id="logo-image"
          src="https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/7616a052-17c6-48d3-a6f2-0bf39e65faae/asset-nomatic-backpack.png?content-type=image%2Fpng"
          alt="Black Backpack"
        />
      </div>
      </div>
      <div className="container"> {/* Optional: apply overall padding */}
        <Routes>
          <Route path="/login" element={<Login token={token} setToken={setToken} />} />
          <Route path="/register" element={<Register token={token} setToken={setToken} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Memories />} />
          <Route path="/memory/:id" element={<Memory />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

// see comments from bookbuddy template
/* commented beneath Routh path Memories: The Memories component now handles its own fetching */

/*  this was included within Navigation 
        <Navigation
          token={token}
          setToken={setToken}
 // setFilteredBooks={setFilteredBooks}
        />
*/       