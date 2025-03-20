// components/Memories.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Memories.css"; // Import CSS for the Memories component

// API Link
import { API_URL, defaultImage } from "../App";

const Memories = () => {
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
            <div className="memory-desc">"{memory.description}"</div>
          </div>
        ))
      ) : (
        <p>Can't remember!</p>
      )}
    </div>
  );
};

export default Memories;