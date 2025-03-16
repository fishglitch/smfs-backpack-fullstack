/*
Purpose: This file primarily serves as a module containing 
methods that handle database operations such as creating, 
reading, updating, and deleting users, posts, and tags.

Functionality:
- establishes a connection to PostgreSQL database via pg module.
- defines various functions to interact with the users, posts, and tags tables.
- functions and methods for managing tags.
- exports client & functions for use in other app parts incl. seed.js file.

index.js: encapsulates all database operations, acts as a reusable module for core database interaction functions, for data logic maintenance and management.
seed.js: initialization and setup aspect; prepares db by creating schema + seeding it with initial data for functional and integration tests
*/

require("dotenv").config();
const { Client } = require("pg"); // imports the pg module
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "shhh";

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://localhost:5432/schrodingers_backpack",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

/**
 * USER Methods
 */

const createUser = async ({ username, password, dimension }) => {
   const id = uuid.v4(); // Generate a new UUID for the user
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  try {
    const res = await client.query(`
      INSERT INTO users (username, password, dimension) 
      VALUES ($1, $2, $3) RETURNING *`, [username, hashedPassword, dimension]);

  return res.rows[0]; // Return the newly created user
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// review!!!
const updateUser = async (userId, { username, password, dimension }) => {
  try {
    const fields = [];
    const values = [userId];
    let index = 1;

    if (username) {
      fields.push(`username = $${++index}`);
      values.push(username);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      fields.push(`password = $${++index}`);
      values.push(hashedPassword);
    }
    if (dimension) {
      fields.push(`dimension = $${++index}`);
      values.push(dimension);
    }

    const SQL = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const response = await client.query(SQL, values);
    return response.rows[0]; // Return the updated user
  } catch (error) {
    console.error("Error updating user!", error);
    throw error;
  }
};

const getAllUsers = async (username) => {
  try {
    const SQL = `SELECT * FROM users`;
        const response = await client.query(SQL);
        return response.rows;
  } catch (error) {
    console.error("Error retrieving all users:", error);
    throw error;
  }
};
// i don't have userId, trying out dimension as prop
const getUserByDimension = async (dimension) => {
  try {
    const SQL = `SELECT * FROM users WHERE dimension = $1`;
        const response = await client.query(SQL, [userId]);
        return response.rows[0];
  } catch (error) {
    console.error("Error retrieving user by dimension:", error);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const SQL = `SELECT * FROM users WHERE username = $1`;
    const response = await client.query(SQL, [username]);
    return response.rows[0];
  } catch (error) {
    console.error();
    throw error;
  }
};

const createMemory = async ({ title, imageUrl, description, dimension, author_nickname }) => {
  try {
    const id = uuid.v4(); // Generate a new UUID for the user
    const SQL = `
            INSERT INTO memories (id, title, image_url, description, dimension, author_nickname) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const response = await client.query(SQL, [id, title, imageUrl, description, dimension, author_nickname]);
        return response.rows[0];
  } catch (error) {
    console.error("Error creating memory:", error);
    throw error;
  }
};

// update
const updateMemory = async (memoryId, { title, imageUrl, description, dimension }) => {
  try {
    const fields = [];
    const values = [memoryId];
    let index = 1;

    if (title) {
      fields.push(`title = $${++index}`);
      values.push(title);
    }
    if (imageUrl) {
      fields.push(`image_url = $${++index}`);
      values.push(imageUrl);
    }
    if (description) {
      fields.push(`description = $${++index}`);
      values.push(description);
    }
    if (dimension) {
      fields.push(`dimension = $${++index}`);
      values.push(dimension);
    }

    const SQL = `
      UPDATE memories
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    
    const response = await client.query(SQL, values);
    return response.rows[0]; // Return the updated memory
  } catch (error) {
    console.error("Error updating memory!", error);
    throw error;
  }
};

const getAllMemories = async () => {
  try {
    const SQL = `SELECT * FROM memories`;
        const response = await client.query(SQL);
        return response.rows;
  } catch (error) {
    console.error("Error retrieving all memories:", error);
    throw error;
  }
};

const getMemoryById = async (memoryId) => {
  try {
    const SQL = `SELECT * FROM memories WHERE id = $1;`;
    const response = await client.query(SQL, [memoryId]);
    
    return response.rows[0]; // Return the memory
  } catch (error) {
    console.error();
    throw error;
  }
};

const getMemoriesByUser = async (userId) => {
  try {
    const SQL = `SELECT * FROM memories WHERE author_nickname = (SELECT username FROM users WHERE id = $1);`;
    const response = await client.query(SQL, [userId]);
    
    return response.rows; // Return the list of memories associated with the user
  } catch (error) {
    console.error();
    throw error;
  }
};

module.exports = {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserByDimension,
  getUserByUsername,
  getMemoryById,
  createMemory,
  updateMemory,
  getAllMemories,
  getMemoriesByUser,
};
