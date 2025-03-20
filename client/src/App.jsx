

// import { Account } from "./components/Account";
// import { Login } from "./components/Login";

// import { Memory } from "./components/Memory";
// import { Navigation } from "./components/Navigation";
// import { Register } from "./components/Register";

// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import backpack from "./assets/asset-nomatic-backpack.png";
import "./App.css";
import Memories from './components/Memories'; // Import the Memories component

function App() {

  return (
    <div className="logo-container">
      <h1>What's in SMF's backpack?</h1>
      <img id="logo-image" src="https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/7616a052-17c6-48d3-a6f2-0bf39e65faae/asset-nomatic-backpack.png?content-type=image%2Fpng" alt="Black Backpack" />
      <Routes>
        <Route path="/" element={<Memories />} /> {/* The Memories component now handles its own fetching */}
      </Routes>
    </div>
  );
}

export default App;