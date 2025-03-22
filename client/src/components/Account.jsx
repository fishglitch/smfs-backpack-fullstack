import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Account.css";

const Account = () => {
  const [userLogin, setUserLogin] = useState(null);
  const [userMemories, setUserMemories] = useState([]); // State for user's memories
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Unable to fetch user details");
      }
      return await response.json(); // Return the user data
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error; // Rethrow the error
    }
  };

  const fetchUserMemories = async (userId, token) => {
    try {
      // Log userId and token for debugging
      console.log("Fetching memories for user:", userId);

      const response = await fetch(
        `${API_URL}/memories/users/${userId}/memories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the raw response to check if the status is okay
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Unable to fetch user details");
      }

      // Ensure we call response.json() only on a valid response
      const data = await response.json(); // Now we read the response body
      console.log("Fetched user memories:", data);

      return data.memories; // Return the user's memories
    } catch (error) {
      console.error("Error fetching user memories:", error);
      throw error; // Rethrow the error
    }
  };

  // effect to fetchUserDetails
  useEffect(() => {
    const getUserLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token
        return;
      }

      try {
        const userDetails = await fetchUserDetails(token);
        setUserLogin(userDetails);
      } catch (error) {
        console.error("Can't fetch logged in user!", error);
        setError(error);
        navigate("/login"); // Redirect on error
      } finally {
        setLoadingUser(false); // Ensure loading state is updated
      }
    };

    getUserLogin(); // Call the function to fetch user login details
  }, [navigate]);



  // Effect to fetch user memories after user login
  useEffect(() => {
    const fetchMemories = async () => {
      if (userLogin) { // Only fetch if userLogin is available
        const token = localStorage.getItem("token");
        const userId = userLogin.user.id; // Assuming user ID is in user.data
        try {
          const memories = await fetchUserMemories(userId, token);
          setUserMemories(memories); // Set user's memories
        } catch (error) {
          console.error("Error fetching user memories:", error);
          setError(error);
        } finally {
          setLoadingMemories(false); // Update loading state for memories
        }
      }
    };

    fetchMemories(); // Fetch user memories
  }, [userLogin]); // Trigger this effect when userLogin changes

  if (loadingUser || loadingMemories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-container">
      <h2>Account Details</h2>
      <p>
        <strong>Username:</strong> {userLogin.user.username}
      </p>
      <p>
        <strong>Dimension:</strong> {userLogin.user.dimension}
      </p>
      <h3>{userLogin.user.username}'s Memories of What's in SMF's Backpack:</h3>
      {userMemories.length > 0 ? (
        // memories/users/${userId}/memories
        <ul>
          {userMemories.map((memory) => (
            <li key={memory.id}>
                <div>{memory.title}</div>
                <div>"{memory.description}"</div>
                <img src={memory.image_url}/>
                <div>{memory.dimension}</div>
            </li> // Rendering the title of each memory
          ))}
        </ul>
      ) : (
        <p>No memories found.</p> // Message if no memories exist
      )}
    </div>
  );
};

export default Account;
