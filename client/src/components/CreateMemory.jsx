import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import "../css/CreateMemory.css";


const CreateMemory = ({ token, setToken, userId, setUserId }) => {
  // removed userId
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    dimension: "", // Gather dimension if it's part of the submission; ensure to collect it from the user if necessary
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form to submit memories which require usedId
  const handleSubmit = async (e) => {
    e.preventDefault();

  // Log the userId to check its value before making API call
  console.log("User ID before submission:", userId);

  // Log the formData to check its contents before the submission
  console.log("Form Data before submission:", formData);

    try {
      const response = await fetch(`${API_URL}/memories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure the token is sent for authorization if required
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId, // changed from userId to user_id to see if that's the issue
        }),
      });
      // This line is potentially problematic as it attempts to read response.json() twice
      const memory = await response.json(); // This should come after checking if response is ok

      if (!response.ok) {
        throw new Error("Failed to create memory");
      }

      console.log("Memory created successfully:", memory);

      // Check if userId in returned memory is valid
      if (!memory.user_id) {
        console.error("Created memory does not have a valid userId:", memory);
      }

      // Possibly navigate or update the UI accordingly
      navigate("/account"); // account, previously; testing. 
    } catch (error) {
      console.error("Error creating memory:", error);
      // Handle error appropriately for your UI
    }
    console.log("hello?", handleChange);
  };

  return (
    <div className="create-memory-form">
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
      <button type="submit">Submit Memory</button>
    </form>
    </div>
  );
};

export default CreateMemory;
