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
export const defaultImage = "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/83514450-1942-4e9a-ba36-67754e5c3418/asset-rick-morty-portal-v1.png?content-type=image%2Fpng"; // Change this to your actual default image URL

// Component for logged-in users
const LoggedInView = ({ isCreating, setIsCreating, token, setToken }) => (
  <>
    {!isCreating ? (
      <Memories token={token} setToken={setToken} />
    ) : null}
    <button onClick={() => setIsCreating(!isCreating)}>
      {isCreating ? "Back to Memories" : "Add New Memory"}
    </button>
  </>
);

// Component for logged-out users
const LoggedOutView = () => (
  <div className="backpack-prompt">
    <h1>What's in SMF's backpack?</h1>
    <div className="logo-container">
      <img
        id="logo-image"
        src="https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/7616a052-17c6-48d3-a6f2-0bf39e65faae/asset-nomatic-backpack.png?content-type=image%2Fpng"
        alt="Black Backpack"
      />
      <h2>Please log in to remember.</h2>
    </div>
  </div>
);

function App() {
  const [token, setToken] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Added to manage memory creation

  return (
    <>
      <Navigation token={token} setToken={setToken} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login token={token} setToken={setToken} />} />
          <Route path="/register" element={<Register token={token} setToken={setToken} />} />
          <Route path="/account" element={<Account token={token} setToken={setToken} />} />
          <Route path="/memory/:id" element={<Memory token={token} setToken={setToken} />} />
          <Route
            path="/"
            element={token ? (
              <LoggedInView 
                isCreating={isCreating} 
                setIsCreating={setIsCreating} 
                token={token} 
                setToken={setToken} 
              />
            ) : (
              <LoggedOutView />
            )}
          />
          {/* You may add a route for the CreateMemory component if necessary */}
          <Route path="/submit-memory" element={<CreateMemory token={token} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

//    

// was on line 93 above "Pls login to remember":  <CreateMemory onSubmit={handleFormSubmit} />
// see comments from bookbuddy template
/*


          <Route
            path="/"
            element={
              // clean up nested ternary 
              <>
                {token ? ( // Only show Memories if the user is logged in
                  <>
                    {isCreating ? (null
                    ) : (
                      <Memories token={token} setToken={setToken}/>
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
                      <CreateMemory onSubmit={handleFormSubmit} />
                      <h2>Please log in to remember.</h2>
                    </div>
                  </div>
                )}
              </>
            }
          />



commented beneath Routh path Memories: The Memories component now handles its own fetching */

/*  this was included within Navigation 
        <Navigation
          token={token}
          setToken={setToken}
 // setFilteredBooks={setFilteredBooks}
        />
*/
