import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Memory.css";

import { API_URL } from "../App";
// import { getMemoryById } from "../../../server/db";

// API Link
// const API_URL = `http://localhost:3000/api`;

const Memory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [singleMemory, setSingleMemory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);s

    useEffect(() => {
        const getSingleMemory= async () => {
            try {
              const response = await getMemoryById(`${API_URL}/memories/:memoryId/`);
              const memoryData = await response.json();
              console.log("getOneMemory inspect!", memoriesData); // Log fetched memory
              setAvailableMemories(memoryData.memories); // Set data to state
            } catch (error) {
              console.error("Can't remember this memory...", error);
              setError(error);
            }
          };
          getSingleMemory();

    }, [])

}
export default Memory;