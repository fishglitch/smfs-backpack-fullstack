import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
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
  const [isCreating, setIsCreating] = useState(false); // State to control form visibility

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/memories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure the token is sent for authorization if required
        },
        body: JSON.stringify({
          ...formData,
          userId: 1, // For example purposes, replace this with the actual userId based on your auth context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create memory");
      }

      const memory = await response.json();
      console.log("Memory created successfully:", memory);
      // Optionally update state to reflect new memory, or trigger a refresh of memories here
    } catch (error) {
      console.error("Error creating memory:", error);
      // Handle error appropriately for your UI
    }
  };

  return (
    <>
      <Navigation token={token} setToken={setToken} />

      <div className="container">
        {" "}
        {/* Optional: apply overall padding */}
        <Routes>
          <Route
            path="/login"
            element={<Login token={token} setToken={setToken} />}
          />
          <Route
            path="/register"
            element={<Register token={token} setToken={setToken} />}
          />
          <Route path="/account" element={<Account />} />
          <Route path="/memory/:id" element={<Memory />} />
          <Route
            path="/"
            element={
              <>
                {token ? ( // Only show Memories if the user is logged in
                  <>
                    {isCreating ? (
                      <CreateMemory onSubmit={handleFormSubmit} />
                    ) : (
                      <Memories />
                    )}
                    <button onClick={() => setIsCreating(!isCreating)}>
                      {isCreating ? "Back to Memories" : "Add New Memory"}
                    </button>
                  </>
                ) : (
                  <div className="backpack-prompt">
                    <h1>What's in SMF's backpack?</h1>
                    <div className="logo-container">
                      <img
                        id="logo-image"
                        src="https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/7616a052-17c6-48d3-a6f2-0bf39e65faae/asset-nomatic-backpack.png?content-type=image%2Fpng"
                        alt="Black Backpack"
                      />
                      <h2>Please log in to see your memories.</h2>
                    </div>
                  </div>
                )}
              </>
            }
          />
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
