// FormComponent.jsx
import React, { useState } from "react";

const CreateMemory = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    dimension: ''  // Gather dimension if it's part of the submission; ensure to collect it from the user if necessary
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData); // Calls the function passed from the parent with the form data
      // Optionally reset form after submission
      setFormData({ title: '', description: '', imageUrl: '', dimension: '' });
    } catch (error) {
      console.error("Error submitting memory:", error);
      // Handle error appropriately for your UI, such as displaying a message.
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