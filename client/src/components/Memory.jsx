import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Memory.css";

import { API_URL, defaultImage } from "../App";

const Memory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSingleMemory = async () => {
      try { // http://localhost:3000/api/memories/:memoryId
        const response = await fetch(`${API_URL}/memories/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching memory data"); // Handle non-200 responses
        }
        
        const memoryData = await response.json();
        console.log("getOneMemory inspect!", memoryData); // Log fetched memory
        setMemory(memoryData); // Set data to state
      } catch (error) {
        console.error("Can't remember this memory...", error);
        setError(error);
      } finally {
        setLoading(false); // set to this state after fetch
      }
    };

    getSingleMemory();
  }, [id]);

  if (loading) {
    return <p>loading... </p>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log("Single Memory in Render:", memory);

  // // Function to handle navigation back to "/"
  const handleBackClick = () => {
      console.log("handleBackClick!")
      navigate("/"); // Navigate back to home
  };

  return ( // http://localhost:3000/api/memories/:memoryId
    <div className="memories-page">
    <div className="memory-container" >
      {memory ? ( // Check if singleMemory is not null
        <div >
          <div className="memory-title" >{memory.memory.title}</div>
          <div className="memory-desc">“{memory.memory.description}"</div>
          <img 
            src={memory.memory.image_url || defaultImage}
            alt={`${memory.memory.title} item of memory`}
          />
          <button onClick={handleBackClick} >Back to Memories</button>
        </div>
      ) : (
        <p>Can't remember!</p>
      )}
    </div>
    </div>

  );
};
export default Memory;


/*
onClick={() => navigate(-1)}
*/
