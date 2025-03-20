import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Navigation.css";

const Navigation = ({ token, setToken, getAllUsers, getAllMemories }) => {
    const [userLogin, setUserLogin] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    // moved from Memories component
    // const [availableMemories, setAvailableMemories] = useState([]);
  
    // const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
      const getUserLogin = async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setUserLogin(null);
          return;
        }
  
        try {
          const userData = await fetch(`${API_URL}/users`, storedToken);
          setUserLogin(userData); // set user login info


        } catch (error) {
          console.error("Failed to fetch user details", error);
          setUserLogin(null); // If fetching fails, treat user as not logged in
        }
      };
  
      // moved from Memories component; fetch all Memories from the API
      // const fetchAllMemories = async () => {
      //   try {
      //     const memories = await getAllMemories(`${API_URL}/memories`); // Use API function
      //     setAvailableMemories(memories);
      //   } catch (error) {
      //     console.error("Can't get all Memories!", error);
      //     setError(error);
      //   }
      // };
  
      getUserLogin();
      // fetchAllMemories();
    }, [token]); // depend on the token to refetch when it changes
  
    const handleLogout = () => {
      setToken(null); // clear token state
      localStorage.removeItem("token");
      setUserLogin(null); // clear user login on logout
      navigate("/");
    };
  
    // useEffect(() => {
    //   const filteredMemories = availableMemories.filter(
    //     (memory) =>
    //         memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     memory.author.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    //   setFilteredMemories(filteredMemories);
    // }, [searchTerm]);
  
    return (
      <nav className="navigation">
        <div>
          <Link to="/">Home</Link>
          {/* <input
            type="text"
            id="searchBar"
            placeholder="search memory title or author"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} // update search term state
          /> */}
  
          {/* Ternary operator below means: 
          "If there is a token (indicating the user is logged in), 
          show a link to the 'Account' page and a 'Logout' button; 
          otherwise, show a link to the 'Login' page. */}
          {userLogin ? ( // userLogin state to conditionally render
            <>
              <Link to="/account">Account</Link>
              <button onClick={handleLogout}>Logout: [{userLogin?.email}]</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Create an Account</Link>
            </>
          )}
        </div>
      </nav>
    );
  };
  export default Navigation;