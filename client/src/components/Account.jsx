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
  const [isEditing, setIsEditing] = useState(false); // State to manage editing
  const [currentMemory, setCurrentMemory] = useState(null); // Track the memory being edited
  const [updateData, setUpdateData] = useState({}); // Data to update
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
      const response = await fetch(
        `${API_URL}/memories/users/${userId}/memories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

  // update user memory
  const updateMemory = async (memoryId, updatedFields) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/memories/${memoryId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Failed to update memory");
      }

      const updatedMemory = await response.json();
      return updatedMemory;
    } catch (error) {
      console.error("Error updating memory:", error);
      throw error;
    }
  };

  const handleUpdateClick = (memory) => {
    setIsEditing(true); // Set editing mode
    setCurrentMemory(memory); // Set the memory to be edited
    setUpdateData({
      title: memory.title,
      description: memory.description,
      dimension: memory.dimension,
      // Include other fields you want to allow updating
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const updatedMemory = await updateMemory(currentMemory.id, updateData);
      setUserMemories((prevMemories) =>
        prevMemories.map((mem) =>
          mem.id === updatedMemory.id ? updatedMemory : mem
        )
      );
      setIsEditing(false); // Exit editing mode
      setCurrentMemory(null); // Clear current memory
    } catch (error) {
      console.error("Error updating memory:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this memory?"
    ); // Confirmation dialog
    if (confirmDelete) {
      try {
        const deletedId = await deleteMemory(id); // Call delete function
        setUserMemories((prevMemories) =>
          prevMemories.filter((memory) => memory.id !== deletedId)
        ); // Update state to remove the deleted memory
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
    <div className="account-page">
  <div className="account-container">
      <h2>Account Details</h2>
      <p>
        <strong>Username:</strong> {userLogin.user.username}
      </p>
      <p>
        <strong>Dimension:</strong> {userLogin.user.dimension}
      </p>
      <h3>{userLogin.user.username}'s Memories of What's in SMF's Backpack:</h3>
      {isEditing && (
        <form onSubmit={handleUpdateSubmit}>
          <h3>Updating: {currentMemory.title}</h3>
          <label>
            Title:
            <input
              type="text"
              value={updateData.title}
              onChange={(e) =>
                setUpdateData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={updateData.description}
              onChange={(e) =>
                setUpdateData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Dimension:
            <input
              type="text"
              value={updateData.dimension}
              onChange={(e) =>
                setUpdateData((prev) => ({
                  ...prev,
                  dimension: e.target.value,
                }))
              }
            />
          </label>
          <div className="button-container">
      <button type="submit">Update Memory</button>
      <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
        </form>
      )}
      {userMemories.length > 0 ? (
        <ul>
          {userMemories.map((memory) => (
            <li key={memory.id}>
              <div>{memory.title}</div>
              <div>“{memory.description}"</div>
              {memory.image_url ? (
                <img src={memory.image_url} alt={memory.title} />
              ) : (
                <div>No Image Available</div>
              )}
              <div>{memory.dimension}</div>
              <div className="button-container">
                <button onClick={() => handleUpdateClick(memory)}>Edit</button>
                <button onClick={() => handleDeleteClick(memory.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No memories found.</p>
      )}
      
    </div>
    </div>
  
  );
};

export default Account;
