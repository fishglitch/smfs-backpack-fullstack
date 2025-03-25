import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Navigation.css";

const Navigation = ({ token, setToken, getAllUsers, getAllMemories }) => {
    const [userLogin, setUserLogin] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const getUserLogin = async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setUserLogin(null); // No token, user is not logged in
          return;
        }
  
        try {
          const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`, // Add the token in headers
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
          const userData = await response.json();
          setUserLogin(userData); // Set user login info
          console.log("logged in", userData);
        } catch (error) {
          console.error("Failed to fetch user details", error);
          setUserLogin(null); // If fetching fails, treat user as not logged in
        }
      };
  
      getUserLogin();
      // fetchAllMemories();
    }, [token]); // depend on the token to refetch when it changes
  
    const handleLogout = () => {
      setToken(null); // clear token state
      localStorage.removeItem("token");
      setUserLogin(null); // clear user login on logout
      navigate("/");
    };
  
    return (
      <nav className="navigation">
        <div className="nav-links">
          <Link to="/">Home</Link>
          {/* Ternary operator below means: 
          "If there is a token (indicating the user is logged in), 
          show a link to the 'Account' page and a 'Logout' button; 
          otherwise, show a link to the 'Login' page. */}
          {userLogin ? ( // userLogin state to conditionally render
            <>
              <Link to="/account">Account</Link>
              <button onClick={handleLogout}>Logout: [{userLogin?.user.username}]</button>
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