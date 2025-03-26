// components/Memories.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateMemory from "./CreateMemory"; // Import CreateMemory component
import "../css/Memories.css"; // Import CSS for the Memories component

// API Link
import { API_URL, defaultImage } from "../App";

const Memories = ({ token, setToken, userId, setUserId }) => {
  const navigate = useNavigate();
  const [availableMemories, setAvailableMemories] = useState([]);
  const [error, setError] = useState(null);

  const getAllMemories = async () => {
    try {
      const response = await fetch(`${API_URL}/memories/`);
      const memoriesData = await response.json();
      console.log("getAllMemories inspect!", memoriesData); // Log fetched memories
      setAvailableMemories(memoriesData.memories); // Set data to state
    } catch (error) {
      console.error("Can't remember all memories!", error);
      setError(error);
    }
  };

  useEffect(() => {
    getAllMemories();
  }, []);

  if (error) {
    return <div>Error retrieving memories: {error.message}</div>; // Handle the error
  }

  return (
    <>
      <div className="memories-page" /* css for the bg image to repeat */>
        <div className="backpack-prompt">
          <div className="logo-container">
            <img
              id="logo-image"
              src="https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/0ff75922-3cc9-487d-b4f2-767f72be03c8/asset-nomatic-backpack-darker.png?content-type=image%2Fpng"
              alt="Black Backpack"
            />

            <div className="prompt-all-memories">
              <h1>What's in SMF's Backpack?</h1>
              <h2>Scroll down to contribute and view memories!</h2>
              <CreateMemory
                token={token}
                setToken={setToken}
                userId={userId}
                setUserId={setUserId}
              />
              <p>Music: “Opalescence I" by EAGLEBABEL, 2024</p>
            </div>
          </div>
        </div>

        <div className="memories-container">
          {availableMemories.length > 0 ? (
            availableMemories.map((memory) => (
              <div
                key={memory.id}
                className="memory-item"
                onClick={() => navigate(`/memory/${memory.id}`)} // Navigate to Memory detail page
              >
                <img
                  src={memory.image_url || defaultImage} // Use default image if no image provided
                  alt={`${memory.title} item of memory`}
                />
                <div className="memory-title">{memory.title}</div>
              </div>
            ))
          ) : (
            <p>Can't remember!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Memories;
