import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../App";

const CreateMemory = ({ token, userId, setUserId }) => { // removed userId
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    dimension: "", // Gather dimension if it's part of the submission; ensure to collect it from the user if necessary
  });

  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form to submit memories which require usedId
  const handleSubmit = async (e) => {
  //   e.preventDefault();
  
    try {
      const response = await fetch(`${API_URL}/memories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure the token is sent for authorization if required
        },
        body: JSON.stringify({
          ...formData,
          userId: userId, // For example purposes, replace this with the actual userId based on your auth context
        }),

      });

      if (!response.ok) {
        throw new Error("Failed to create memory");
      }

      const memory = await response.json();
      console.log("Memory created successfully:", memory);
      // Optionally update state to reflect new memory, or trigger a refresh of memories here
    
    
    } catch (error) {
      console.error("Error creating memory:", error);
      // Handle error appropriately for your UI
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Memory</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Dimension:</label>
        <input
          type="text"
          name="dimension"
          value={formData.dimension}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit Memory</button>
    </form>
  );
};

export default CreateMemory;
