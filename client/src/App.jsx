import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Account from "./components/Account";
import Login from "./components/Login";
import Memories from "./components/Memories"; // Import the Memories component
import Memory from "./components/Memory";
import Navigation from "./components/Navigation";
import Register from "./components/Register";
import CreateMemory from "./components/CreateMemory";
import "./App.css";

/** API Link */
export const API_URL = `http://localhost:3000/api`;

// Default image URL that will be displayed if no image is provided
export const defaultImage =
  "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/83514450-1942-4e9a-ba36-67754e5c3418/asset-rick-morty-portal-v1.png?content-type=image%2Fpng"; // Change this to your actual default image URL

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState();
  console.log("token", token);
  //  const [isCreating, setIsCreating] = useState(false); // Added to manage memory creation

  

  // userId={userId} setUserId={setUserId}

  // Component for logged-in users
  const LoggedInView = ({ token, setToken, userId, setUserId}) => (
    <>
      <Memories token={token} setToken={setToken} userId={userId} setUserId={setUserId} />
    </>
  );

  // Component for logged-out users
  const LoggedOutView = () => (
    <div className="backpack-prompt">
      <div className="logo-container">
        <img
          id="logo-image"
          src="https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/0ff75922-3cc9-487d-b4f2-767f72be03c8/asset-nomatic-backpack-darker.png?content-type=image%2Fpng"
          alt="Black Backpack"
        />

        <div className="music-player">
          <h1>What's in SMF's Backpack?</h1>
          <h2>
            <i>Please log in to remember.</i>
          </h2>

          <p>Music: “Opalescence I" by EAGLEBABEL, 2024</p>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // Set the token if it exists
    }
  }, []);

  return (
    <>
      <Navigation token={token} setToken={setToken} />
      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                token={token}
                setToken={setToken}
                userId={userId}
                setUserId={setUserId}
              />
            }
          />
          <Route
            path="/register"
            element={<Register token={token} setToken={setToken} />}
          />
          <Route
            path="/account"
            element={<Account token={token} setToken={setToken} />}
          />
          <Route
            path="/memory/:id"
            element={<Memory token={token} setToken={setToken} />}
          />
          {/* <Route
            path="/submit-memory"
            element={
              <CreateMemory
                token={token}
                setToken={setToken}
                userId={userId}
                setUserId={setUserId}
              />
            }
          /> */}
          {token ? (
            <Route
              path="/"
              element={<LoggedInView token={token} setToken={setToken} userId={userId} setUserId={setUserId}/>}
            />
          ) : (
            <Route path="/" element={<LoggedOutView />} />
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
