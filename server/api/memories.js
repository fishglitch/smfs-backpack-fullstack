import express from "express"; // import "dotenv/config";

import { config } from 'dotenv';
config({ path: '../../.env' });
console.log('JWT_SECRET: located in memories.js', process.env.JWT_SECRET);

import jwt from "jsonwebtoken"; // Change to ES Module import

import requireUser from "./utils.js";

const memoriesRouter = express.Router();
memoriesRouter.use(express.json());

import {
  getAllMemories,
  getMemoryById,
  // getMemoriesByUser,
  createMemory,
  // updateMemory,
  deleteMemory,
} from "../db/index.js"; // Change to ES Module import

// GET ALL MEMORIES /api/memories/
// in the back
memoriesRouter.get("/", async (req, res, next) => {
  try {
    const memories = await getAllMemories();

    res.send({
      memories,
    });
  } catch ({ ex }) {
    next({ ex });
  }
});

// GET MEMORIES BY ID http://localhost:3000/api/memories/:memoryId
memoriesRouter.get("/:memoryId", async (req, res, next) => {
  const { memoryId } = req.params; //access memoryId from req.params

  try {
    const memory = await getMemoryById(memoryId);

    res.send({
      memory,
    });
  } catch ({ ex }) {
    next({ ex });
  }
});

/* NOT FUNCTIONAL RIGHT NOW GET MEMORIES BY USER
memoriesRouter.get("/memories/users/:usersId/memories", async (req, res, next)=> {
  const {userId} = req.params; // access userId from request params

  try {
    const memories = await getMemoriesByUser(userId);

    if (memories.length === 0){
      return res.status(404).json({message: 'No memories found for this user'})
    }
    res.send({memories});
  } catch({ex}){
    next({ex});
  }
});
*/

memoriesRouter.get("/users/:userId/memories", async (req, res, next) => {
  const {userId} = req.params;
  console.log("userid", userId)
  try {
    const memories = await getMemoriesByUser(userId);

    if (memories.length === 0){
      return res.status(404).json({message: 'No memories found for this user'})
    }
    res.send({memories});
  } catch({ex}){
    next({ex});
  }
});

// POST MEMORY (CREATE MEMORY) http://localhost:3000/api/memories
memoriesRouter.post("/", async (req, res, next) => { // requireUser,
  console.log("req.body", req.body);
  
  const {
    title,
    imageUrl,
    description,
    display_name,
    dimension,
    // visibility,
    // tags,
  } = req.body;

  // Initialize memoryData object
  const memoryData = {};

  try {
    // Ensure req.user is defined and contains valid user ID
    if (!req.user || !req.user.id) {
      return next({
        name: "UnauthorizedError",
        message: "You must be logged in to create a memory",
      });
    }

    // Populate memoryData object with relevant information
    // memoryData.authorId = req.user.id; // Assuming req.user has been populated by requireUser
    memoryData.title = title;
    memoryData.imageUrl = imageUrl;
    memoryData.description = description;
    memoryData.display_name = display_name;
    memoryData.dimension = dimension;
    // memoryData.visibility = visibility;
    // memoryData.tags = tags;

    console.log("memory data", memoryData);

    // Create the memory
    const memory = await createMemory(memoryData);

    if (memory) {
      res.send(memory); // Send the created memory
    } else {
      next({
        name: "Memory Creation Error",
        message: "Error in creating your memory. Please try resubmitting",
      });
    }
  } catch (error) {
    // Adjusted to catch a general error
    console.error("Error creating memory:", error);
    next({
      name: "InternalServerError",
      message: "An unexpected error occurred while creating memory",
    });
  }
});

export default memoriesRouter; // Export
