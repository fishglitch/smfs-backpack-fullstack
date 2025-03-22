import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Account.css";

const Account = () => {
  const [userLogin, setUserLogin] = useState(null);
  const [userMemories, setUserMemories] = useState([]);
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
      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  };

  const fetchUserMemories = async (userId, token) => {
    try {
      console.log("Fetching memories for user:", userId);
      const response = await fetch(`${API_URL}/memories/users/${userId}/memories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch user details");
      }

      const data = await response.json();
      console.log("Fetched user memories:", data);

      return data.memories;
    } catch (error) {
      console.error("Error fetching user memories:", error);
      throw error;
    }
  };

  const deleteMemory = async (id) => {
    const token = localStorage.getItem("token"); // Get the authentication token
    try {
      const response = await fetch(`${API_URL}/memories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete memory");
      }

      console.log("Deleted memory ID:", id); // Log the ID of deleted memory
      return id; // Return the deleted memory's ID
    } catch (error) {
      console.error("Error deleting memory:", error);
      throw error; // Let the caller handle the error
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this memory?"); // Confirmation dialog
    if (confirmDelete) {
      try {
        const deletedId = await deleteMemory(id); // Call delete function
        setUserMemories((prevMemories) => prevMemories.filter((memory) => memory.id !== deletedId)); // Update state to remove the deleted memory
        alert("Memory deleted successfully."); // Confirm deletion
      } catch (error) {
        console.error("Failed to delete memory:", error);
      }
    }
  };

  useEffect(() => {
    const getUserLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userDetails = await fetchUserDetails(token);
        setUserLogin(userDetails);
      } catch (error) {
        console.error("Can't fetch logged in user!", error);
        setError(error);
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    getUserLogin();
  }, [navigate]);

  useEffect(() => {
    const fetchMemories = async () => {
      if (userLogin) {
        const token = localStorage.getItem("token");
        const userId = userLogin.user.id;
        try {
          const memories = await fetchUserMemories(userId, token);
          setUserMemories(memories);
        } catch (error) {
          console.error("Error fetching user memories:", error);
          setError(error);
        } finally {
          setLoadingMemories(false);
        }
      }
    };

    fetchMemories();
  }, [userLogin]);

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
        <ul>
          {userMemories.map((memory) => (
            <li key={memory.id}>
              <div>{memory.title}</div>
              <div>"{memory.description}"</div>
              {memory.image_url ? (
                <img src={memory.image_url} alt={memory.title} />
              ) : (
                <div>No Image Available</div>
              )}
              <div>{memory.dimension}</div>
              <button onClick={() => handleDeleteClick(memory.id)}>Delete</button> {/* Delete button */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No memories found.</p>
      )}
    </div>
  );
};

export default Account;